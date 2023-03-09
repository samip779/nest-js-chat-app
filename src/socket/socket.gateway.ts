import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';

import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthService } from 'src/auth/auth.service';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ClientMessageDto } from './dto/client-message.dto';
import { WsCatchAllFilter } from 'src/exceptions/web-socket.exception.filter';
import { FilesService } from 'src/files/files.service';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly messageService: MessagesService,
    private readonly fileService: FilesService,
  ) {}

  @WebSocketServer() io: Server;

  afterInit(server: Server): void {
    this.fileService.server = server;
    this.logger.log('Web socket gateway initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`ws client with id ${client.id} is connected`);
    try {
      // Extract token from header
      const token = client.handshake.headers.authorization.split(' ')[1];

      // Verify and get the user from auth service
      const user: User = await this.authService.verifyUser(token);

      if (!user) throw new WsException('No user with that token');

      client.data = { userId: user.id };

      client.join(client.data.userId.toString());
    } catch (e) {
      throw new WsException('Invalid token');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`ws client with id ${client.id} is disconnected`);
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new WsCatchAllFilter())
  @SubscribeMessage('msg-send')
  async handleMessage(client: Socket, data: ClientMessageDto) {
    // if (!data.to || !data.text)
    //   throw new WsException('incorrect message format');

    if (data.to === client.data.userId)
      throw new WsException(
        'You cannot send and receive message from the same id',
      );

    if (!(await this.userService.userExists(data.to))) {
      throw new WsException(`User with id ${data.to} doesnot exists`);
    }

    const result = await this.messageService.createMessage({
      sender_id: +client.data.userId,
      receiver_id: data.to,
      text: data.text,
    });

    if (result) {
      client
        .to(data.to.toString())
        .emit('msg-receive', { from: client.data.userId, text: data.text });
    } else {
      throw new WsException('something went wrong');
    }
  }

  @SubscribeMessage('logout')
  handleLogout(client: Socket) {
    client.disconnect();
  }
}

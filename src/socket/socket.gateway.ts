import { Logger } from '@nestjs/common';

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
import { User } from 'src/users/entities/user.entity';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer() io: Server;

  afterInit(): void {
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
      throw new WsException(e.message);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`ws client with id ${client.id} is disconnected`);
  }

  @SubscribeMessage('msg-send')
  handleMessage(client: Socket, data: { to: number; text: string }) {
    client
      .to(data.to.toString())
      .emit('msg-receive', { from: client.data.userId, text: data.text });
  }
}

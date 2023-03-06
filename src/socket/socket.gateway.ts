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
  onlineUsers = new Map<number, string>();

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

      // set the user to online users
      this.onlineUsers.set(user.id, client.id);
    } catch (e) {
      throw new WsException(e.message);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`ws client with id ${client.id} is disconnected`);

    // remove user from online users
    this.onlineUsers.delete(client.data.userId);
  }

  @SubscribeMessage('msg-send')
  handleMessage(client: Socket, data: { to: number; text: string }) {
    const sendUserSocket = this.onlineUsers.get(data.to);

    if (sendUserSocket) {
      client.to(sendUserSocket).emit('msg-receive', data.text);
    }
  }
}

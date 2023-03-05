import { OnModuleInit } from '@nestjs/common';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log(socket.id);
      try {
        const token = socket.handshake.headers.authorization.split('')[1];
        if (!token) {
          socket.disconnect();
        }

        const user = await this.authService.verifyUser(token);

        if (!user) socket.disconnect();

        console.log(user);
      } catch (e) {
        console.log(e.message);
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', body);
  }
}

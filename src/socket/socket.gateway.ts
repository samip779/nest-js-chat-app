import { OnModuleInit } from '@nestjs/common';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { AuthService } from 'src/auth/auth.service';

type AuthPayload = {
  user: any;
};

export type ServerWithAuth = Server & AuthPayload;

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  server: ServerWithAuth;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log(socket.id);
      try {
        const token = socket.handshake.headers.authorization;
        if (!token) {
          socket.disconnect();
        }
        const extractedToken = token.split(' ')[1];

        const user = await this.authService.verifyUser(extractedToken);

        if (!user) socket.disconnect();
        delete user.password;
        this.server.user = user;
      } catch (e) {
        console.log(e.message);
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', this.server.user.email);
  }
}

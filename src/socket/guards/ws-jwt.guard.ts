import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { WsException } from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authToken: string =
        client.handshake?.headers?.authorization.split('')[1];
      if (!authToken) throw new WsException('no token');
      const user: User = await this.authService.verifyUser(authToken);
      context.switchToHttp().getRequest().user = user;
      return Boolean(user);
    } catch (e) {
      throw new WsException(e.message);
    }
  }
}

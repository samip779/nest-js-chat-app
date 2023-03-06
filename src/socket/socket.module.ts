import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [JwtModule, UsersModule, AuthModule, MessagesModule],
  providers: [SocketGateway],
})
export class SocketModule {}

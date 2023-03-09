import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [JwtModule, UsersModule, AuthModule, MessagesModule, FilesModule],
  providers: [SocketGateway],
})
export class SocketModule {}

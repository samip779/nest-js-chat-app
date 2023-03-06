import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { SocketModule } from './socket/socket.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UsersModule,
    SocketModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

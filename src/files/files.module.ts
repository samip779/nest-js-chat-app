import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [MessagesModule, SocketModule],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [],
})
export class FilesModule {}

import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class FilesService {
  public server: Server;

  constructor(private readonly messageService: MessagesService) {}

  async uploadFile(file: Express.Multer.File, from: number, to: number) {
    const response = {
      filepath: `http://localhost:3001/api/files/${file.filename}`,
    };

    await this.messageService.createMessage({
      sender_id: from,
      receiver_id: to,
      text: response.filepath,
    });

    this.server
      .to([to.toString(), from.toString()])
      .emit('msg-receive', response);
    return { message: 'file sent successfully' };
  }
}

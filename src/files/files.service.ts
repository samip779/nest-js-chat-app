import { Injectable } from '@nestjs/common';

import { MessagesService } from 'src/messages/messages.service';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly messageService: MessagesService,
    private readonly socketService: SocketService,
  ) {}

  async uploadFile(file: Express.Multer.File, from: number, to: number) {
    const response = {
      filepath: `http://localhost:3001/api/files/${file.filename}`,
    };

    await this.messageService.createMessage({
      sender_id: from,
      receiver_id: to,
      text: response.filepath,
    });

    this.socketService.chat
      .to([to.toString(), from.toString()])
      .emit('msg-receive', response, from);
    return { message: 'file sent successfully' };
  }
}

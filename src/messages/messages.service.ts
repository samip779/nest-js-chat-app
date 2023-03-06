import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDetails } from 'src/utils/types';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  createMessage(
    messageDetails: CreateMessageDetails,
  ): Promise<Message> | boolean {
    if (messageDetails.receiver_id === messageDetails.sender_id) return false;
    if (messageDetails.text !== '') {
      const message = this.messageRepository.create(messageDetails);
      return this.messageRepository.save(message);
    }
  }
}

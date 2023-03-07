import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDetails } from 'src/utils/types';
import { User } from 'src/users/entities/user.entity';

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

  async getMessages(user: User, id: number) {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where('message.sender_id = :id1', { id1: id })
      .andWhere('message.receiver_id = :id2', { id2: user.id })
      .orWhere('message.sender_id = :id3', { id3: user.id })
      .andWhere('message.receiver_id = :id4', { id4: id })
      .getMany();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDetails } from 'src/utils/types';
import { User } from 'src/users/entities/user.entity';
import {
  IPaginateResponse,
  paginatedResponse,
} from 'src/utils/typeorm/paginator';

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

  async getMessages(
    user: User,
    id: number,
    query: { page: number; limit: number },
  ): Promise<IPaginateResponse> {
    const take = query.limit > 50 ? 50 : query.limit;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    const data = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.sender_id = :id1', { id1: id })
      .andWhere('message.receiver_id = :id2', { id2: user.id })
      .orWhere('message.sender_id = :id3', { id3: user.id })
      .andWhere('message.receiver_id = :id4', { id4: id })
      .orderBy('created_at', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginatedResponse(data, page, take);
  }
}

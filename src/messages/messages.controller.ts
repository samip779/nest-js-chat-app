import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { IPaginateResponse } from 'src/utils/typeorm/paginator';

@UseGuards(JwtGuard)
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get(':id')
  getMessages(
    @GetUser() user: User,
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(2)) limit: number,
  ): Promise<IPaginateResponse> {
    return this.messageService.getMessages(user, id, { page, limit });
  }
}

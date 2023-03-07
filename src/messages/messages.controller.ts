import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get(':id')
  getMessages(@GetUser() user: User, @Param('id') id: number) {
    return this.messageService.getMessages(user, id);
  }
}

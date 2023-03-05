import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Routes } from 'src/utils/constants';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { UsersService } from 'src/users/users.service';

import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@GetUser() user: User) {
    return this.authService.generateToken(user.id, user.email);
  }

  @UseGuards(JwtGuard)
  @Get()
  test(@GetUser() user: User) {
    return user;
  }
}

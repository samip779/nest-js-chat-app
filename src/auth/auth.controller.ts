import { Body, Controller, Post } from '@nestjs/common';
import { Routes } from 'src/utils/types';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }

  @Post('login')
  loginUser() {}
}

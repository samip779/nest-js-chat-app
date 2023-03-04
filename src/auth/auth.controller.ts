import { Body, Controller, Post } from '@nestjs/common';
import { Routes } from 'src/utils/constants';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { UsersService } from 'src/users/users.service';

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

  @Post('login')
  loginUser() {}
}

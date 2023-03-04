import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!(await bcrypt.compare(password, user.password)))
      throw new HttpException(
        'Password did not matched',
        HttpStatus.BAD_REQUEST,
      );

    delete user.password;
    return user;
  }
}

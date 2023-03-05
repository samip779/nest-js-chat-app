import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  async generateToken(id: number, email: string) {
    const payload = {
      sub: id,
      email,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '8600s',
      secret: this.configService.get('JWT_SECRET'),
    });

    return { access_token };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDetails } from 'src/utils/types';

@Injectable()
export class UsersService {
  createUser(userDetails: CreateUserDetails) {
    console.log('userservice.createUser');
  }
}

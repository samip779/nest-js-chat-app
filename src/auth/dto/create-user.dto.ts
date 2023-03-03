import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}

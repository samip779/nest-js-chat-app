import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ClientMessageDto {
  @IsNotEmpty()
  @IsNumber()
  to: number;

  @IsNotEmpty()
  @IsString()
  text: string;
}

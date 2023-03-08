import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const socket: Socket = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();

      const wsException = new WsException({
        message: exceptionData['message'] ?? 'Bad Request',
      });

      socket.emit('exception', wsException.getError());
      return;
    }

    const wsException = new WsException({
      message: exception.message,
    });

    socket.emit('exception', wsException.getError());
  }
}

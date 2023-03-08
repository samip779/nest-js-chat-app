import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const socket: Socket = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionDataStatus = exception.getStatus();

      const wsException = new WsException({
        status: exceptionDataStatus,
        message: exceptionData['message'] ?? 'Bad Request',
      });

      socket.emit('exception', wsException.getError());
      return;
    }

    const wsException = new WsException({
      status: exception.status || 500,
      message: exception.message,
    });

    socket.emit('exception', wsException.getError());
  }
}

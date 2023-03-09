import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtGuard)
  @Post('upload/:to')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
          cb(null, newFileName);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('to') to: number,
    @GetUser() user: User,
  ) {
    if (!file)
      throw new HttpException('Something wrong', HttpStatus.BAD_REQUEST);

    return this.filesService.uploadFile(file, user.id, to);
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }
}

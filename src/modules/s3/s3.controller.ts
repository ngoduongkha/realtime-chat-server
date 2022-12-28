import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiFile } from 'src/common/decorators';
import { UploadFileResponse } from './dto';
import { S3Service } from './s3.service';

@ApiTags('S3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile('file') file: Express.Multer.File): Promise<UploadFileResponse> {
    return this.s3Service.uploadPublicFile(file);
  }
}

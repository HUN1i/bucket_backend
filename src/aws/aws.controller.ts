import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AwsService } from './aws.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('s3')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const ext = extname(file.originalname).substring(1);
    const fileName = `${Date.now()}-${file.originalname}`;
    return this.awsService.imageUploadToS3(fileName, file, ext);
  }
}

import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AwsController],
  providers: [AwsService, ConfigService],
})
export class AwsModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(
    @Body() createTagDto: CreateTagDto,
    @Headers('Authorization') token: string,
  ) {
    return this.tagService.create(createTagDto, token);
  }

  @Get()
  findAll(@Headers('Authorization') token: string) {
    return this.tagService.findAll(token);
  }

  @Get('/count')
  findCount(@Headers('Authorization') token: string) {
    return this.tagService.findCount(token);
  }
  @Delete(':id')
  delete(@Param() id: number) {
    return this.tagService.delete(id);
  }
}

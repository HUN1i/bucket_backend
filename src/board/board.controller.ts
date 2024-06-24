import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Headers,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { SuccessType } from './entities/enum/success-type';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(
    @Body() createBoardDto: CreateBoardDto,
    @Headers('Authorization') token: string,
  ) {
    return this.boardService.create(token, createBoardDto);
  }

  @Get()
  findAll(@Headers('Authorization') token: string) {
    return this.boardService.findAll(token);
  }

  @Get('/random')
  findRandom(@Headers('Authorization') token: string) {
    return this.boardService.findByRandom(token);
  }
  @Get('/recent')
  findRecent(@Headers('Authorization') token: string) {
    return this.boardService.findRecent(token);
  }

  @Get('/old')
  findOld(@Headers('Authorization') token: string) {
    return this.boardService.findOld(token);
  }

  @Get('doing')
  findDoing(@Headers('Authorization') token: string) {
    return this.boardService.findDoing(token);
  }

  @Get('/tag')
  findByTag(
    @Headers('Authorization') token: string,
    @Query('tag') tag: string,
  ) {
    return this.boardService.findByTag(token, tag);
  }

  @Get('/success')
  findBySuccess(@Headers('Authorization') token: string) {
    return this.boardService.findBySuccess(token);
  }

  @Get(':id')
  findByUser(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBoardDto: any) {
    if (!updateBoardDto) return 1;
    return await this.boardService.update(+id, updateBoardDto);
  }

  @Put('/success/:id')
  updateSuccess(@Param('id') id: number, @Body() body: any) {
    return this.boardService.updateSuccess(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}

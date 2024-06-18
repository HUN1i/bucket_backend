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
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get('/recent')
  findRecent(@Headers('Authorization') token: string) {
    return this.boardService.findRecent(token);
  }

  @Get('/old')
  findOld(@Headers('Authorization') token: string) {
    return this.boardService.findOld(token);
  }

  @Get('/tag')
  findByTag(@Query('tag') tag: string) {
    return this.boardService.findByTag(tag);
  }

  @Get(':id')
  findByUser(@Param('id') id: string) {
    return this.boardService.findByUser(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    if (!updateBoardDto) return 1;
    return this.boardService.update(+id, updateBoardDto);
  }

  @Put('/success/:id')
  updateSuccess(@Param('id') id: number, @Query('type') success: SuccessType) {
    return this.boardService.updateSuccess(id, success);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}

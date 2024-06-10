import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessType } from './entities/enum/success-type';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}
  create(createBoardDto: CreateBoardDto) {
    console.log(createBoardDto);
    return this.boardRepository.save(createBoardDto);
  }

  findAll() {
    return this.boardRepository.find();
  }

  findOne(id: number) {
    return this.boardRepository.find({ where: { id } });
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return this.boardRepository.update(id, updateBoardDto);
  }

  updateSuccess(id: number, success: SuccessType) {
    return this.boardRepository.update(id, { success });
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}

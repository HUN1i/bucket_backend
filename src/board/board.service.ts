import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessType } from './entities/enum/success-type';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly authService: AuthService,
  ) {}
  create(createBoardDto: CreateBoardDto) {
    console.log(createBoardDto);
    return this.boardRepository.save(createBoardDto);
  }

  findAll() {
    return this.boardRepository.find();
  }

  async findByTag(tag: string) {
    console.log(tag);
    return await this.boardRepository
      .createQueryBuilder('board')
      .where('board.tag LIKE :tag', { tag: `%${tag}%` })
      .getMany();
  }

  async findRecent(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository.find({
      where: {
        user_id: user[0].uid,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 3,
    });
  }

  async findOld(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository.find({
      where: {
        user_id: user[0].uid,
      },
      order: {
        createdAt: 'ASC',
      },
      take: 3,
    });
  }

  findByUser(user_id: number) {
    return this.boardRepository.find({ where: { user_id } });
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return this.boardRepository.update(id, updateBoardDto);
  }

  updateSuccess(id: number, success: SuccessType) {
    return this.boardRepository.update(id, { success });
  }

  remove(id: number) {
    return this.boardRepository.delete(id);
  }
}

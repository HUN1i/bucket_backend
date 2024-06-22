import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { SuccessType } from './entities/enum/success-type';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly authService: AuthService,
  ) {}
  async create(token: string, createBoardDto: CreateBoardDto) {
    let tag: string;
    const { name, thumbnail, people, prologue } = createBoardDto;
    const tags = createBoardDto.tag.split(',');
    const user = await this.authService.validateToken(token);
    for (const tagName of tags) {
      const tagResult = await this.tagRepository.findOne({
        where: { name: tagName.trim() },
      });
      if (!tagResult) {
        this.tagRepository.save({ name: tagName.trim() });
      }
      tag = tag === undefined ? tagName.trim() : tag + ',' + tagName.trim();
    }

    return this.boardRepository.save({
      user_id: user[0].uid,
      name,
      tag,
      thumbnail,
      people,
      prologue,
    });
  }

  async findAll(token: string) {
    const user = await this.authService.validateToken(token);

    return await this.boardRepository.find({ where: { user_id: user[0].uid } });
  }

  async findDoing(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository.find({
      where: {
        success: SuccessType.DOING,
        user_id: user[0].uid,
      },
    });
  }
  async findByTag(token: string, tag: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository
      .createQueryBuilder('board')
      .andWhere('board.tag LIKE :tag', { tag: `%${tag}%` })
      .andWhere('board.user_id = :user_id', { user_id: user[0].uid })
      .getMany();
  }

  async findBySuccess(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository
      .createQueryBuilder('board')
      .andWhere('board.user_id = :user_id', { user_id: user[0].uid })
      .andWhere('board.success = :success', { success: 'success' })
      .getMany();
  }

  async findRecent(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository.find({
      where: {
        user_id: user[0].uid,
        success: SuccessType.DOING,
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
        success: SuccessType.DOING,
      },
      order: {
        createdAt: 'ASC',
      },
      take: 3,
    });
  }

  findOne(id: number) {
    return this.boardRepository.find({ where: { id } });
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return this.boardRepository.update(id, updateBoardDto);
  }

  updateSuccess(id: number, body: any) {
    return this.boardRepository.update(id, body);
  }

  remove(id: number) {
    return this.boardRepository.delete(id);
  }
}

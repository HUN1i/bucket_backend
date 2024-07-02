import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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
        where: { name: tagName.trim(), user_id: user[0].uid },
      });
      if (!tagResult) {
        if (tags[0] === '') continue;
        this.tagRepository.save({ name: tagName.trim(), user_id: user[0].uid });
      }
      if (tags[0] === '') {
        tag = null;
      } else
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

    return await this.boardRepository.find({
      where: { user_id: user[0].uid },
      order: { id: 'DESC' },
    });
  }

  async findByOthers(token: string) {
    const user = await this.authService.validateToken(token);

    return await this.boardRepository
      .createQueryBuilder('board')
      .select([
        'board.id',
        'board.thumbnail',
        'board.name',
        'board.tag',
        'board.createdAt',
      ])
      .where('board.user_id != :user_id', { user_id: user[0].uid })
      .orderBy('RAND()')
      .limit(4)
      .getMany();
  }
  async findByRandom(token: string) {
    const user = await this.authService.validateToken(token);

    return await this.boardRepository
      .createQueryBuilder('board')
      .select(['board.id', 'board.thumbnail', 'board.name'])
      .where('board.user_id = :user_id', { user_id: user[0].uid })
      .orderBy('RAND()')
      .limit(5)
      .getMany();
  }

  async findAchieve(token: string) {
    const user = await this.authService.validateToken(token);
    const all = await this.boardRepository.count({
      where: { user_id: user[0].uid },
    });
    const success = await this.boardRepository.count({
      where: { user_id: user[0].uid, success: SuccessType.SUCCESS },
    });
    const doing = await this.boardRepository.count({
      where: { user_id: user[0].uid, success: SuccessType.DOING },
    });

    return { data: { all, success, doing } };
  }

  async findAverage(token: string) {
    const user = await this.authService.validateToken(token);
    const all = await this.boardRepository.count({
      where: { user_id: user[0].uid },
    });

    const oldest = await this.boardRepository.findOne({
      select: ['createdAt'],
      where: { user_id: user[0].uid },
      order: {
        createdAt: 'ASC',
      },
    });

    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const korNow = new Date(utc + koreaTimeDiff);

    const givenDate: Date = new Date(oldest.createdAt.toString());
    const timeDifference = korNow.getTime() - givenDate.getTime();
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const monthCount = await this.boardRepository
      .createQueryBuilder('board')
      .select("DATE_FORMAT(board.createdAt, '%Y-%m')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('board.user_id = :user_id', { user_id: user[0].uid })
      .groupBy('month')
      .orderBy('month')
      .getRawMany();

    const totalCount = monthCount.reduce(
      (sum, item) => sum + parseInt(item.count, 10),
      0,
    );
    let dayAverage;
    if (dayDifference === 0) {
      dayAverage = all.toFixed(1);
    } else {
      dayAverage = (all / dayDifference).toFixed(1);
    }
    const averageCount = (totalCount / monthCount.length).toFixed(1);
    return { day: dayAverage, month: monthCount, average: averageCount };
  }

  async findDoing(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository.find({
      where: {
        success: SuccessType.DOING,
        user_id: user[0].uid,
      },
      order: { id: 'DESC' },
    });
  }
  async findByTag(token: string, tag: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository.find({
      where: {
        tag: Like(`%${tag}%`),
        user_id: user[0].uid,
        success: SuccessType.DOING,
      },
      order: { id: 'DESC' },
    });
  }

  async findBySuccess(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.boardRepository
      .createQueryBuilder('board')
      .andWhere('board.user_id = :user_id', { user_id: user[0].uid })
      .andWhere('board.success = :success', { success: 'success' })
      .orderBy('board.id', 'DESC')
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
      take: 4,
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
      take: 4,
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

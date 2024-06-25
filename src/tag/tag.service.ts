import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly authService: AuthService,
  ) {}
  async create(createTagDto: CreateTagDto, token: string) {
    const user = await this.authService.validateToken(token);
    return this.tagRepository.save({
      name: createTagDto.name,
      user_id: user[0].uid,
    });
  }

  async findAll(token: string) {
    const user = await this.authService.validateToken(token);
    return await this.tagRepository.find({ where: { user_id: user[0].uid } });
  }

  async findCount(token: string) {
    const user = await this.authService.validateToken(token);
    const tagCount = await this.tagRepository.count({
      where: { user_id: user[0].uid },
    });
    const randomTag = await this.tagRepository
      .createQueryBuilder('tag')
      .select(['tag.id', 'tag.name'])
      .where('tag.user_id = :user_id', { user_id: user[0].uid })
      .orderBy('RAND()')
      .limit(5)
      .getMany();
    return { tagCount, randomTag };
  }
  delete(id: number) {
    this.tagRepository.delete(id);
  }
}

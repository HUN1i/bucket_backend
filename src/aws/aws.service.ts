import { Injectable } from '@nestjs/common';
import { CreateAwDto } from './dto/create-aw.dto';
import { UpdateAwDto } from './dto/update-aw.dto';

@Injectable()
export class AwsService {
  create(createAwDto: CreateAwDto) {
    return 'This action adds a new aw';
  }

  findAll() {
    return `This action returns all aws`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aw`;
  }

  update(id: number, updateAwDto: UpdateAwDto) {
    return `This action updates a #${id} aw`;
  }

  remove(id: number) {
    return `This action removes a #${id} aw`;
  }
}

const dotenv = require('dotenv');
dotenv.config();
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './payload/tokenPayload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async assignAccessToken(user: CreateAuthDto) {
    const isExist = await this.userRepository.find({
      where: { user_id: user.email },
    });
    if (isExist.length === 0) {
      console.log(user.name);
      await this.userRepository.save({
        user_id: user.email,
        name: user.name,
      });
    }
    return;
  }

  async createAccessToken(user: CreateAuthDto) {
    const findUser = await this.userRepository.find({
      where: { user_id: user.email },
    });
    const payload: TokenPayload = { uid: findUser[0].uid };
    return this.jwtService.sign(payload, {
      expiresIn: '12h',
      secret: process.env.SECRET_KEY,
    });
  }
}

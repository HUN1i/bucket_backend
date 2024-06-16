const dotenv = require('dotenv');
dotenv.config();
import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './payload/tokenPayload';

const secret = process.env.SECRET_KEY;
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

  public async validateToken(token: string) {
    try {
      const JWT = token.replace('Bearer ', '');
      const verifiedToken: any = this.jwtService.verify(JWT, {
        secret,
      });
      return await this.userRepository.find({
        where: { uid: verifiedToken.uid },
      });
    } catch (err) {
      switch (err.message) {
        case 'invalid signature':
          throw new HttpException('유효하지 않은 토큰', 401);

        case 'jwt expired':
          throw new HttpException('토큰 만료됨', 410);

        default:
          console.log(err);
          throw new HttpException('서버 에러', 500);
      }
    }
  }
}

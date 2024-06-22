import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, User, Tag])],
  controllers: [BoardController],
  providers: [BoardService, AuthService, JwtService],
})
export class BoardModule {}

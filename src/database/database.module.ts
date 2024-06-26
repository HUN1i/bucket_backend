const dotenv = require('dotenv');
dotenv.config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Board } from 'src/board/entities/board.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      synchronize: true,
      entities: [User, Board, Tag],
    }),
  ],
})
export class DatabaseModule {}

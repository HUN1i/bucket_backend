import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BoardModule } from './board/board.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [AuthModule, DatabaseModule, BoardModule, TagModule],
})
export class AppModule {}

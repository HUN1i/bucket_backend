import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [AuthModule, DatabaseModule, BoardModule],
})
export class AppModule {}

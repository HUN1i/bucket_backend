import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SuccessType } from '../entities/enum/success-type';

export class CreateBoardDto {
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  tag: string;

  @IsString()
  detail: string;

  @IsString()
  people: string;
}

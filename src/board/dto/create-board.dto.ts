import { IsNumber, IsOptional, IsString } from 'class-validator';

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

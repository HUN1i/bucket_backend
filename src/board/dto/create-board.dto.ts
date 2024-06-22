import { IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  tag: string;

  @IsOptional()
  @IsString()
  people: string;

  @IsOptional()
  prologue: string;
}

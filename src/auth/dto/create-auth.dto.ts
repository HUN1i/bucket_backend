import { IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  provider: string;

  @IsString()
  providerId: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}

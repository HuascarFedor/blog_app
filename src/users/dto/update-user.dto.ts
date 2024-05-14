import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 15)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(6, 255)
  password?: string;
}

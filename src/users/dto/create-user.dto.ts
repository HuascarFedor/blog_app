import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 15)
  username: string;

  @IsString()
  @Length(6, 255)
  password: string;
}

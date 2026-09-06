import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}

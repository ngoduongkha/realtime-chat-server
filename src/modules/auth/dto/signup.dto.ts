import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, MinLength } from 'class-validator';
import { PostLoginResponse } from './login.dto';

export class SignupDto {
  @ApiProperty({ example: 'kha@codelight.co' })
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '12345678', minLength: 8 })
  @IsDefined()
  @MinLength(8)
  readonly password: string;

  @ApiProperty({ example: 'Kha', minLength: 3 })
  @IsDefined()
  @MinLength(3)
  readonly firstName: string;

  @ApiProperty({ example: 'Ngo', minLength: 3 })
  @IsDefined()
  @MinLength(3)
  readonly lastName: string;
}

export class PostSignupResponse extends PostLoginResponse {}

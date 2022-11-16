import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'kha@codelight.co' })
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '12345678', minLength: 8 })
  @IsDefined()
  @MinLength(8)
  readonly password: string;
}

export class PostLoginResponse {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;
}

export class GetRefreshResponse {
  @ApiProperty()
  readonly accessToken: string;
}

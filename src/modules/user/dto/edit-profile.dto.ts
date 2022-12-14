import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class EditProfileDto {
  @ApiProperty({ example: 'Kha Ngo Duong', required: false })
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'I am a developer', required: false })
  @IsNotEmpty()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'https://example.com', required: false })
  @IsUrl()
  @IsOptional()
  profilePic?: string;
}

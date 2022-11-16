import { ApiProperty } from '@nestjs/swagger';

export class GetUserProfileDto {
  @ApiProperty({ example: 'ngoduongkhakg2001@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Kha' })
  firstName: string;

  @ApiProperty({ example: 'Ngo' })
  lastName: string;

  @ApiProperty({ example: 'This is my bio', nullable: true })
  bio: string | null;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    nullable: true,
  })
  profilePic: string | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto';

export class GetProfileResponse extends BaseResponse {
  @ApiProperty({ type: String, example: 'Ngo Kha' })
  name: string;

  @ApiProperty({ type: String, example: 'This is my bio', nullable: true })
  bio: string | null;

  @ApiProperty({
    type: String,
    example: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    nullable: true,
  })
  profilePic: string | null;
}

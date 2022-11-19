import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/base.dto';
import { GetProfileResponse } from './get-profile.dto';

export class GetUserResponse extends BaseResponse {
  @ApiProperty({ example: 'ngoduongkhakg2001@gmail.com' })
  email: string;

  @ApiProperty({ type: GetProfileResponse })
  profile: GetProfileResponse;
}

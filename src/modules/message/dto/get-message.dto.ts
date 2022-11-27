import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto';

export class GetMessageResponse extends BaseResponse {
  @ApiProperty()
  content: String;

  @ApiProperty()
  conversationId: String;

  @ApiProperty()
  senderId: String;
}

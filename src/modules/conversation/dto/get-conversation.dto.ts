import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto';
import { GetMessageResponse } from 'src/modules/message/dto/get-message.dto';
import { GetUserResponse } from 'src/modules/user/dto';

export class GetConversationResponse extends BaseResponse {
  @ApiProperty({ type: String, nullable: true })
  lastMessageId: string | null;

  @ApiProperty({ type: GetMessageResponse, nullable: true })
  lastMessage: GetMessageResponse | null;

  @ApiProperty({ type: GetUserResponse, isArray: true })
  users: GetUserResponse[];
}

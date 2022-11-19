import { ApiProperty } from '@nestjs/swagger';

export class GetMessageResponse {
  @ApiProperty()
  id: String;

  @ApiProperty()
  content: String;

  @ApiProperty()
  conversationId: String;

  @ApiProperty()
  senderId: String;
}

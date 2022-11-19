import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  id: string;
}

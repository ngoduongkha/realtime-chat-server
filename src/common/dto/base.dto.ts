import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

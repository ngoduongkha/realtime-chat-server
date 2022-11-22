import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 'e0b9b9a0-5d5c-4d3d-9c68-5d1740cf834b', description: 'Friend id' })
  @IsUUID()
  @IsDefined()
  readonly friendId: string;
}

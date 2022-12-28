import { ApiResponseProperty } from '@nestjs/swagger';

export class UploadFileResponse {
  @ApiResponseProperty()
  url: string;
}

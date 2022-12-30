import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

export const FileSupported = ['image/jpeg', 'image/png', 'image/gif'];

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3 = new S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    region: this.configService.get('AWS_REGION'),
  });

  async uploadPublicFile(file: Express.Multer.File): Promise<{ url: string }> {
    if (!FileSupported.includes(file.mimetype)) {
      throw new BadRequestException('File type not supported');
    }
    const timestamp = Date.now().toString();
    const hashedFileName = createHash('md5').update(timestamp).digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const fileName = hashedFileName + extension;

    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') || 'bucket',
        Body: file.buffer,
        Key: fileName,
        ContentType: file.mimetype,
      })
      .promise()
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return { url: uploadResult.Location };
  }
}

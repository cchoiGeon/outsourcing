import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AwsService {
  s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {
    try {
      this.region = this.configService.get<string>('AWS_REGION');
      this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
          secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        },
      });
    } catch (err) {
      this.loggerService.warn(`S3/ 초기화 에러: ${err}`);
    }
  }

  async uploadImagesToS3(files: Express.Multer.File[] | Express.Multer.File | undefined, ext: string): Promise<string[]> {
    try {
      if (!files) return [];

      const fileArray = Array.isArray(files) ? files : [files];

      const uploadPromises = fileArray.map(async (file) => {
        const fileName = `review/${Date.now()}-${file.originalname}`;

        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: `image/${ext}`,
        });

        await this.s3Client.send(command);

        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
      });

      return Promise.all(uploadPromises);
    } catch (err) {
      this.loggerService.warn(`S3/ 업로드 에러: ${err}`);
      throw new InternalServerErrorException();
    }
  }
}

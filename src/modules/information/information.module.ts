import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Information } from '../database/entities';
import { InformationService } from './information.service';

@Module({
  imports: [TypeOrmModule.forFeature([Information])],
  providers: [InformationService],
  exports: [InformationService],
})
export class InformationModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Information } from '../database/entities';

@Injectable()
export class InformationService {
  constructor(
    @InjectRepository(Information)
    private readonly informationRepository: Repository<Information>,
  ) {}

  async upsert(information: Information): Promise<void> {
    await this.informationRepository.upsert(information, { conflictPaths: ['userId'] });
  }

  async delete(userId: string): Promise<void> {
    await this.informationRepository.delete({ userId });
  }
}

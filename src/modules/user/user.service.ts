import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmailAndGetPassword(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { email },
    });

    return user;
  }

  async getUserIfRefreshTokenMatches(userId: string, refreshToken: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      select: ['id', 'refreshToken'],
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      return null;
    }

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(hash, user.refreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.userRepository.findOneByOrFail({ id: userId });

    await this.userRepository.update(
      { id: userId },
      {
        refreshToken: null,
      },
    );
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = bcrypt.hashSync(hash, 10);

    await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }
}

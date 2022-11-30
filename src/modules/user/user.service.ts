import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dto';
import { Profile, User } from '../database/entities';
import { GetUserResponse } from './dto';
import { SignupDto } from '../auth/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  public async updateOnline(userId: string, isOnline: boolean): Promise<void> {
    await this.userRepository.update(userId, { isOnline });
  }

  public async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<GetUserResponse>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .where('LOWER(profile.name) LIKE :name', {
        name: `%${pageOptionsDto.keyword?.toLowerCase()}%`,
      })
      .orWhere('LOWER(user.email) LIKE :email', {
        email: `%${pageOptionsDto.keyword?.toLowerCase()}%`,
      })
      .innerJoinAndSelect('user.profile', 'profile')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async register(dto: SignupDto): Promise<User> {
    const existing = await this.userRepository.findOneBy({ email: dto.email.toLowerCase() });

    if (existing) {
      throw new BadRequestException('Email already register');
    }

    const profile = await this.profileRepository.save(
      this.profileRepository.create({
        name: dto.name,
      }),
    );

    const user = this.userRepository.create({
      email: dto.email,
      password: bcrypt.hashSync(dto.password, 10),
      profile,
    });

    return this.userRepository.save(user);
  }

  async getUserProfileById(userId: string): Promise<GetUserResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        profile: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findByEmailAndGetPassword(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });

    return user;
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = bcrypt.hashSync(hash, 10);
    await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
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

  async getUserIfRefreshTokenMatches(userId: string, refreshToken: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      select: ['id', 'refreshToken'],
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      return null;
    }

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenMatching = bcrypt.compareSync(hash, user.refreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  // async update(id: number, updates: UserUpdate): Promise<User> {
  //   const user = await this.userRepository.findOneBy({ id });

  //   if (!user) {
  //     throw new NotFoundException(`There isn't any user with id: ${id}`);
  //   }

  //   this.userRepository.merge(user, updates);

  //   return this.userRepository.save(user);
  // }
}

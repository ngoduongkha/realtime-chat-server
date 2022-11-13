import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'bio', nullable: true })
  bio: string;

  @Column({ name: 'profile_pic', nullable: true })
  profilePic: string | null;

  @Column({ name: 'refresh_token', nullable: true, select: false })
  refreshToken: string | null;
}

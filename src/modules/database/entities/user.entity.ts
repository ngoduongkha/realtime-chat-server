import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Profile } from './profile.entity';
import { UserConversation } from './user-conversation.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  refreshToken: string | null;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => UserConversation, (userConversation) => userConversation.user)
  userConversations: UserConversation[];

  @BeforeInsert()
  @BeforeUpdate()
  async lowercaseEmail(): Promise<void> {
    this.email = this.email.toLowerCase();
  }
}

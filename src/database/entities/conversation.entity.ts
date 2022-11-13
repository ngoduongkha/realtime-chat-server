import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export class Conversation extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  profilePic: string;

  @Column()
  isGroup: boolean;

  @Column()
  ownerId: string;

  @Column()
  owner: User;

  @Column()
  members: User[];

  @Column()
  messages: Message[];
}

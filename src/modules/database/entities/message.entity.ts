import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => Conversation)
  @JoinColumn()
  conversation?: Conversation;

  @Column({ type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sender?: User;
}

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  lastMessageId: string;

  @OneToOne(() => Message)
  @JoinColumn()
  lastMessage: Message;
}

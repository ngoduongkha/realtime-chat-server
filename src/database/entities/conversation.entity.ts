import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ name: 'last_message_id', nullable: true })
  lastMessageId: string;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: Message;
}

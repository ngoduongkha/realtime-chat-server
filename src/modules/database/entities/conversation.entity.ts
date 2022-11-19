import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Message } from './message.entity';
import { UserConversation } from './user-conversation.entity';
import { User } from './user.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  lastMessageId: string | null;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: Message | null;

  @OneToMany(() => UserConversation, (userConversation) => userConversation.conversation)
  userConversations?: UserConversation[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_conversation',
    joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];
}

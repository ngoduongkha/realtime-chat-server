import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation, UserConversation } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, UserConversation])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}

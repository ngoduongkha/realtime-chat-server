import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MessageService } from './message.service';
import MessageGateway from './message.gateway';
import { Message } from '../database/entities';
import { MessageController } from './message.controller';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), JwtModule.register({}), ConversationModule],
  providers: [MessageGateway, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import MessageGateway from './message.gateway';
import { Message } from '../database/entities';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageGateway, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

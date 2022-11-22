import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../database/entities';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  createMessage(senderId: string, dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create({ senderId, ...dto });

    return this.messageRepository.save(message);
  }

  getMessageByConversationId(conversationId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversationId },
    });
  }
}

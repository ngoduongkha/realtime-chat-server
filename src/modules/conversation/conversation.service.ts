import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../database/entities';
import { UserConversation } from '../database/entities/user-conversation.entity';
import { GetConversationResponse } from './dto/get-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(UserConversation)
    private readonly userConversationRepository: Repository<UserConversation>,
  ) {}

  getConversationById(conversationId: string): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: { users: { profile: true }, lastMessage: true },
    });
  }

  updateLastMessage(conversationId: string, messageId: string): Promise<Conversation> {
    return this.conversationRepository.save({
      id: conversationId,
      lastMessageId: messageId,
    });
  }

  getUserConversations(userId: string): Promise<GetConversationResponse[]> {
    return this.conversationRepository.find({
      where: {
        userConversations: {
          userId,
        },
      },
      relations: { users: { profile: true }, lastMessage: true },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  getUserConversationIdsByUserId(userId: string): Promise<string[]> {
    return this.userConversationRepository
      .find({
        where: { userId },
        select: ['conversationId'],
      })
      .then((userConversations) =>
        userConversations.map((userConversation) => userConversation.conversationId),
      );
  }

  async createConversation(userId: string, friendId: string): Promise<GetConversationResponse> {
    const existing = await this.conversationRepository.findOne({
      where: {
        users: {
          id: userId,
        },
        userConversations: {
          userId: friendId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      return this.conversationRepository.findOneOrFail({
        where: {
          id: existing.id,
        },
        relations: { lastMessage: true, users: { profile: true } },
      });
    }

    const conversation = await this.conversationRepository.save(
      this.conversationRepository.create(),
    );

    await this.userConversationRepository.save([
      this.userConversationRepository.create({
        userId,
        conversationId: conversation.id,
      }),
      this.userConversationRepository.create({
        userId: friendId,
        conversationId: conversation.id,
      }),
    ]);

    return this.conversationRepository.findOneOrFail({
      where: { id: conversation.id },
      relations: { lastMessage: true, users: { profile: true } },
    });
  }

  async getUserIdsInConversation(conversationId: string): Promise<string[]> {
    const userConversations = await this.userConversationRepository.find({
      where: {
        conversationId,
      },
    });

    return userConversations.map((userConversation) => userConversation.userId);
  }
}

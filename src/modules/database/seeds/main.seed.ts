import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import { Conversation, User, UserConversation } from '../entities';
import ConversationSeeder from './conversation.seed';
import UserSeeder from './user.seed';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, UserSeeder, { parallelExecution: true });
    await runSeeder(dataSource, ConversationSeeder, { parallelExecution: true });

    const users = await dataSource.getRepository(User).find();
    const conversations = await dataSource.getRepository(Conversation).find();
    const userConversations: UserConversation[] = [];

    let idx = 0;
    for (let i = 0; i < users.length - 1; i += 1) {
      for (let j = i + 1; j < users.length; j += 1) {
        userConversations.push(
          {
            userId: users[i].id,
            conversationId: conversations[idx].id,
          },
          {
            userId: users[j].id,
            conversationId: conversations[idx].id,
          },
        );

        idx += 1;
      }
    }

    await dataSource.getRepository(UserConversation).save(userConversations);
  }
}

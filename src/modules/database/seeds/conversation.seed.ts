import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Conversation } from '../entities';

export default class ConversationSeeder implements Seeder {
  async run(_: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const conversationFactory = factoryManager.get(Conversation);
    await conversationFactory.saveMany(190);
  }
}

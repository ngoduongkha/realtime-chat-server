import { setSeederFactory } from 'typeorm-extension';
import { Conversation } from '../entities';

export default setSeederFactory(Conversation, () => {
  const conversation = new Conversation();

  return conversation;
});

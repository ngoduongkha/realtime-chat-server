import { setSeederFactory } from 'typeorm-extension';
import { hashSync } from 'bcrypt';
import { Profile, User } from '../entities';

export default setSeederFactory(User, (faker) => {
  const user = new User();

  user.email = faker.internet.email();
  user.password = hashSync('12345678', 10);
  user.profile = new Profile();
  user.profile.name = faker.name.fullName();
  user.profile.bio = faker.lorem.paragraph();
  user.profile.profilePic = faker.image.imageUrl(200, 200, 'cat', true);

  return user;
});

import { Column, Entity } from 'typeorm';
import { IdentityEntity } from './base.entity';

@Entity('profiles')
export class Profile extends IdentityEntity {
  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  profilePic: string | null;
}

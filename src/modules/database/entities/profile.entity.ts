import { Column, Entity } from 'typeorm';
import { IdentityEntity } from './base.entity';

@Entity()
export class Profile extends IdentityEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  profilePic: string | null;
}

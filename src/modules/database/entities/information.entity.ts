import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Information {
  @Column({ type: 'varchar', length: 100 })
  socketId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User)
  user?: User;
}

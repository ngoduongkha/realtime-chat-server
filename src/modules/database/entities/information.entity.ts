import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Information {
  @Column({ type: 'varchar', length: 100 })
  value: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.information)
  @JoinColumn()
  user: User;
}

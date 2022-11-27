import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class IdentityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export abstract class BaseEntity extends IdentityEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    default: false,
    select: false,
  })
  isDeleted: boolean;
}

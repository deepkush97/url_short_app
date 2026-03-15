import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IUrl } from '@app/shared/interfaces/url/url.interface';
import { User } from '@app/user/entities/user.entity';

@Entity('urls')
export class Url implements IUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1000 })
  url: string;

  @Column({ length: 7 })
  code: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.urls)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: number;
}

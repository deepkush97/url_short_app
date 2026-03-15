import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthSessionEnum } from '@app/shared/enums/auth-session.enum';
import { ISession } from '@app/shared/interfaces/session/session.interface';
import { User } from '@app/user/entities/user.entity';

@Entity('sessions')
export class Session implements ISession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', generated: 'uuid' })
  @Index('IDX_sessions_guid')
  guid: string;

  @Column({ enum: AuthSessionEnum, type: 'enum' })
  status: AuthSessionEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: number;
}

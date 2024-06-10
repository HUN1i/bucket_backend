import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { SuccessType } from './enum/success-type';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  thumbnail: string;

  @Column()
  name: string;

  @Column()
  tag: string;

  @Column({ type: 'text' })
  detail: string;

  @Column()
  people: string;

  @Column({
    type: 'enum',
    enum: ['failed', 'success', 'doing'],
    default: 'doing',
  })
  success: SuccessType;

  @CreateDateColumn()
  createdAt: Timestamp;
}

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

  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  tag: string;

  @Column({ nullable: true })
  prologue: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ nullable: true })
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

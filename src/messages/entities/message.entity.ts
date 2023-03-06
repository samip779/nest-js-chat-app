import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  sender_id: number;
  @JoinColumn({ name: 'sender_id' })
  @ManyToOne(() => User, (user) => user.sentMessages, { onDelete: 'CASCADE' })
  sender: User;

  @Column()
  receiver_id: number;
  @JoinColumn({ name: 'receiver_id' })
  @ManyToOne(() => User, (user) => user.receivedMessages, {
    onDelete: 'CASCADE',
  })
  receiver: User;
}

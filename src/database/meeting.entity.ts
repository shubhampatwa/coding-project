import { instanceToPlain, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Index,
  OneToMany,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from './user.entity';

@Entity()
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Transform(({ value }) => value.id, { toPlainOnly: true })
  @ManyToOne(() => User)
  host: User;

  @Index({ unique: false })
  @Column({ type: 'timestamptz', nullable: true })
  startTime: Date;

  @Index({ unique: false })
  @Column({ type: 'timestamptz', nullable: true })
  endTime: Date;

  @OneToMany(() => Attendee, (attendee) => attendee.meeting)
  attendees: Attendee[];

  toJSON() {
    return instanceToPlain(this);
  }
}

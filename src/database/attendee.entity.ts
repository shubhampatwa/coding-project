import { instanceToPlain, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity()
export class Attendee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  email: string;

  @Transform(({ value }) => value.id, { toPlainOnly: true })
  @ManyToOne(() => Meeting)
  meeting: Meeting;

  @Column()
  timezone: string;

  toJSON() {
    return instanceToPlain(this);
  }
}

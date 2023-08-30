import { instanceToPlain, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum WEEKENUM {
  sunday = 'sunday',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
}

@Entity()
export class Availabilty extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => value.id, { toPlainOnly: true })
  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: WEEKENUM,
    nullable: false,
  })
  weekDay: WEEKENUM;

  @Index({ unique: false })
  @Column({ type: 'time', nullable: true })
  startTime: Date;

  @Index({ unique: false })
  @Column({ type: 'time', nullable: true })
  endTime: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}

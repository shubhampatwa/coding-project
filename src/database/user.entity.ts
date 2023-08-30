import { instanceToPlain } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Availabilty } from './availabilty.entity';
import { Meeting } from './meeting.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  timezone: string;

  // in minutes
  @Column({ default: 30 })
  timeSlot: number;

  @OneToMany(() => Availabilty, (availabilty) => availabilty.user)
  availabilty: Availabilty[];

  @OneToMany(() => Meeting, (meeting) => meeting.host)
  meetings: Meeting[];

  toJSON() {
    return instanceToPlain(this);
  }

  @BeforeInsert()
  lowerCaseName() {
    this.name = this.name?.toLowerCase();
  }
}

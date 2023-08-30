import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { User } from 'src/database/user.entity';
import { Availabilty } from 'src/database/availabilty.entity';
import { Meeting } from 'src/database/meeting.entity';
import { UsersService } from 'src/users/users.service';
import { WEEK } from 'src/constants/timezone';
import { Attendee } from 'src/database/attendee.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectDataSource() private connection: DataSource,
    private configService: ConfigService,
    @InjectRepository(Availabilty)
    private availabiltyRepository: Repository<Availabilty>,
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
    private userService: UsersService,
  ) {}

  async create(meetingInfo: CreateMeetingDto, name: string) {
    const user = await this.userService.findUser({ name });
    if (!user) {
      return {
        http: 404,
        message: 'No User exist for this Name',
      };
    }
    // check availabilty
    await this.checkAvailablity(user, meetingInfo);

    // check meeting conflict
    await this.checkMeetingConflict(user, meetingInfo);

    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      const meeting = this.createMeeting(user, meetingInfo);
      await QueryRunner.manager.save(meeting);
      const attendee = this.createAttendee(meetingInfo, meeting);
      await QueryRunner.manager.save(attendee);
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      return meeting;
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
      throw err;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  async checkAvailablity(user: User, meetingInfo: CreateMeetingDto) {
    const meetingStartTime = this.convertTZ(
      meetingInfo.startTime,
      user.timezone,
    );
    const meetingEndTime = this.convertTZ(meetingInfo.startTime, user.timezone);
    meetingEndTime.setMinutes(meetingStartTime.getMinutes() + user.timeSlot);
    const weekIndex = meetingStartTime.getDay();

    const availabilty = await this.userService.getAvailabilty({
      weekDay: WEEK[weekIndex],
    });

    if (!availabilty.length) {
      throw new HttpException(
        {
          message: `User ${user.name} is not available for this slot`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const availableStartTime = this.getTzDateTime(
      meetingStartTime,
      user.timezone,
      availabilty[0].startTime.toString(),
    );
    const availableEndTime = this.getTzDateTime(
      meetingStartTime,
      user.timezone,
      availabilty[0].endTime.toString(),
    );

    if (
      availableStartTime.getTime() <= meetingStartTime.getTime() &&
      meetingEndTime.getTime() <= availableEndTime.getTime()
    ) {
      return true;
    }
    throw new HttpException(
      {
        message: `User ${user.name} is not available for this slot`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async checkMeetingConflict(user: User, meetingInfo: CreateMeetingDto) {
    const meetingStartTime = this.convertTZ(
      meetingInfo.startTime,
      user.timezone,
    );
    const meetingEndTime = meetingStartTime;
    meetingEndTime.setMinutes(meetingStartTime.getMinutes() + user.timeSlot);
    const where = {
      stmt: '(meeting.startTime <= :endTime AND meeting.startTime >= :startTime) OR (meeting.startTime <= :startTime AND meeting.endTime >= :endTime) OR (meeting.endTime >= :startTime AND meeting.endTime <= :endTime)',
      values: {
        startTime: meetingStartTime,
        endTime: meetingEndTime,
      },
    };

    const conflictMeetings = await this.meetingRepository
      .createQueryBuilder('meeting')
      .where('"hostId" = :userId', { userId: user.id })
      .andWhere(where.stmt, where.values)
      .getMany();

    console.log();
    if (conflictMeetings.length) {
      throw new HttpException(
        {
          message: `User ${user.name} having conflicting meeting for this slot`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  createMeeting(user: User, meetingInfo: CreateMeetingDto) {
    const meeting = this.meetingRepository.create(meetingInfo);
    const meetingEndTime = new Date(meetingInfo.startTime);
    console.log(meetingEndTime, '>>>>>>>');
    meetingEndTime.setMinutes(meetingEndTime.getMinutes() + user.timeSlot);
    meeting.startTime = meetingInfo.startTime;
    meeting.endTime = meetingEndTime;
    meeting.host = user;
    return meeting;
  }

  createAttendee(meetingInfo: CreateMeetingDto, meeting: Meeting) {
    const attendee = this.attendeeRepository.create(meetingInfo);
    attendee.meeting = meeting;
    return attendee;
  }

  convertTZ(date: any, tzString: string) {
    return new Date(
      (typeof date === 'string' ? new Date(date) : date).toLocaleString(
        'en-US',
        { timeZone: tzString },
      ),
    );
  }

  getTzDateTime(date: Date, tzString: string, time: string) {
    const dateTz = this.convertTZ(date, tzString);
    const [hours, minutes] = time.split(':').map(Number);
    dateTz.setHours(hours);
    dateTz.setMinutes(minutes);
    console.log(dateTz, 'checking dateTz');
    return dateTz;
  }
}

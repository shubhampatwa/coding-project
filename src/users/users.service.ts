import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/database/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TIMEZONES } from 'src/constants/timezone';
import { AppConst } from 'src/config/constants';
import { CreateAvailabiltyDto } from './dto/create-availabilty.dto';
import { Availabilty } from 'src/database/availabilty.entity';
import { getMinutesDifference } from 'src/utils/helper';
import { Meeting } from 'src/database/meeting.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectDataSource() private connection: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Availabilty)
    private availabiltyRepository: Repository<Availabilty>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      let timezone = 'Asia/Kolkata';
      if (TIMEZONES.includes(createUserDto.timezone)) {
        timezone = createUserDto.timezone;
      }
      const user = this.userRepository.create(createUserDto);
      console.log(createUserDto, user, '>>>>>>>>');
      user.timezone = timezone;
      await QueryRunner.manager.save(user);
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      return user;
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
      throw new Error(err);
    }
  }

  async findUser(
    where: Record<string, any>,
    relations = ['availabilty', 'meetings'],
  ): Promise<User> {
    return this.userRepository.findOne({
      where,
      relations: relations,
    });
  }

  findOne(name: string) {
    return this.findUser({ name });
  }

  createAuthJwt(payload: any): string {
    return this.jwtToken(payload, AppConst.authJwtExpiry);
  }

  jwtToken(payload: any, expiresIn: number = null): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_PRIVATE_KEY'),
      issuer: this.configService.get('JWT_ISSUER'),
      expiresIn: expiresIn || this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  async createAvailabilty(
    createAvailabiltyDto: CreateAvailabiltyDto[],
    user: User,
  ) {
    const QueryRunner = this.connection.createQueryRunner();
    await QueryRunner.startTransaction();
    try {
      const existingAvailabilty = await this.availabiltyRepository.find({
        where: { user: { id: user.id } },
      });
      const validAvailabilty = createAvailabiltyDto.map((availabilty) => {
        if (availabilty.startTime < availabilty.endTime) {
          const diffMinutes = getMinutesDifference(
            availabilty.startTime,
            availabilty.endTime,
          );
          if (diffMinutes > 15) {
            return { ...availabilty, user };
          }
        }
        return null;
      });
      const availabilties = this.availabiltyRepository.create(validAvailabilty);
      await QueryRunner.manager.remove(Availabilty, existingAvailabilty);
      await QueryRunner.manager.save(availabilties);
      await QueryRunner.commitTransaction();
      await QueryRunner.release();
      return availabilties;
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      await QueryRunner.release();
      throw err;
    }
  }

  async getUserAvailabilty(user: User) {
    return this.availabiltyRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async getAvailabilty(where: any) {
    return this.availabiltyRepository.find({ where });
  }

  async getMeetings(user: User) {
    return this.meetingRepository.find({ where: { host: { id: user.id } }, relations: ['attendees'] });
  }
}

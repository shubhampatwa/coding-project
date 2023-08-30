import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { AppConfig } from 'src/config/config';
import { User } from 'src/database/user.entity';
import { Availabilty } from 'src/database/availabilty.entity';
import { Meeting } from 'src/database/meeting.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Attendee } from 'src/database/attendee.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User, Availabilty, Meeting, Attendee]),
    UsersModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService, UsersService, JwtService],
})
export class MeetingModule {}

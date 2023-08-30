import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { User } from 'src/database/user.entity';
import { AppConfig } from 'src/config/config';
import { Availabilty } from 'src/database/availabilty.entity';
import { Meeting } from 'src/database/meeting.entity';
import { UserAuthGuard } from './guards/user-auth.guard';
import { UserStrategy } from './strategy/user.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User, Availabilty, Meeting]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    LocalStrategy,
    UserStrategy,
    JwtService,
    PassportModule,
    UserAuthGuard,
  ],
})
export class UsersModule {}

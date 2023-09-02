import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsTimeZone,
  MinDate,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty({ message: 'Meeting title is required.' })
  title: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  startTime: Date;

  @IsString()
  @IsTimeZone({ message: 'Timezone is required.' })
  timezone: string;

  @IsString()
  @IsNotEmpty({ message: 'Full Name is required' })
  fullName: string;

  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;
}

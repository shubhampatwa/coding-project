import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsTimeZone,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsNumber({}, { message: 'Enter valid input for threshold' })
  @Min(15)
  @Max(60)
  timeSlot: number;

  @IsString()
  @IsTimeZone({ message: 'Timezone is required.' })
  timezone: string;
}

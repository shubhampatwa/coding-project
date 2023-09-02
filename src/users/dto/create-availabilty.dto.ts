import { IsNotEmpty, IsString, Matches, IsEnum } from 'class-validator';
import { WEEKENUM } from 'src/database/availabilty.entity';

export class CreateAvailabiltyDto {
  @IsString()
  @IsNotEmpty({ message: 'WeekDay is required.' })
  @IsEnum(WEEKENUM)
  weekDay: WEEKENUM;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  endTime: string;
}

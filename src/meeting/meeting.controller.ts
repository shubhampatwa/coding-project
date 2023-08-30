import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post(':username')
  create(
    @Body() createMeetingDto: CreateMeetingDto,
    @Param('username') name: string,
  ) {
    return this.meetingService.create(createMeetingDto, name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne(+id);
  }
}

import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserReq } from './user.interface';
import { ResponseObj } from 'src/utils/interface';
import { CreateAvailabiltyDto } from './dto/create-availabilty.dto';
import { UserAuthGuard } from './guards/user-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const accessToken = this.usersService.createAuthJwt({ id: user.id });
    return { http: 201, result: { ...user, accessToken } };
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: UserReq): Promise<ResponseObj> {
    const result = { ...req.user.toJSON(), accessToken: null };
    result.accessToken = this.usersService.createAuthJwt({ id: req.user.id });
    return { result };
  }

  @Post('availabilty')
  @UseGuards(UserAuthGuard)
  async addAvailabilty(
    @Body() createAvailabiltyDto: CreateAvailabiltyDto[],
    @Req() req: UserReq,
  ) {
    const availabilties = await this.usersService.createAvailabilty(
      createAvailabiltyDto,
      req.user,
    );
    return {
      result: availabilties,
    };
  }

  @Get('availabilty')
  @UseGuards(UserAuthGuard)
  async getAvailabilty(@Req() req: UserReq) {
    const availabilties = await this.usersService.getUserAvailabilty(req.user);
    return {
      result: availabilties,
    };
  }

  @Get('meetings')
  @UseGuards(UserAuthGuard)
  async getMeetings(@Req() req: UserReq) {
    const meetings = await this.usersService.getMeetings(req.user);
    return {
      result: meetings,
    };
  }
}

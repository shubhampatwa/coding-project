import { User } from 'src/database/user.entity';

export interface UserReq extends Request {
  user: User;
}

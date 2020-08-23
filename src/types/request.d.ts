import { Request } from 'express';

declare interface UserRequest extends Request {
  user: any;
}

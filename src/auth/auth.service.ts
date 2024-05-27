import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  createAccessToken(user) {
    return 'This action adds a new auth';
  }
}

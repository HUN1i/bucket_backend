require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '741527979055-onhvvcofhmg38lekliv24epu0vj7ktlc.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    console.log(id, name, emails);
    return {
      provider: 'google',
      providerId: id,
      name: name.givenName,
      email: emails[0].value,
    };
  }
}

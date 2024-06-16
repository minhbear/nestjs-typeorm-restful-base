import { config } from '@config/index';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface IPayloadAccessToken {
  sub: string;
  email: string;
  sessionId: string;
}

interface IPayloadRefreshToken {
  sub: string;
  sessionId: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.accessToken,
    });
  }

  validate(payload: IPayloadAccessToken) {
    return {
      id: payload.sub,
      sessionId: payload.sessionId,
    };
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.refreshToken,
    });
  }

  validate(payload: IPayloadRefreshToken) {
    return { id: payload.sub, sessionId: payload.sessionId };
  }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './authentication.strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthenticationModule {}

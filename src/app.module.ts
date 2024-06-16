import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { AuthenticationModule } from '@common/authentication/authentication.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { config } from '@config/index';
import { BullQueueModule } from './shared/bull-queue/bull-queue.module';
import { CronjobModule } from './shared/cron-job/cron-job.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    DatabaseModule,
    AuthenticationModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: redisStore,
          url: config.redisUrl,
        } as RedisClientOptions;
      },
    }),
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
      },
    }),
    BullQueueModule,
    CronjobModule,

    // Modules
    HealthCheckModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

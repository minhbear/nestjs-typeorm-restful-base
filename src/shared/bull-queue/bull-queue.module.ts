import { BULL_OPTS, QUEUE_KEY } from '@common/constant';
import { config } from '@config/index';
import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_KEY.logAudit,
      defaultJobOptions: BULL_OPTS,
    }),
  ],
  exports: [BullModule],
})
export class BullQueueModule {}

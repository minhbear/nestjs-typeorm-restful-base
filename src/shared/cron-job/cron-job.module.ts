import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobService } from './cron-job.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronjobService],
  exports: [CronjobService, ScheduleModule],
})
export class CronjobModule {}

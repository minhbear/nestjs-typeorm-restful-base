import { QUEUE_KEY } from '@common/constant';
import { Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor(QUEUE_KEY.logAudit)
export class LogAuditService {
  async transcode(job: Job<unknown>) {
    console.log('🚀 ~ LogAuditService ~ transcode ~ job:', job);
    // do something
  }
}

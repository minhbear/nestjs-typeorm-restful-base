import { Global, Module } from '@nestjs/common';

import { LogAuditService } from './log-audit.service';

@Global()
@Module({
  providers: [LogAuditService],
  exports: [LogAuditService],
})
export class LogAuditModule {}

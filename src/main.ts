import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { config } from '@config/index';
import { APP_ENV } from '@common/constant';
import dataSource from '@database/data-source';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { AllExceptionFilter } from '@common/filter/exception.filter';

async function bootstrap() {
  initializeTransactionalContext();
  const isDevelopment = config.api.nodeEnv === APP_ENV.LOCAL;
  const { port, domain, path } = config;
  const app = await NestFactory.create(AppModule);

  // Initialize data source
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  // Enable Cors
  app.enableCors({ origin: true });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // NOTE: body parser
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix(path);
  await app.listen(config.port);

  const logger = new Logger('Bootstrap');

  logInfoDevelopment(isDevelopment, logger, domain, port, path);
}

const logInfoDevelopment = (
  isDevelopment: boolean,
  logger: Logger,
  domain: string,
  port: number,
  path: string,
) => {
  if (isDevelopment) {
    logger.log(`🚀  Server ready at http://${domain}:${port}`);
    logger.log(`######################################################`);
    logger.warn(`🚀  Health Check    : http://${domain}:${port}/health`);
    logger.warn(`🚀  The Nest Server : http://${domain}:${port}/${path}`);
    logger.log(`######################################################`);
  } else {
    logger.log(`🚀  Server is listening on port ${port}`);
  }
};

bootstrap();

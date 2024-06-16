import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { APP_ENV } from '@common/constant';
import { config } from '@config/index';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...dataSourceOptions,
          keepConnectionAlive: true,
          migrationsRun: true,
          logging: config.api.nodeEnv !== APP_ENV.RELEASE, // Enable logging when not in release mode
        };
      },
    }),
  ],
})
export class DatabaseModule {}

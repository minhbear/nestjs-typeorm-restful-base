import { config } from '@config/index';
import { join } from 'path/posix';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  synchronize: false,
  logging: ['query', 'error', 'schema'],
  logger: 'advanced-console',
  extra: {
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  },
  entities: [join(__dirname, './entities/*.entity.{ts,js}')],
  migrations: [join(__dirname, '/migrations/*.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
  url: config.dbConnectionString,
};

const dataSource = addTransactionalDataSource(
  new DataSource(dataSourceOptions),
);
export default dataSource;

import { DataSourceOptions } from 'typeorm';

const baseConfig = {
  synchronize: false,
  entities:
    process.env.NODE_ENV === 'test'
      ? ['src/**/*.entity.ts']
      : ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
};

export const dbConfig = (): DataSourceOptions => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        type: 'sqlite',
        ...baseConfig,
        database: 'db.sqlite',
      };

    case 'test':
      return {
        type: 'sqlite',
        ...baseConfig,
        database: 'test.sqlite',
        migrationsRun: true,
      };

    case 'production':
      return {
        type: 'sqlite',
        ...baseConfig,
        database: 'prod.sqlite',
      };

    default:
      throw new Error('Unknown environment');
  }
};

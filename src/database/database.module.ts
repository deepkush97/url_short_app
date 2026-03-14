import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { DatabaseLoggerService } from '@app/shared/app-logger/db-logger.service';

@Module({
  imports: [
    ConfigModule,
    AppLoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AppLoggerModule],
      inject: [ConfigService, DatabaseLoggerService],
      useFactory: (configService: ConfigService, logger: DatabaseLoggerService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        logger,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

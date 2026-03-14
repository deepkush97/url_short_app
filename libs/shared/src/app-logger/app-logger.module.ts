import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidV4 } from 'uuid';

import { AppLoggerService } from './app-logger.service';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('APP_ENV') === 'production';

        const logLevel = configService.get<string>('APP_LOG_LEVEL');

        return {
          pinoHttp: {
            level: logLevel,
            genReqId: (req, res): string => {
              const existingID = req.headers['x-request-id'];
              if (existingID) return existingID as string;
              const id = uuidV4();
              res.setHeader('x-request-id', id);
              req.id = id;
              return id;
            },
            customProps: (req): object => ({
              requestId: req.id,
            }),
            autoLogging: false,
            quietReqLogger: true,
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    messageFormat: '[{requestId}] [{context}] {msg}',
                    ignore: 'pid,hostname,context,requestId,req,res',
                    translateTime: 'HH:MM:ss.l',
                  },
                },
            serializers: {
              req: (req): object => ({
                requestId: req.id,
                method: req.method,
                url: req.url,
              }),
              res: (res): object => ({
                statusCode: res.statusCode,
              }),
            },
          },
        };
      },
    }),
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class AppLoggerModule {}

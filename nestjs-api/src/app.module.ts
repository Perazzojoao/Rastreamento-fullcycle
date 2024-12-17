import { ConsoleLogger, Module } from '@nestjs/common';
import { MapsModule } from './modules/maps/maps.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './resources/logger/logger.interceptor';
import { HttpExceptionFilter } from './resources/http-exception/http-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { RoutesModule } from './modules/routes/routes.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RoutesDriverService } from './modules/routes/routes-driver/routes-driver.service';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RoutesModule,
    MapsModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [
    ConsoleLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    RoutesDriverService,
  ],
})
export class AppModule {}

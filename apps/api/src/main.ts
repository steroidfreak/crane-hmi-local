import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  const configService = app.get(ConfigService);
  const apiPort = configService.get<number>('API_PORT', 3000);
  const mqttHost = configService.get<string>('MQTT_HOST', 'localhost');
  const mqttPort = configService.get<number>('MQTT_PORT', 1883);
  const mqttUsername = configService.get<string>('MQTT_USERNAME');
  const mqttPassword = configService.get<string>('MQTT_PASSWORD');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${mqttHost}:${mqttPort}`,
      username: mqttUsername,
      password: mqttPassword,
      connectTimeout: 5000,
    },
  });

  await app.startAllMicroservices();
  await app.listen(apiPort);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${apiPort}`);
}

bootstrap();

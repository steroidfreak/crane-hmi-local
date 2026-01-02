import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ControlsController } from './controls/controls.controller';
import { MqttModule } from './mqtt/mqtt.module';
import { StateController } from './state/state.controller';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { StateGateway } from './gateway/state.gateway';
import { MqttStateController } from './mqtt/mqtt-state.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MqttModule,
  ],
  controllers: [ControlsController, StateController, HealthController, MqttStateController],
  providers: [
    StateGateway,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

import { Controller, Get } from '@nestjs/common';
import { HealthStatus } from '@crane/common';
import { Public } from '../auth/public.decorator';
import { MqttService } from '../mqtt/mqtt.service';

@Controller('health')
export class HealthController {
  constructor(private readonly mqttService: MqttService) {}

  @Public()
  @Get()
  health(): HealthStatus {
    return {
      ok: true,
      mqttConnected: this.mqttService.isConnected(),
      mqttUrl: this.mqttService.getMqttUrl(),
    };
  }
}

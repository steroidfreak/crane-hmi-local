import { Controller, Get } from '@nestjs/common';
import { DigitalTwinState } from '@crane/common';
import { MqttService } from '../mqtt/mqtt.service';

@Controller('state')
export class StateController {
  constructor(private readonly mqttService: MqttService) {}

  @Get()
  getState(): DigitalTwinState {
    return this.mqttService.getState();
  }
}

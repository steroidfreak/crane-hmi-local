import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MqttStateMessage } from '@crane/common';
import { MqttService } from './mqtt.service';
import { Public } from '../auth/public.decorator';

const STATE_TOPIC = process.env.MQTT_STATE_TOPIC || 'lights/state';

@Controller()
export class MqttStateController {
  constructor(private readonly mqttService: MqttService) {}

  @Public()
  @MessagePattern(STATE_TOPIC)
  handleState(@Payload() payload: MqttStateMessage) {
    return this.mqttService.applyStateUpdate(payload);
  }
}

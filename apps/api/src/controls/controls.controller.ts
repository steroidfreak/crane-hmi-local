import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common';
import { CommandResponse, MqttCommand } from '@crane/common';
import { MqttService } from '../mqtt/mqtt.service';
import { LevelDto } from './control.dto';

@Controller()
export class ControlsController {
  constructor(private readonly mqttService: MqttService) {}

  @Post('boom/on')
  async boomOn(): Promise<CommandResponse> {
    return this.publishAndAck({ cmd: 'on' });
  }

  @Post('boom/off')
  async boomOff(): Promise<CommandResponse> {
    return this.publishAndAck({ cmd: 'off' });
  }

  @Post('trolley/on')
  async trolleyOn(): Promise<CommandResponse> {
    return this.publishAndAck({ trolley: 'on' });
  }

  @Post('trolley/off')
  async trolleyOff(): Promise<CommandResponse> {
    return this.publishAndAck({ trolley: 'off' });
  }

  @Post('trolley/level')
  async trolleyLevel(@Body() dto: LevelDto): Promise<CommandResponse> {
    return this.publishAndAck({ trolleyLevel254: dto.level254 }, { trolleyLevel254: dto.level254 });
  }

  @Post('light')
  async lightLevel(@Body() dto: LevelDto): Promise<CommandResponse> {
    return this.publishAndAck({ lightLevel254: dto.level254 }, { lightLevel254: dto.level254 });
  }

  private async publishAndAck(command: MqttCommand, response?: Partial<CommandResponse>): Promise<CommandResponse> {
    try {
      await this.mqttService.publishCommand(command);
      return { ok: true, ...response };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}

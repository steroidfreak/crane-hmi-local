import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { connect as mqttConnect, MqttClient } from 'mqtt';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  DEFAULT_DIGITAL_TWIN,
  DigitalTwinState,
  GatewayMessage,
  LEVEL_MAX,
  LEVEL_MIN,
  MqttCommand,
  MqttStateMessage,
  TrolleySpeed,
  ControlMode,
} from '@crane/common';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly commandClient: ClientProxy;
  private readonly commandTopic: string;
  private readonly state$ = new BehaviorSubject<DigitalTwinState>({ ...DEFAULT_DIGITAL_TWIN });
  private readonly mqttUrl: string;
  private readonly mqttUsername?: string;
  private readonly mqttPassword?: string;
  private readonly telemetry$ = new BehaviorSubject<GatewayMessage>({
    type: 'state',
    payload: { ...DEFAULT_DIGITAL_TWIN },
  });
  private connection?: MqttClient;
  private connected = false;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('MQTT_HOST', 'localhost');
    const port = this.configService.get<number>('MQTT_PORT', 1883);
    this.mqttUsername = this.configService.get<string>('MQTT_USERNAME');
    this.mqttPassword = this.configService.get<string>('MQTT_PASSWORD');
    this.commandTopic = this.configService.get<string>('MQTT_CMD_TOPIC', 'lights/cmd');
    this.mqttUrl = `mqtt://${host}:${port}`;

    this.commandClient = ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        url: this.mqttUrl,
        username: this.mqttUsername,
        password: this.mqttPassword,
        clientId: `crane-api-${Math.random().toString(16).slice(2)}`,
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.commandClient.connect();
    this.connection = mqttConnect(this.mqttUrl, {
      username: this.mqttUsername,
      password: this.mqttPassword,
      keepalive: 60,
      reconnectPeriod: 2000,
    });

    this.connection.on('connect', () => {
      this.connected = true;
    });

    this.connection.on('close', () => {
      this.connected = false;
    });

    this.connection.on('error', (err) => {
      this.connected = false;
      // eslint-disable-next-line no-console
      console.error('MQTT error', err.message);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.commandClient.close();
    await new Promise<void>((resolve) => {
      if (this.connection) {
        this.connection.end(true, {}, () => resolve());
      } else {
        resolve();
      }
    });
  }

  async publishCommand(command: MqttCommand): Promise<void> {
    await this.commandClient.connect();
    await firstValueFrom(this.commandClient.emit(this.commandTopic, command));
  }

  applyStateUpdate(message: MqttStateMessage): DigitalTwinState {
    const current = this.state$.getValue();
    const trolleyLevel = this.clampLevel(message.trolleyLevel254);
    const lightLevel = this.clampLevel(message.lightLevel254);
    const trolleySpeed = this.validateSpeed(message.trolleySpeed);
    const controlMode = this.validateControlMode(message.controlMode);

    const next: DigitalTwinState = {
      boom: message.boom ?? current.boom,
      trolley: message.trolley ?? current.trolley,
      trolleyLevel254: trolleyLevel ?? current.trolleyLevel254,
      lightLevel254: lightLevel ?? current.lightLevel254,
      trolleySpeed: trolleySpeed ?? current.trolleySpeed,
      controlMode: controlMode ?? current.controlMode,
      daliOk: typeof message.daliOk === 'boolean' ? message.daliOk : current.daliOk,
      raw: message,
      ts: Date.now(),
    };

    this.state$.next(next);
    this.telemetry$.next({ type: 'state', payload: next });
    return next;
  }

  getState(): DigitalTwinState {
    return this.state$.getValue();
  }

  getUpdates() {
    return this.telemetry$.asObservable();
  }

  getMqttUrl(): string {
    return this.mqttUrl;
  }

  isConnected(): boolean {
    return this.connected;
  }

  private clampLevel(value?: number): number | null {
    if (value === undefined || value === null) return null;
    const numeric = Math.round(Number(value));
    if (!Number.isFinite(numeric)) return null;
    return Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, numeric));
  }

  private validateSpeed(value?: TrolleySpeed | string): TrolleySpeed | null {
    if (!value) return null;
    if (value === 'slow' || value === 'medium' || value === 'fast') return value;
    return null;
  }

  private validateControlMode(value?: ControlMode | string): ControlMode | null {
    if (!value) return null;
    if (value === 'quay' || value === 'manual') return value;
    return null;
  }
}

import { OnModuleDestroy } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Subscription } from 'rxjs';
import { MqttService } from '../mqtt/mqtt.service';

@WebSocketGateway({ namespace: '/updates', cors: { origin: '*' } })
export class StateGateway implements OnGatewayInit, OnGatewayConnection, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private subscription?: Subscription;

  constructor(private readonly mqttService: MqttService) {}

  afterInit() {
    this.subscription = this.mqttService.getUpdates().subscribe((message) => {
      this.server.emit('message', message);
    });
  }

  handleConnection(client: Socket) {
    client.emit('message', { type: 'state', payload: this.mqttService.getState() });
  }

  onModuleDestroy() {
    this.subscription?.unsubscribe();
  }
}

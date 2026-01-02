export type SwitchState = 'on' | 'off' | 'unknown';

export interface DigitalTwinState {
  boom: SwitchState;
  trolley: SwitchState;
  trolleyLevel254: number;
  lightLevel254: number;
  daliOk: boolean;
  raw?: Record<string, unknown> | null;
  ts: number | null;
}

export interface CommandResponse {
  ok: boolean;
  error?: string;
  trolleyLevel254?: number;
  lightLevel254?: number;
}

export interface MqttCommand {
  cmd?: 'on' | 'off';
  trolley?: 'on' | 'off';
  trolleyLevel254?: number;
  lightLevel254?: number;
}

export interface MqttStateMessage {
  boom?: SwitchState;
  trolley?: SwitchState;
  trolleyLevel254?: number;
  lightLevel254?: number;
  daliOk?: boolean;
  [key: string]: unknown;
}

export interface HealthStatus {
  ok: boolean;
  mqttConnected: boolean;
  mqttUrl: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface AuthTokenPayload {
  sub: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export type GatewayMessage =
  | {
      type: 'state';
      payload: DigitalTwinState;
    };

export const DEFAULT_DIGITAL_TWIN: DigitalTwinState = {
  boom: 'unknown',
  trolley: 'unknown',
  trolleyLevel254: 0,
  lightLevel254: 0,
  daliOk: true,
  raw: null,
  ts: null,
};

export const LEVEL_MIN = 0;
export const LEVEL_MAX = 254;

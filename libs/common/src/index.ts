export type SwitchState = 'on' | 'off' | 'unknown';
export type TrolleySpeed = 'slow' | 'medium' | 'fast';
export type ControlMode = 'quay' | 'manual';

export interface DigitalTwinState {
  boom: SwitchState;
  trolley: SwitchState;
  trolleyLevel254: number;
  lightLevel254: number;
  trolleySpeed: TrolleySpeed;
  controlMode: ControlMode;
  daliOk: boolean;
  raw?: Record<string, unknown> | null;
  ts: number | null;
}

export interface CommandResponse {
  ok: boolean;
  error?: string;
  trolleyLevel254?: number;
  lightLevel254?: number;
  trolleySpeed?: TrolleySpeed;
  controlMode?: ControlMode;
  address?: number;
  addressLevel254?: number;
  trolleyReset?: boolean;
}

export interface MqttCommand {
  cmd?: 'on' | 'off' | 'level';
  trolley?: 'on' | 'off';
  trolleyLevel254?: number;
  lightLevel254?: number;
  trolleySpeed?: TrolleySpeed;
  controlMode?: ControlMode;
  address?: number;
  val?: number;
  trolleyReset?: boolean;
}

export interface MqttStateMessage {
  boom?: SwitchState;
  trolley?: SwitchState;
  trolleyLevel254?: number;
  lightLevel254?: number;
  trolleySpeed?: TrolleySpeed;
  controlMode?: ControlMode;
  trolleyReset?: boolean;
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
  trolleySpeed: 'slow',
  controlMode: 'manual',
  daliOk: true,
  raw: null,
  ts: null,
};

export const LEVEL_MIN = 0;
export const LEVEL_MAX = 254;

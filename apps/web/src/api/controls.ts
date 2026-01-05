import { apiClient } from './client';
import { CommandResponse } from '@crane/common';
import { TrolleySpeed } from '@crane/common';

export const boomOn = () => apiClient.post<CommandResponse>('/boom/on').then((r) => r.data);
export const boomOff = () => apiClient.post<CommandResponse>('/boom/off').then((r) => r.data);
export const trolleyOn = () => apiClient.post<CommandResponse>('/trolley/on').then((r) => r.data);
export const trolleyOff = () => apiClient.post<CommandResponse>('/trolley/off').then((r) => r.data);
export const trolleyReset = () => apiClient.post<CommandResponse>('/trolley/reset').then((r) => r.data);

export const setTrolleyLevel = (level254: number) =>
  apiClient.post<CommandResponse>('/trolley/level', { level254 }).then((r) => r.data);

export const setLightLevel = (level254: number) =>
  apiClient.post<CommandResponse>('/light', { level254 }).then((r) => r.data);

export const setTrolleySpeed = (speed: TrolleySpeed) =>
  apiClient.post<CommandResponse>('/trolley/speed', { speed }).then((r) => r.data);

export const setControlMode = (mode: 'quay' | 'manual') =>
  apiClient.post<CommandResponse>('/control-mode', { mode }).then((r) => r.data);

export const addressOn = (address: number) => apiClient.post<CommandResponse>('/address/on', { address }).then((r) => r.data);
export const addressOff = (address: number) => apiClient.post<CommandResponse>('/address/off', { address }).then((r) => r.data);
export const addressLevel = (address: number, level254: number) =>
  apiClient.post<CommandResponse>('/address/level', { address, level254 }).then((r) => r.data);

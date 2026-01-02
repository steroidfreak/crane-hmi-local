import { apiClient } from './client';
import { CommandResponse } from '@crane/common';

export const boomOn = () => apiClient.post<CommandResponse>('/boom/on').then((r) => r.data);
export const boomOff = () => apiClient.post<CommandResponse>('/boom/off').then((r) => r.data);
export const trolleyOn = () => apiClient.post<CommandResponse>('/trolley/on').then((r) => r.data);
export const trolleyOff = () => apiClient.post<CommandResponse>('/trolley/off').then((r) => r.data);

export const setTrolleyLevel = (level254: number) =>
  apiClient.post<CommandResponse>('/trolley/level', { level254 }).then((r) => r.data);

export const setLightLevel = (level254: number) =>
  apiClient.post<CommandResponse>('/light', { level254 }).then((r) => r.data);

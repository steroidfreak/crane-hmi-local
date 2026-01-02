import { DigitalTwinState } from '@crane/common';
import { apiClient } from './client';

export async function fetchState(): Promise<DigitalTwinState> {
  const { data } = await apiClient.get<DigitalTwinState>('/state');
  return data;
}

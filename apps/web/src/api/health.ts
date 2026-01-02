import { HealthStatus } from '@crane/common';
import { apiClient } from './client';

export async function fetchHealth(): Promise<HealthStatus> {
  const { data } = await apiClient.get<HealthStatus>('/health');
  return data;
}

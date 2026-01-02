import { create } from 'zustand';
import { DigitalTwinState, DEFAULT_DIGITAL_TWIN } from '@crane/common';

interface AppState {
  token: string | null;
  digitalTwin: DigitalTwinState;
  mqttConnected: boolean;
  wsConnected: boolean;
  setToken: (token: string | null) => void;
  setDigitalTwin: (state: DigitalTwinState) => void;
  setMqttConnected: (connected: boolean) => void;
  setWsConnected: (connected: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  digitalTwin: { ...DEFAULT_DIGITAL_TWIN },
  mqttConnected: false,
  wsConnected: false,
  setToken: (token) => set({ token }),
  setDigitalTwin: (state) => set({ digitalTwin: state }),
  setMqttConnected: (connected) => set({ mqttConnected: connected }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
}));

export const appStore = useAppStore;

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { GatewayMessage } from '@crane/common';
import { API_URL } from '../api/client';
import { useAppStore } from '../state/store';

const wsBase = (import.meta.env.VITE_WS_URL as string | undefined) || API_URL.replace(/\/api\/?$/, '');

export function useWebsocket() {
  const token = useAppStore((state) => state.token);
  const setTwin = useAppStore((state) => state.setDigitalTwin);
  const setWsConnected = useAppStore((state) => state.setWsConnected);

  useEffect(() => {
    if (!token) {
      setWsConnected(false);
      return undefined;
    }

    const socket: Socket = io(`${wsBase}/updates`, {
      transports: ['websocket'],
      auth: { token },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => setWsConnected(true));
    socket.on('disconnect', () => setWsConnected(false));
    socket.on('connect_error', () => setWsConnected(false));
    socket.on('message', (message: GatewayMessage) => {
      if (message.type === 'state') {
        setTwin(message.payload);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, setTwin, setWsConnected]);
}

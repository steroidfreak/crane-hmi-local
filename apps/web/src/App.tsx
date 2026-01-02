import { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Chip,
  Container,
  CssBaseline,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppStore } from './state/store';
import { useWebsocket } from './hooks/useWebsocket';
import { fetchState } from './api/state';
import { Dashboard } from './components/Dashboard';
import { LoginCard } from './components/LoginCard';
import { fetchHealth } from './api/health';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2e7d32' },
    secondary: { main: '#90caf9' },
  },
});

export function App() {
  const token = useAppStore((state) => state.token);
  const setDigitalTwin = useAppStore((state) => state.setDigitalTwin);
  const twin = useAppStore((state) => state.digitalTwin);
  const mqttConnected = useAppStore((state) => state.mqttConnected);
  const wsConnected = useAppStore((state) => state.wsConnected);
  const setMqttConnected = useAppStore((state) => state.setMqttConnected);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useWebsocket();

  useEffect(() => {
    if (!token) return;
    const loadState = async () => {
      setLoadingState(true);
      try {
        const state = await fetchState();
        setDigitalTwin(state);
        setError(null);
        const health = await fetchHealth();
        setMqttConnected(health.mqttConnected);
      } catch (err) {
        setError((err as Error).message);
        setMqttConnected(false);
      } finally {
        setLoadingState(false);
      }
    };
    loadState();
  }, [token, setDigitalTwin, setMqttConnected]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Crane Lighting Console</Typography>
            <Chip
              color={mqttConnected ? 'success' : 'default'}
              label={mqttConnected ? 'MQTT Connected' : 'MQTT Disconnected'}
              size="small"
            />
            <Chip
              color={wsConnected ? 'success' : 'default'}
              label={wsConnected ? 'Realtime Linked' : 'Realtime Offline'}
              size="small"
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              color={twin.daliOk ? 'success' : 'error'}
              label={twin.daliOk ? 'DALI OK' : 'DALI Fault'}
              size="small"
            />
            {twin.ts && (
              <Chip
                color="secondary"
                label={`Updated ${new Date(twin.ts).toLocaleTimeString()}`}
                size="small"
              />
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          {!token ? (
            <LoginCard />
          ) : (
            <Dashboard loading={loadingState} error={error} />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

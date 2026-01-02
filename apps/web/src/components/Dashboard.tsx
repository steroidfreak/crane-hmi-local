import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Slider,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { LEVEL_MAX, LEVEL_MIN } from '@crane/common';
import { useAppStore } from '../state/store';
import {
  boomOff,
  boomOn,
  setLightLevel,
  setTrolleyLevel,
  trolleyOff,
  trolleyOn,
} from '../api/controls';
import { CraneVisualizer } from './CraneVisualizer';

interface DashboardProps {
  loading: boolean;
  error: string | null;
}

export function Dashboard({ loading, error }: DashboardProps) {
  const twin = useAppStore((state) => state.digitalTwin);
  const [trolleyLevel, setTrolleyLevelLocal] = useState(twin.trolleyLevel254);
  const [lightLevel, setLightLevelLocal] = useState(twin.lightLevel254);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setTrolleyLevelLocal(twin.trolleyLevel254);
    setLightLevelLocal(twin.lightLevel254);
  }, [twin]);

  const handleCommand = async (action: () => Promise<unknown>, message: string) => {
    setPending(true);
    try {
      await action();
      setToast({ message, severity: 'success' });
    } catch (err) {
      setToast({ message: (err as Error).message, severity: 'error' });
    } finally {
      setPending(false);
    }
  };

  const handleTrolleyLevelCommit = (value: number) =>
    handleCommand(() => setTrolleyLevel(value), `Set trolley level to ${value}`);

  const handleLightLevelCommit = (value: number) =>
    handleCommand(() => setLightLevel(value), `Set light level to ${value}`);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {error && <Alert severity="error">{error}</Alert>}
        {loading && <Alert severity="info">Loading current state…</Alert>}
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Status" subheader="Live crane lighting telemetry" />
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Boom</Typography>
                <Chip label={twin.boom.toUpperCase()} color={twin.boom === 'on' ? 'success' : 'default'} size="small" />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Trolley</Typography>
                <Chip
                  label={twin.trolley.toUpperCase()}
                  color={twin.trolley === 'on' ? 'success' : 'default'}
                  size="small"
                />
              </Stack>
              <Typography variant="body2">Trolley Level: {twin.trolleyLevel254}</Typography>
              <Typography variant="body2">Light Level: {twin.lightLevel254}</Typography>
              <Typography variant="body2">DALI Health: {twin.daliOk ? 'OK' : 'Fault'}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <CraneVisualizer twin={twin} />
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Boom" subheader="Power the crane boom lighting" />
          <CardContent>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="success"
                disabled={pending}
                onClick={() => handleCommand(boomOn, 'Boom on command sent')}
              >
                Boom On
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                disabled={pending}
                onClick={() => handleCommand(boomOff, 'Boom off command sent')}
              >
                Boom Off
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Trolley" subheader="Loop lighting controls" />
          <CardContent>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="success"
                disabled={pending}
                onClick={() => handleCommand(trolleyOn, 'Trolley on command sent')}
              >
                Trolley On
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                disabled={pending}
                onClick={() => handleCommand(trolleyOff, 'Trolley off command sent')}
              >
                Trolley Off
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Trolley Level" subheader="Manual level setpoint (0-254)" />
          <CardContent>
            <Stack spacing={2}>
              <Slider
                value={trolleyLevel}
                min={LEVEL_MIN}
                max={LEVEL_MAX}
                step={1}
                onChange={(_, value) => setTrolleyLevelLocal(value as number)}
                onChangeCommitted={(_, value) => handleTrolleyLevelCommit(value as number)}
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                Current: {trolleyLevel}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Light Level" subheader="Manual light level (0-254)" />
          <CardContent>
            <Stack spacing={2}>
              <Slider
                value={lightLevel}
                min={LEVEL_MIN}
                max={LEVEL_MAX}
                step={1}
                onChange={(_, value) => setLightLevelLocal(value as number)}
                onChangeCommitted={(_, value) => handleLightLevelCommit(value as number)}
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                Current: {lightLevel}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast && <Alert severity={toast.severity}>{toast.message}</Alert>}
      </Snackbar>
    </Grid>
  );
}

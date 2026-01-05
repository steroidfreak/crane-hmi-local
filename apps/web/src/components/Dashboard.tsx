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
  Tab,
  Tabs,
  Slider,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { LEVEL_MAX, LEVEL_MIN, TrolleySpeed } from '@crane/common';
import { useAppStore } from '../state/store';
import {
  boomOff,
  boomOn,
  setLightLevel,
  setTrolleyLevel,
  setTrolleySpeed,

  addressLevel,
  addressOff,
  addressOn,

  setControlMode,

  trolleyOff,
  trolleyOn,
  trolleyReset,
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
  const [manualTab, setManualTab] = useState<'quay' | 'manual'>('quay');
  const [manualAddress, setManualAddress] = useState(0);
  const [manualLevel, setManualLevel] = useState(0);
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

  const handleAddressLevelCommit = () =>
    handleCommand(() => addressLevel(manualAddress, manualLevel), `Set address ${manualAddress} level to ${manualLevel}`);
  const handleControlModeChange = (mode: 'quay' | 'manual') =>
    handleCommand(() => setControlMode(mode), `Switched to ${mode === 'quay' ? 'Quay crane' : 'Manual'} mode`);

  return (
    <>
      <Tabs
        value={manualTab}
        onChange={(_, value) => setManualTab((value as 'quay' | 'manual') ?? 'quay')}
        sx={{ mb: 3 }}
        aria-label="Control mode selection tabs"
      >
        <Tab label="Quay Crane Control" value="quay" />
        <Tab label="Manual (Individual Address)" value="manual" />
      </Tabs>

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
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Speed</Typography>
                <Chip label={twin.trolleySpeed.toUpperCase()} color="info" size="small" />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Mode</Typography>
                <Chip
                  label={twin.controlMode === 'quay' ? 'Quay Crane' : 'Manual'}
                  color={twin.controlMode === 'quay' ? 'secondary' : 'default'}
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

        {manualTab === 'quay' ? (
          <>
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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2">Speed</Typography>
                      <Chip label={twin.trolleySpeed.toUpperCase()} color="info" size="small" />
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
          <CardHeader title="Control Mode" subheader="Select operation mode" />
          <CardContent>
            <ToggleButtonGroup
              value={twin.controlMode}
              exclusive
              fullWidth
              onChange={(_, value) => value && handleControlModeChange(value)}
              color="primary"
            >
              <ToggleButton value="quay" disabled={pending}>
                Quay Crane Control
              </ToggleButton>
              <ToggleButton value="manual" disabled={pending}>
                Manual Mode
              </ToggleButton>
            </ToggleButtonGroup>
          </CardContent>
        </Card>
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
                    <Stack direction="row" spacing={1}>
                      {(['slow', 'medium', 'fast'] as TrolleySpeed[]).map((speed) => (
                        <Button
                          key={speed}
                          variant={twin.trolleySpeed === speed ? 'contained' : 'outlined'}
                          color={twin.trolleySpeed === speed ? 'secondary' : 'inherit'}
                          disabled={pending}
                          onClick={() => handleCommand(() => setTrolleySpeed(speed), `Set trolley speed to ${speed}`)}
                        >
                          {speed.charAt(0).toUpperCase() + speed.slice(1)}
                        </Button>
                      ))}
                    </Stack>
                    <Button
                      variant="outlined"
                      color="warning"
                      disabled={pending}
                      onClick={() => handleCommand(trolleyReset, 'Trolley reset command sent')}
                    >
                      Reset Trolley
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
          </>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Manual Address Controls" subheader="Send commands to a specific DALI short address" />
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Target Address (0-63)
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Slider
                          value={manualAddress}
                          min={0}
                          max={63}
                          step={1}
                          onChange={(_, value) => setManualAddress(value as number)}
                          valueLabelDisplay="auto"
                          sx={{ flexGrow: 1 }}
                        />
                        <Box
                          component="input"
                          type="number"
                          value={manualAddress}
                          min={0}
                          max={63}
                          onChange={(e) => {
                            const next = Number(e.target.value);
                            const clamped = Number.isFinite(next) ? Math.max(0, Math.min(63, next)) : 0;
                            setManualAddress(clamped);
                          }}
                          style={{
                            width: 72,
                            padding: '8px',
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.24)',
                            background: 'transparent',
                            color: 'inherit',
                          }}
                        />
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Address Level (0-254)
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Slider
                          value={manualLevel}
                          min={LEVEL_MIN}
                          max={LEVEL_MAX}
                          step={1}
                          onChange={(_, value) => setManualLevel(value as number)}
                          valueLabelDisplay="auto"
                          sx={{ flexGrow: 1 }}
                        />
                        <Box
                          component="input"
                          type="number"
                          value={manualLevel}
                          min={LEVEL_MIN}
                          max={LEVEL_MAX}
                          onChange={(e) => {
                            const next = Number(e.target.value);
                            const clamped = Number.isFinite(next) ? Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, next)) : LEVEL_MIN;
                            setManualLevel(clamped);
                          }}
                          style={{
                            width: 72,
                            padding: '8px',
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.24)',
                            background: 'transparent',
                            color: 'inherit',
                          }}
                        />
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={pending}
                        onClick={() => handleCommand(() => addressOn(manualAddress), `Address ${manualAddress} on command sent`)}
                      >
                        IND ON
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        disabled={pending}
                        onClick={() => handleCommand(() => addressOff(manualAddress), `Address ${manualAddress} off command sent`)}
                      >
                        IND OFF
                      </Button>
                    </Stack>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={pending}
                      onClick={handleAddressLevelCommit}
                    >
                      Set Address Level
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <CraneVisualizer twin={twin} />
            </Grid>
          </>
        )}

        {toast && (
          <Snackbar
            open
            autoHideDuration={4000}
            onClose={() => setToast(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity={toast.severity}>{toast.message}</Alert>
          </Snackbar>
        )}
      </Grid>
    </>
  );
}

import { DigitalTwinState, LEVEL_MAX, LEVEL_MIN } from '@crane/common';
import { Box, Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';

interface CraneVisualizerProps {
  twin: DigitalTwinState;
}

export function CraneVisualizer({ twin }: CraneVisualizerProps) {
  const trolleyLevel = Math.min(Math.max(twin.trolleyLevel254 ?? LEVEL_MIN, LEVEL_MIN), LEVEL_MAX);
  const lightLevel = Math.min(Math.max(twin.lightLevel254 ?? LEVEL_MIN, LEVEL_MIN), LEVEL_MAX);

  const hoistPercent = trolleyLevel / LEVEL_MAX;
  const trolleyActive = twin.trolley === 'on';
  const boomActive = twin.boom === 'on';
  const lightPercent = lightLevel / LEVEL_MAX;

  const sceneWidth = 360;
  const sceneHeight = 260;
  const apronY = 180;
  const trackY = 56;
  const trackXStart = 70;
  const trackXEnd = 290;
  const trolleyWidth = 42;
  const trolleyHeight = 16;
  const trolleyX = (trackXStart + trackXEnd) / 2;

  const baseRopeLength = 24;
  const ropeTravel = 120;
  const ropeLength = baseRopeLength + hoistPercent * ropeTravel;
  const hookY = trackY + ropeLength;
  const containerY = hookY + 6;

  const trolleyColor = trolleyActive ? '#66bb6a' : '#4a5563';
  const boomColor = boomActive ? '#90caf9' : '#607d8b';
  const glowRadius = 8 + lightPercent * 10;

  const quaysideY = 200;
  const quaysideHeight = 60;
  const statusBarHeight = 32;
  const statusBarY = sceneHeight - statusBarHeight;
  const statusTextY = statusBarY + 20;

  return (
    <Card>
      <CardHeader
        title="Crane Visualization"
        subheader="Trolley hoist position reacts to your commands"
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" color={boomActive ? 'success' : 'default'} label={`Boom ${twin.boom.toUpperCase()}`} />
            <Chip size="small" color={trolleyActive ? 'success' : 'default'} label={`Trolley ${twin.trolley.toUpperCase()}`} />
          </Stack>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            The container lifts and lowers with the trolley level. Lighting intensity adds a soft glow to the crane boom.
          </Typography>
          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'radial-gradient(circle at 20% 10%, rgba(144,202,249,0.18), transparent 35%), radial-gradient(circle at 80% 0%, rgba(102,187,106,0.12), transparent 35%), linear-gradient(180deg, #0f2027 0%, #102a32 50%, #0b1b1f 100%)',
            }}
          >
            <svg viewBox={`0 0 ${sceneWidth} ${sceneHeight}`} role="img" aria-labelledby="crane-visual-title" width="100%" height="100%">
              <title id="crane-visual-title">Crane trolley and container visualization</title>
              <defs>
                <linearGradient id="water" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#123642" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0b1b1f" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="quay" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#37474f" />
                  <stop offset="100%" stopColor="#263238" />
                </linearGradient>
              </defs>

              <rect x="0" y={apronY} width={sceneWidth} height={sceneHeight - apronY} fill="url(#water)" />
              <rect x="-10" y={quaysideY} width="120" height={quaysideHeight} fill="url(#quay)" />
              <rect x="20" y={quaysideY - 10} width="80" height="12" fill="#546e7a" opacity="0.6" />

              <rect x="60" y="72" width="18" height="140" fill="#29414d" rx="3" />
              <rect x="282" y="72" width="18" height="140" fill="#29414d" rx="3" />
              <rect x="52" y="206" width="256" height="10" fill="#1c2a32" rx="2" />

              <rect x={trackXStart} y={trackY - 8} width={trackXEnd - trackXStart} height={16} fill={boomColor} rx={8} />
              <rect x={trackXStart + 6} y={trackY - 4} width={trackXEnd - trackXStart - 12} height={8} fill="rgba(255,255,255,0.1)" />

              <g filter={lightLevel > 0 ? `drop-shadow(0 0 ${glowRadius}px rgba(144,202,249,0.5))` : undefined}>
                <rect
                  x={trolleyX - trolleyWidth / 2}
                  y={trackY - trolleyHeight / 2}
                  width={trolleyWidth}
                  height={trolleyHeight}
                  rx={4}
                  fill={trolleyColor}
                  stroke={trolleyActive ? '#a5d6a7' : '#90a4ae'}
                  strokeWidth={2}
                />
                <circle cx={trackXStart + 10} cy={trackY} r={4} fill={boomColor} opacity={0.8} />
                <circle cx={trackXEnd - 10} cy={trackY} r={4} fill={boomColor} opacity={0.8} />
              </g>

              <line
                x1={trolleyX - 12}
                y1={trackY + trolleyHeight / 2}
                x2={trolleyX - 12}
                y2={hookY}
                stroke={trolleyActive ? '#b3e5fc' : '#546e7a'}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <line
                x1={trolleyX + 12}
                y1={trackY + trolleyHeight / 2}
                x2={trolleyX + 12}
                y2={hookY}
                stroke={trolleyActive ? '#b3e5fc' : '#546e7a'}
                strokeWidth={3}
                strokeLinecap="round"
              />

              <rect x={trolleyX - 14} y={hookY - 4} width={28} height={8} rx={4} fill="#cfd8dc" />

              <rect
                x={trolleyX - 36}
                y={containerY}
                width={72}
                height={36}
                rx={4}
                fill="#ffb74d"
                stroke="#f57c00"
                strokeWidth={2}
                style={{ transition: 'y 0.6s ease' }}
              />
              <rect x={trolleyX - 36} y={containerY} width={72} height={10} fill="#f9a825" opacity={0.9} />
              <line x1={trolleyX - 18} y1={containerY} x2={trolleyX - 18} y2={containerY + 36} stroke="#f57c00" strokeWidth={2} />
              <line x1={trolleyX + 18} y1={containerY} x2={trolleyX + 18} y2={containerY + 36} stroke="#f57c00" strokeWidth={2} />

              <rect x="0" y={statusBarY} width={sceneWidth} height={statusBarHeight} fill="#0c1417" opacity="0.9" />
              <text x="12" y={statusTextY} fill="#90a4ae" fontSize="12">
                Trolley Level {trolleyLevel}
              </text>
              <text x="200" y={statusTextY} fill="#90a4ae" fontSize="12">
                Light Level {lightLevel}
              </text>
            </svg>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CraneVisualizer;

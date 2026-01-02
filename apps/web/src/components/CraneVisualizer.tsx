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
  const sceneHeight = 240;
  const apronY = 180;
  const railRadius = 14;

  const boomY = 72;
  const boomLength = 240;
  const backreachLength = 70;
  const boomThickness = 22;
  const legWidth = 34;
  const legSpacing = 58;
  const legXLeft = 94;
  const legXRight = legXLeft + legSpacing;

  const trolleyX = legXRight + 60;
  const trolleyWidth = 48;
  const trolleyHeight = 18;

  const baseRopeLength = 18;
  const ropeTravel = 96;
  const ropeLength = baseRopeLength + hoistPercent * ropeTravel;
  const hookY = boomY + boomThickness + ropeLength;
  const containerY = hookY + 8;

  const boomColor = boomActive ? '#1e8b54' : '#4a7a5c';
  const trolleyColor = trolleyActive ? '#4a4a4a' : '#6b6b6b';
  const legColor = '#1e8b54';
  const railColor = '#555';
  const quayColor = '#c9c9c9';
  const waterColor = '#c7e5ff';
  const deckColor = '#2f3d44';
  const glowRadius = 6 + lightPercent * 6;
  const trackY = 56;
  const trackXStart = 70;
  const trackXEnd = 290;
  const trolleyX = (trackXStart + trackXEnd) / 2;
  const trolleyWidth = 42;
  const trolleyHeight = 16;

  const baseRopeLength = 24;
  const ropeTravel = 120;
  const ropeLength = baseRopeLength + hoistPercent * ropeTravel;
  const hookY = trackY + ropeLength;
  const containerY = hookY + 6;

  const trolleyColor = trolleyActive ? '#66bb6a' : '#4a5563';
  const boomColor = boomActive ? '#90caf9' : '#607d8b';
  const glowRadius = 8 + lightPercent * 10;


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
          
            <svg viewBox={`0 0 ${sceneWidth} ${sceneHeight}`} role="img" aria-labelledby="crane-visual-title" width="100%" height="100%">
              <title id="crane-visual-title">Crane trolley and container visualization</title>
              <defs>
                <linearGradient id="water" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor={waterColor} stopOpacity="1" />
                  <stop offset="100%" stopColor="#b7dbff" stopOpacity="1" />
                </linearGradient>
              </defs>

              <rect x="0" y={apronY} width={sceneWidth} height={sceneHeight - apronY} fill="url(#water)" />
              <rect x="0" y={apronY - 16} width={sceneWidth} height={16} fill={quayColor} />
              <rect x="0" y="8" width={sceneWidth} height="12" fill={deckColor} opacity="0.9" />

              <rect x={legXLeft} y={boomY} width={legWidth} height={apronY - boomY} fill={legColor} />
              <rect x={legXRight} y={boomY} width={legWidth} height={apronY - boomY} fill={legColor} />
              <circle cx={legXLeft + legWidth / 2} cy={apronY} r={railRadius} fill={railColor} />
              <circle cx={legXRight + legWidth / 2} cy={apronY} r={railRadius} fill={railColor} />

              <rect
                x={legXLeft - backreachLength}
                y={boomY}
                width={boomLength + backreachLength}
                height={boomThickness}
                fill={boomColor}
                rx={4}
              />

              <g filter={lightLevel > 0 ? `drop-shadow(0 0 ${glowRadius}px rgba(144,202,249,0.35))` : undefined}>
                <rect
                  x={trolleyX - trolleyWidth / 2}
                  y={boomY - 4}
                  width={trolleyWidth}
                  height={boomThickness + 8}
                  rx={6}
                  fill={trolleyColor}
                  stroke="#2f2f2f"
                  strokeWidth={2}
                />
                <circle cx={trolleyX - 10} cy={boomY + boomThickness + 4} r={5} fill="#2b2b2b" />
                <circle cx={trolleyX + 10} cy={boomY + boomThickness + 4} r={5} fill="#2b2b2b" />
              </g>

              <line x1={trolleyX} y1={boomY + boomThickness + 6} x2={trolleyX} y2={hookY} stroke="#1f1f1f" strokeWidth={6} strokeLinecap="round" />
              <line x1={trolleyX - 12} y1={boomY + boomThickness + 6} x2={trolleyX - 12} y2={hookY - 4} stroke="#1f1f1f" strokeWidth={4} strokeLinecap="round" />
              <line x1={trolleyX + 12} y1={boomY + boomThickness + 6} x2={trolleyX + 12} y2={hookY - 4} stroke="#1f1f1f" strokeWidth={4} strokeLinecap="round" />

              <rect x={trolleyX - 42} y={containerY} width={84} height={38} rx={4} fill="#d66600" stroke="#a64b00" strokeWidth={3} />
              <rect x={trolleyX - 42} y={containerY} width={84} height={10} fill="#c85b00" />
              <line x1={trolleyX - 30} y1={containerY} x2={trolleyX - 30} y2={containerY + 38} stroke="#a64b00" strokeWidth={3} />
              <line x1={trolleyX} y1={containerY} x2={trolleyX} y2={containerY + 38} stroke="#a64b00" strokeWidth={3} />
              <line x1={trolleyX + 30} y1={containerY} x2={trolleyX + 30} y2={containerY + 38} stroke="#a64b00" strokeWidth={3} />

              <rect x="0" y={sceneHeight - 20} width={sceneWidth} height="20" fill="#0c1417" opacity="0.9" />
              <text x="12" y={sceneHeight - 6} fill="#90a4ae" fontSize="12">Trolley Level {trolleyLevel}</text>
              <text x={sceneWidth - 120} y={sceneHeight - 6} fill="#90a4ae" fontSize="12" textAnchor="start">Light Level {lightLevel}</text>
            <svg viewBox="0 0 360 260" role="img" aria-labelledby="crane-visual-title" width="100%" height="100%">
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

              <rect x="0" y="180" width="360" height="80" fill="url(#water)" />
              <rect x="-10" y="200" width="120" height="60" fill="url(#quay)" />
              <rect x="20" y="190" width="80" height="12" fill="#546e7a" opacity="0.6" />

              <rect x="60" y="72" width="18" height="140" fill="#29414d" rx="3" />
              <rect x="282" y="72" width="18" height="140" fill="#29414d" rx="3" />
              <rect x="52" y="206" width="256" height="10" fill="#1c2a32" rx="2" />

              <rect x={trackXStart} y={trackY - 8} width={trackXEnd - trackXStart} height={16} fill={boomColor} rx={8} />
              <rect
                x={trackXStart + 6}
                y={trackY - 4}
                width={trackXEnd - trackXStart - 12}
                height={8}
                fill="rgba(255,255,255,0.1)"
              />

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
              <rect
                x={trolleyX - 36}
                y={containerY}
                width={72}
                height={10}
                fill="#f9a825"
                opacity={0.9}
              />
              <line x1={trolleyX - 18} y1={containerY} x2={trolleyX - 18} y2={containerY + 36} stroke="#f57c00" strokeWidth={2} />
              <line x1={trolleyX + 18} y1={containerY} x2={trolleyX + 18} y2={containerY + 36} stroke="#f57c00" strokeWidth={2} />

              <rect x="0" y="228" width="360" height="32" fill="#0c1417" opacity="0.9" />
              <text x="12" y="248" fill="#90a4ae" fontSize="12">Trolley Level {trolleyLevel}</text>
              <text x="200" y="248" fill="#90a4ae" fontSize="12">Light Level {lightLevel}</text>

            </svg>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CraneVisualizer;

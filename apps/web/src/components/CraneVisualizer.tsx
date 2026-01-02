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

  const trolleyCenterX = legXRight + 60;
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
                  x={trolleyCenterX - trolleyWidth / 2}
                  y={boomY - 4}
                  width={trolleyWidth}
                  height={boomThickness + 8}
                  rx={6}
                  fill={trolleyColor}
                  stroke="#2f2f2f"
                  strokeWidth={2}
                />
                <circle cx={trolleyCenterX - 10} cy={boomY + boomThickness + 4} r={5} fill="#2b2b2b" />
                <circle cx={trolleyCenterX + 10} cy={boomY + boomThickness + 4} r={5} fill="#2b2b2b" />
              </g>

              <line
                x1={trolleyCenterX}
                y1={boomY + boomThickness + 6}
                x2={trolleyCenterX}
                y2={hookY}
                stroke="#1f1f1f"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <line
                x1={trolleyCenterX - 12}
                y1={boomY + boomThickness + 6}
                x2={trolleyCenterX - 12}
                y2={hookY - 4}
                stroke="#1f1f1f"
                strokeWidth={4}
                strokeLinecap="round"
              />
              <line
                x1={trolleyCenterX + 12}
                y1={boomY + boomThickness + 6}
                x2={trolleyCenterX + 12}
                y2={hookY - 4}
                stroke="#1f1f1f"
                strokeWidth={4}
                strokeLinecap="round"
              />

              <rect x={trolleyCenterX - 42} y={containerY} width={84} height={38} rx={4} fill="#d66600" stroke="#a64b00" strokeWidth={3} />
              <rect x={trolleyCenterX - 42} y={containerY} width={84} height={10} fill="#c85b00" />
              <line x1={trolleyCenterX - 30} y1={containerY} x2={trolleyCenterX - 30} y2={containerY + 38} stroke="#a64b00" strokeWidth={3} />
              <line x1={trolleyCenterX} y1={containerY} x2={trolleyCenterX} y2={containerY + 38} stroke="#a64b00" strokeWidth={3} />
              <line x1={trolleyCenterX + 30} y1={containerY} x2={trolleyCenterX + 30} y2={containerY + 38} stroke="#a64b00" strokeWidth={3} />

              <rect x="0" y={sceneHeight - 20} width={sceneWidth} height="20" fill="#0c1417" opacity="0.9" />
              <text x="12" y={sceneHeight - 6} fill="#90a4ae" fontSize="12">Trolley Level {trolleyLevel}</text>
              <text x={sceneWidth - 120} y={sceneHeight - 6} fill="#90a4ae" fontSize="12" textAnchor="start">Light Level {lightLevel}</text>
            </svg>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CraneVisualizer;

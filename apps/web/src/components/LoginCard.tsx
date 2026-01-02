import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from '@mui/material';
import { login } from '../api/auth';
import { useAppStore } from '../state/store';

export function LoginCard() {
  const setToken = useAppStore((state) => state.setToken);
  const [username, setUsername] = useState(import.meta.env.VITE_USERNAME || '');
  const [password, setPassword] = useState(import.meta.env.VITE_PASSWORD || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { token } = await login({ username, password });
      setToken(token);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 480, margin: '0 auto' }}>
      <CardHeader title="Operator Login" subheader="Authenticate to control the crane lighting." />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={loading} size="large">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

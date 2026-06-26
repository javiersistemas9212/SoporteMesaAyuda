import { Box, Paper, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { SvgIconProps } from '@mui/material';
import type { ComponentType } from 'react';
import type { HealthySummary } from '../types/healthyModulos.types';

interface Props {
  summary: HealthySummary;
  lastExecution: string;
}

interface CardConfig {
  key: keyof HealthySummary;
  label: string;
  from: string;
  to: string;
  Icon: ComponentType<SvgIconProps>;
}

const CARDS: CardConfig[] = [
  {
    key: 'ok',
    label: 'Validados correctamente',
    from: '#388e3c',
    to: '#1b5e20',
    Icon: CheckCircleOutlinedIcon,
  },
  {
    key: 'off',
    label: 'Fuera de horario',
    from: '#1976d2',
    to: '#0d47a1',
    Icon: PowerSettingsNewIcon,
  },
  {
    key: 'error',
    label: 'Con errores',
    from: '#d32f2f',
    to: '#b71c1c',
    Icon: ErrorOutlineIcon,
  },
];

export function HealthySummaryCards({ summary, lastExecution }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {CARDS.map(({ key, label, from, to, Icon }) => (
        <Paper
          key={key}
          elevation={4}
          sx={{
            p: 2,
            borderRadius: 2.5,
            background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.85,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.65rem',
                fontWeight: 600,
                display: 'block',
              }}
            >
              {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
              <Typography variant="h3" fontWeight={800} lineHeight={1} sx={{ fontSize: '2.4rem' }}>
                {summary[key]}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                módulos
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: -8,
              bottom: -8,
              opacity: 0.12,
              color: 'white',
            }}
          >
            <Icon sx={{ fontSize: 72 }} />
          </Box>
        </Paper>
      ))}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mt: 1,
          p: 1.5,
          bgcolor: 'action.hover',
          borderRadius: 2,
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.62rem', display: 'block' }}
          >
            Última ejecución
          </Typography>
          <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500 }}>
            {lastExecution}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

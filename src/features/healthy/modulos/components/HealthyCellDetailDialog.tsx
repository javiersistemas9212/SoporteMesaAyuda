import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import type { SvgIconProps } from '@mui/material';
import type { ComponentType } from 'react';
import type { ModuleCheckResult, ModuleStatus } from '../types/healthyModulos.types';

interface Props {
  result: ModuleCheckResult | null;
  onClose: () => void;
}

const STATUS_LABELS: Record<ModuleStatus, string> = {
  OK: 'Operando correctamente',
  OFF: 'Fuera de horario',
  ERROR: 'Error',
};

const STATUS_CHIP_COLORS: Record<ModuleStatus, 'success' | 'info' | 'error'> = {
  OK: 'success',
  OFF: 'info',
  ERROR: 'error',
};

const STATUS_ICONS: Record<ModuleStatus, ComponentType<SvgIconProps>> = {
  OK: CheckCircleOutlinedIcon,
  OFF: PowerSettingsNewIcon,
  ERROR: ErrorOutlineIcon,
};

const STATUS_ACCENT: Record<ModuleStatus, { bg: string; border: string }> = {
  OK: { bg: '#e8f5e9', border: '#388e3c' },
  OFF: { bg: '#e3f2fd', border: '#1976d2' },
  ERROR: { bg: '#ffebee', border: '#d32f2f' },
};

interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

function DetailRow({ label, value, mono }: DetailRowProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          fontSize: '0.62rem',
          display: 'block',
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: mono ? 'monospace' : undefined,
          wordBreak: 'break-all',
          color: 'text.primary',
          fontWeight: mono ? 400 : 500,
          fontSize: mono ? '0.78rem' : '0.875rem',
          lineHeight: 1.5,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export function HealthyCellDetailDialog({ result, onClose }: Props) {
  if (!result) return null;

  const StatusIcon = STATUS_ICONS[result.status];
  const accent = STATUS_ACCENT[result.status];

  return (
    <Dialog open={!!result} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <StatusIcon color={STATUS_CHIP_COLORS[result.status]} sx={{ fontSize: 24 }} />
          <Typography variant="h6" fontWeight={700}>
            {result.module}
          </Typography>
          <Chip
            label={STATUS_LABELS[result.status]}
            color={STATUS_CHIP_COLORS[result.status]}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12 }}
          aria-label="Cerrar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 0 }}>
          <Box sx={{ flex: 1 }}>
            <DetailRow label="Cliente" value={result.client} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DetailRow label="Módulo" value={result.module} />
          </Box>
        </Box>

        <DetailRow label="URL de la API" value={result.url} mono />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 3, mb: 0 }}>
          <Box sx={{ flex: 1 }}>
            <DetailRow label="Status Code" value={result.statusCode.toString()} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
              <TimerOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.62rem' }}
              >
                Tiempo de respuesta
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              {result.responseTime > 0 ? `${result.responseTime} ms` : 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: accent.bg,
            borderRadius: 1.5,
            borderLeft: `4px solid ${accent.border}`,
            mt: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              fontSize: '0.62rem',
              display: 'block',
              mb: 0.75,
            }}
          >
            Mensaje del servidor
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.65 }}>
            {result.message}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

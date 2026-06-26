import { Box, Paper, Typography } from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import type { EstadoCounts } from '../types/ticketUsuario.types';

interface Props {
  counts: EstadoCounts;
}

const CARDS = [
  {
    key: 'abierto' as keyof EstadoCounts,
    label: 'Abiertos',
    from: '#f57c00',
    to: '#e65100',
    Icon: FolderOpenOutlinedIcon,
  },
  {
    key: 'enProceso' as keyof EstadoCounts,
    label: 'En Proceso',
    from: '#1976d2',
    to: '#0d47a1',
    Icon: AutorenewOutlinedIcon,
  },
  {
    key: 'cerrado' as keyof EstadoCounts,
    label: 'Cerrados',
    from: '#388e3c',
    to: '#1b5e20',
    Icon: VerifiedOutlinedIcon,
  },
  {
    key: 'pendiente' as keyof EstadoCounts,
    label: 'Pendiente',
    from: '#7b1fa2',
    to: '#4a148c',
    Icon: WatchLaterOutlinedIcon,
  },
];

export function UsuarioStatCards({ counts }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
        px: 2,
      }}
    >
      {CARDS.map(({ key, label, from, to, Icon }) => (
        <Box key={key} sx={{ flex: '1 1 200px', maxWidth: 280 }}>
          <Paper
            elevation={4}
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.85,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  fontSize: '0.68rem',
                  fontWeight: 600,
                }}
              >
                {label}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75 }}>
                <Typography variant="h3" fontWeight={800} lineHeight={1} sx={{ fontSize: '2.6rem' }}>
                  {counts[key]}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                  casos
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                right: -10,
                bottom: -10,
                opacity: 0.13,
                color: 'white',
              }}
            >
              <Icon sx={{ fontSize: 90 }} />
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

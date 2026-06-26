import type { ReactNode } from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  Typography,
} from '@mui/material';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { TicketUsuario } from '../types/ticketUsuario.types';

interface Props {
  ticket: TicketUsuario | null;
  onClose: () => void;
}

const ESTADO_COLOR: Record<TicketUsuario['Estado'], 'warning' | 'info' | 'success' | 'secondary'> = {
  Abierto: 'warning',
  'En proceso': 'info',
  Cerrado: 'success',
  Pendiente: 'secondary',
};

const PRIORIDAD_COLOR: Record<TicketUsuario['Prioridad'], 'error' | 'warning' | 'success'> = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'success',
};

const TIPO_COLOR: Record<TicketUsuario['Tipo'], 'primary' | 'info'> = {
  Funcional: 'primary',
  Técnico: 'info',
};

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 130, fontWeight: 600, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

export function TicketDetailDialog({ ticket, onClose }: Props) {
  if (!ticket) return null;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
        }}
      >
        <ConfirmationNumberOutlinedIcon />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
            {ticket.IdTicket}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Detalle del ticket
          </Typography>
        </Box>
        <Chip
          label={ticket.Estado}
          color={ESTADO_COLOR[ticket.Estado]}
          size="small"
          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
        />
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <FieldRow label="Tipo">
          <Chip
            label={ticket.Tipo}
            color={TIPO_COLOR[ticket.Tipo]}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </FieldRow>

        <Divider />

        <FieldRow label="Estado">
          <Chip
            label={ticket.Estado}
            color={ESTADO_COLOR[ticket.Estado]}
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </FieldRow>

        <Divider />

        <FieldRow label="Prioridad">
          <Chip
            label={ticket.Prioridad}
            color={PRIORIDAD_COLOR[ticket.Prioridad]}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </FieldRow>

        <Divider />

        <FieldRow label="Asignado A">
          <Typography variant="body2">{ticket.AsignadoA}</Typography>
        </FieldRow>

        <Divider />

        <FieldRow label="Fecha Creación">
          <Typography variant="body2">{ticket.FechaCreacion}</Typography>
        </FieldRow>

        <Divider />

        <FieldRow label="Título">
          <Typography variant="body2" fontWeight={500}>
            {ticket.Titulo}
          </Typography>
        </FieldRow>

        {ticket.Validaciones.length > 0 && (
          <>
            <Divider />
            <FieldRow label="Validaciones">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {ticket.Validaciones.map((v, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                    <WarningAmberRoundedIcon
                      sx={{ fontSize: 15, color: 'warning.main', mt: '2px', flexShrink: 0 }}
                    />
                    <Typography variant="caption" color="warning.dark">
                      {v}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </FieldRow>
          </>
        )}

        {ticket.Validaciones.length === 0 && (
          <>
            <Divider />
            <FieldRow label="Validaciones">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main' }} />
                <Typography variant="caption" color="success.dark">
                  Sin validaciones pendientes
                </Typography>
              </Box>
            </FieldRow>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

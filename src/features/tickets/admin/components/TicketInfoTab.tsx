import { Box, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import type { TicketUsuario } from '../../usuario/types/ticketUsuario.types';

interface Props {
  ticket: TicketUsuario | null;
}

const estadoColor: Record<string, 'warning' | 'info' | 'success' | 'default'> = {
  Abierto: 'warning',
  'En proceso': 'info',
  Cerrado: 'success',
  Pendiente: 'default',
};

const prioridadColor: Record<string, 'error' | 'warning' | 'success'> = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'success',
};

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
        {label}
      </Typography>
      <Box mt={0.5}>{value}</Box>
    </Box>
  );
}

export function TicketInfoTab({ ticket }: Props) {
  if (!ticket) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Ingrese un ID de ticket y presione Buscar para ver la información.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <InfoField label="ID Ticket" value={
            <Typography fontWeight={700} fontSize={16}>{ticket.IdTicket}</Typography>
          } />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <InfoField label="Estado" value={
            <Chip
              label={ticket.Estado}
              color={estadoColor[ticket.Estado] ?? 'default'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          } />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <InfoField label="Prioridad" value={
            <Chip
              label={ticket.Prioridad}
              color={prioridadColor[ticket.Prioridad] ?? 'default'}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          } />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <InfoField label="Título" value={
            <Typography>{ticket.Titulo}</Typography>
          } />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <InfoField label="Tipo" value={
            <Chip label={ticket.Tipo} size="small" variant="outlined" />
          } />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <InfoField label="Asignado a" value={
            <Typography>{ticket.AsignadoA}</Typography>
          } />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <InfoField label="Fecha de creación" value={
            <Typography>{ticket.FechaCreacion}</Typography>
          } />
        </Grid>

        {ticket.Validaciones.length > 0 && (
          <Grid item xs={12}>
            <Divider />
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                Validaciones
              </Typography>
              <Paper variant="outlined" sx={{ mt: 1, p: 2, borderRadius: 1.5, bgcolor: 'grey.50' }}>
                {ticket.Validaciones.map((v, i) => (
                  <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    • {v}
                  </Typography>
                ))}
              </Paper>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

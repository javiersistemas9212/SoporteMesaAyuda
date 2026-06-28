import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box } from '@mui/material';

interface Props {
  open: boolean;
  ticketId: string;
  onClose: () => void;
}

export function SaveConfirmModal({ open, ticketId, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Guardado exitoso</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'success.main' }} />
          <Typography textAlign="center">
            La información del ticket{' '}
            <Typography component="span" fontWeight={700} color="primary">
              {ticketId}
            </Typography>{' '}
            fue guardada correctamente.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import {
  Box,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type { BitacoraData, CanalAtencion } from '../types/ticketAdmin.types';

const CANALES: CanalAtencion[] = ['Chat', 'Correo o plataforma', 'Llamada'];

interface Props {
  data: BitacoraData;
  onChange: (data: BitacoraData) => void;
  showValidation?: boolean;
}

export function BitacoraTab({ data, onChange, showValidation }: Props) {
  const toggleAgregar = () => {
    onChange({ ...data, agregarBitacora: !data.agregarBitacora });
  };

  const toggleCanal = (canal: CanalAtencion) => {
    const canales = data.canales.includes(canal)
      ? data.canales.filter(c => c !== canal)
      : [...data.canales, canal];
    onChange({ ...data, canales });
  };

  const canalError = showValidation && data.agregarBitacora && data.canales.length === 0;
  const detalleError = showValidation && data.agregarBitacora && data.detalle.trim() === '';

  return (
    <Box sx={{ p: 3 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={data.agregarBitacora}
            onChange={toggleAgregar}
            color="primary"
          />
        }
        label={
          <Typography fontWeight={600}>
            Agregar a la bitácora
          </Typography>
        }
      />

      <Collapse in={data.agregarBitacora} unmountOnExit>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Divider />

          <FormControl error={canalError} component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
              Canal de atención
            </FormLabel>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <FormGroup row>
                {CANALES.map(canal => (
                  <FormControlLabel
                    key={canal}
                    control={
                      <Checkbox
                        checked={data.canales.includes(canal)}
                        onChange={() => toggleCanal(canal)}
                        size="small"
                      />
                    }
                    label={canal}
                    sx={{ mr: 4 }}
                  />
                ))}
              </FormGroup>
            </Paper>
            {canalError && (
              <FormHelperText>Seleccione al menos un canal de atención.</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Detalle del caso"
            multiline
            rows={5}
            fullWidth
            value={data.detalle}
            onChange={e => onChange({ ...data, detalle: e.target.value })}
            error={detalleError}
            helperText={detalleError ? 'El detalle del caso es requerido.' : `${data.detalle.length} caracteres`}
            placeholder="Describa el caso funcional atendido..."
          />
        </Box>
      </Collapse>

      {!data.agregarBitacora && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Active la casilla para registrar información en la bitácora de este ticket.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

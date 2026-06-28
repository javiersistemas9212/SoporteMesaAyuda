import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { scriptSchema, type ScriptFormValues } from '../schemas/ticketAdmin.schemas';
import type { ScriptObjeto } from '../types/ticketAdmin.types';

interface Props {
  open: boolean;
  editing: ScriptObjeto | null;
  onClose: () => void;
  onSubmit: (values: ScriptFormValues) => void;
}

const TIPO_OPTIONS = ['Objeto', 'Datos'] as const;
const ACCION_OPTIONS = ['Crear', 'Actualizar', 'Eliminar'] as const;
const DB_OPTIONS = ['dbfondos', 'sentyclient', 'dbejemplo'] as const;

export function ScriptFormDialog({ open, editing, onClose, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScriptFormValues>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      tipoObjeto: undefined,
      accion: undefined,
      baseDatos: undefined,
      nombreScript: '',
      descripcion: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              tipoObjeto: editing.tipoObjeto,
              accion: editing.accion,
              baseDatos: editing.baseDatos,
              nombreScript: editing.nombreScript,
              descripcion: editing.descripcion,
            }
          : {
              tipoObjeto: undefined,
              accion: undefined,
              baseDatos: undefined,
              nombreScript: '',
              descripcion: '',
            },
      );
    }
  }, [open, editing, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {editing ? 'Editar script' : 'Agregar script'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} mt={0.5}>
          <Controller
            name="tipoObjeto"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.tipoObjeto}>
                <InputLabel>Tipo de objeto</InputLabel>
                <Select {...field} label="Tipo de objeto" value={field.value ?? ''}>
                  {TIPO_OPTIONS.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
                {errors.tipoObjeto && (
                  <FormHelperText>{errors.tipoObjeto.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="accion"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.accion}>
                <InputLabel>Acción</InputLabel>
                <Select {...field} label="Acción" value={field.value ?? ''}>
                  {ACCION_OPTIONS.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
                {errors.accion && (
                  <FormHelperText>{errors.accion.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="baseDatos"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.baseDatos}>
                <InputLabel>Base de datos</InputLabel>
                <Select {...field} label="Base de datos" value={field.value ?? ''}>
                  {DB_OPTIONS.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
                {errors.baseDatos && (
                  <FormHelperText>{errors.baseDatos.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="nombreScript"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre del script"
                size="small"
                fullWidth
                error={!!errors.nombreScript}
                helperText={errors.nombreScript?.message}
              />
            )}
          />

          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                size="small"
                fullWidth
                multiline
                rows={3}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          {editing ? 'Actualizar' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

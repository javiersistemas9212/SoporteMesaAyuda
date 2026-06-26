import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Divider,
} from '@mui/material'
import { Close, Visibility, VisibilityOff } from '@mui/icons-material'
import { createAgenteSchema, updateAgenteSchema } from '../schemas/agente.schema'
import type { Agente } from '../types/agente.types'
import rolesData from '../../../../app/Mocks/roles.json'

interface RolRaw { Id: number; Nombre: string }
const roles = rolesData as RolRaw[]

interface FormValues {
  Nombre: string
  Correo: string
  Contrasena: string
  RolId: number
}

interface AgenteFormDialogProps {
  open: boolean
  agente: Agente | null
  onClose: () => void
  onSubmit: (values: FormValues, isEdit: boolean) => Promise<void>
}

export function AgenteFormDialog({ open, agente, onClose, onSubmit }: AgenteFormDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isEdit = !!agente

  const schema = isEdit ? updateAgenteSchema : createAgenteSchema
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      Nombre: agente?.Nombre ?? '',
      Correo: agente?.Correo ?? '',
      Contrasena: '',
      RolId: agente?.RolId ?? 0,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        Nombre: agente?.Nombre ?? '',
        Correo: agente?.Correo ?? '',
        Contrasena: '',
        RolId: agente?.RolId ?? 0,
      })
      setShowPassword(false)
    }
  }, [open, agente, reset])

  const handleFormSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      await onSubmit(values, isEdit)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 64px rgba(18,36,64,0.18)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2.5,
            background: 'linear-gradient(135deg, #122440 0%, #41819b 100%)',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {isEdit ? 'Editar Agente' : 'Nuevo Agente'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              {isEdit ? `Modificando: ${agente?.Nombre}` : 'Completa los campos para crear un agente'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 1 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <TextField
            label="Nombre completo"
            fullWidth
            {...register('Nombre')}
            error={!!errors.Nombre}
            helperText={errors.Nombre?.message}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            {...register('Correo')}
            error={!!errors.Correo}
            helperText={errors.Correo?.message}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            label={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('Contrasena')}
            error={!!errors.Contrasena}
            helperText={
              errors.Contrasena?.message ??
              (isEdit ? 'Deja en blanco para mantener la contraseña actual' : undefined)
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(p => !p)} edge="end" size="small" tabIndex={-1}>
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Controller
            name="RolId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.RolId} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                <InputLabel>Rol</InputLabel>
                <Select
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={e => field.onChange(Number(e.target.value))}
                  label="Rol"
                >
                  {roles.map(rol => (
                    <MenuItem key={rol.Id} value={rol.Id}>
                      {rol.Nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.RolId && <FormHelperText>{errors.RolId.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Divider sx={{ my: 0.5 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={submitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #122440 0%, #41819b 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1a3a60 0%, #4e9ab8 100%)' },
              }}
            >
              {submitting
                ? <CircularProgress size={20} sx={{ color: 'white' }} />
                : isEdit ? 'Guardar cambios' : 'Crear agente'
              }
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

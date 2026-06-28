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
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Close, Palette } from '@mui/icons-material'
import { clienteSchema } from '../schemas/cliente.schema'
import type { ClienteFormValues } from '../schemas/cliente.schema'
import type { Cliente } from '../types/cliente.types'

interface ClienteFormDialogProps {
  open: boolean
  cliente: Cliente | null
  onClose: () => void
  onSubmit: (values: ClienteFormValues, isEdit: boolean) => Promise<void>
}

export function ClienteFormDialog({ open, cliente, onClose, onSubmit }: ClienteFormDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const isEdit = !!cliente

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema) as Resolver<ClienteFormValues>,
    defaultValues: {
      NombreCorto: '',
      NombreLargo: '',
      Nit: '',
      ColorInstitucional: '#122440',
      VersionActual: '',
      ContactoTI: '',
      Creditos: 0,
      TipoCliente: 'SaaS',
    },
  })

  const colorValue = watch('ColorInstitucional')

  useEffect(() => {
    if (open) {
      reset({
        NombreCorto: cliente?.NombreCorto ?? '',
        NombreLargo: cliente?.NombreLargo ?? '',
        Nit: cliente?.Nit ?? '',
        ColorInstitucional: cliente?.ColorInstitucional ?? '#122440',
        VersionActual: cliente?.VersionActual ?? '',
        ContactoTI: cliente?.ContactoTI ?? '',
        Creditos: cliente?.Creditos ?? 0,
        TipoCliente: cliente?.TipoCliente ?? 'SaaS',
      })
    }
  }, [open, cliente, reset])

  const handleFormSubmit = async (values: ClienteFormValues) => {
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
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 64px rgba(18,36,64,0.18)',
        },
      }}
    >
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
              {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              {isEdit
                ? `Modificando: ${cliente?.NombreLargo}`
                : 'Completa los campos para registrar un cliente corporativo'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
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
          {/* Row 1: Nombre Corto + Nombre Largo */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
            <TextField
              label="Nombre Corto"
              fullWidth
              {...register('NombreCorto')}
              error={!!errors.NombreCorto}
              helperText={errors.NombreCorto?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Nombre Largo"
              fullWidth
              {...register('NombreLargo')}
              error={!!errors.NombreLargo}
              helperText={errors.NombreLargo?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          {/* Row 2: NIT + Tipo de Cliente */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="NIT"
              fullWidth
              placeholder="900123456-7"
              {...register('Nit')}
              error={!!errors.Nit}
              helperText={errors.Nit?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Controller
              name="TipoCliente"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.TipoCliente} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                  <InputLabel>Tipo de Cliente</InputLabel>
                  <Select {...field} label="Tipo de Cliente">
                    <MenuItem value="SaaS">SaaS</MenuItem>
                    <MenuItem value="On-premise">On-premise</MenuItem>
                  </Select>
                  {errors.TipoCliente && <FormHelperText>{errors.TipoCliente.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Box>

          {/* Row 3: Color Institucional + Versión Actual */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller
              name="ColorInstitucional"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                    Color Institucional
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      border: '1px solid',
                      borderColor: errors.ColorInstitucional ? 'error.main' : 'divider',
                      borderRadius: 2,
                      bgcolor: 'white',
                    }}
                  >
                    <Tooltip title="Seleccionar color">
                      <Box
                        component="label"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: colorValue,
                            border: '2px solid',
                            borderColor: 'divider',
                            flexShrink: 0,
                          }}
                        />
                        <Palette sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <input
                          type="color"
                          value={field.value}
                          onChange={e => field.onChange(e.target.value)}
                          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                        />
                      </Box>
                    </Tooltip>
                    <TextField
                      size="small"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      error={!!errors.ColorInstitucional}
                      helperText={errors.ColorInstitucional?.message}
                      placeholder="#000000"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
                        '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem' },
                      }}
                    />
                  </Box>
                </Box>
              )}
            />
            <TextField
              label="Versión Actual de la Aplicación"
              fullWidth
              placeholder="1.0.0"
              {...register('VersionActual')}
              error={!!errors.VersionActual}
              helperText={errors.VersionActual?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          {/* Row 4: Contacto TI + Créditos */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
            <TextField
              label="Contacto TI"
              type="email"
              fullWidth
              placeholder="ti@empresa.com"
              {...register('ContactoTI')}
              error={!!errors.ContactoTI}
              helperText={errors.ContactoTI?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Controller
              name="Creditos"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Créditos"
                  type="number"
                  fullWidth
                  value={field.value}
                  onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                  error={!!errors.Creditos}
                  helperText={errors.Creditos?.message}
                  inputProps={{ min: 0 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            />
          </Box>

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
              {submitting ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : isEdit ? (
                'Guardar cambios'
              ) : (
                'Crear cliente'
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

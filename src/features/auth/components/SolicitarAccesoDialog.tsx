import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import {
  BadgeOutlined,
  CheckCircle,
  Close,
  EmailOutlined,
  SendOutlined,
} from '@mui/icons-material'
import { solicitarAccesoSchema, type SolicitarAccesoFormValues } from '../schemas/solicitarAcceso.schema'
import { solicitarAccesoJira } from '../services/jiraAccessService'
import type { JiraTicketCreado } from '../types/solicitarAcceso.types'

interface Props {
  open: boolean
  onClose: () => void
}

export function SolicitarAccesoDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ticketCreado, setTicketCreado] = useState<JiraTicketCreado | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SolicitarAccesoFormValues>({
    resolver: zodResolver(solicitarAccesoSchema),
  })

  const handleClose = () => {
    reset()
    setError(null)
    setTicketCreado(null)
    onClose()
  }

  const onSubmit = async (values: SolicitarAccesoFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const ticket = await solicitarAccesoJira({
        nombreCompleto: values.nombreCompleto,
        correo: values.correo,
      })
      setTicketCreado(ticket)
    } catch {
      setError('Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 64px rgba(18,36,64,0.18)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #122440 0%, #41819b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SendOutlined sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography fontWeight={700} fontSize="1rem" color="#122440">
            Solicitar acceso al sistema
          </Typography>
        </Box>
        {!loading && (
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.disabled' }}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3, pt: 1 }}>
        {ticketCreado ? (
          /* ── Estado de éxito ── */
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography fontWeight={700} fontSize="1.05rem" color="#122440" mb={1}>
              ¡Solicitud enviada con éxito!
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2.5} lineHeight={1.6}>
              Hemos registrado tu solicitud de acceso. El equipo de soporte la revisará
              y te enviará tus credenciales al correo indicado.
            </Typography>
            <Box
              sx={{
                display: 'inline-block',
                bgcolor: '#f0f4ff',
                border: '1px solid #c7d4f0',
                borderRadius: 2,
                px: 2.5,
                py: 1,
                mb: 3,
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" mb={0.3}>
                Número de ticket
              </Typography>
              <Typography fontWeight={800} fontSize="1rem" color="#122440">
                {ticketCreado.key}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleClose}
              sx={{
                py: 1.4,
                fontWeight: 700,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #122440 0%, #41819b 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1a3a60 0%, #4e9ab8 100%)',
                },
              }}
            >
              Entendido
            </Button>
          </Box>
        ) : (
          /* ── Formulario ── */
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="body2" color="text.secondary" mb={2.5} lineHeight={1.6}>
              Completa el formulario y se creará automáticamente un ticket en Jira
              para que el equipo de soporte te asigne un usuario y contraseña.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem' }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Nombre completo"
                fullWidth
                autoComplete="name"
                autoFocus
                {...register('nombreCompleto')}
                error={!!errors.nombreCompleto}
                helperText={errors.nombreCompleto?.message}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, display: 'flex', color: 'text.disabled' }}>
                      <BadgeOutlined fontSize="small" />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#41819b' },
                    '&.Mui-focused fieldset': { borderColor: '#122440' },
                  },
                }}
              />

              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                autoComplete="email"
                {...register('correo')}
                error={!!errors.correo}
                helperText={errors.correo?.message}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, display: 'flex', color: 'text.disabled' }}>
                      <EmailOutlined fontSize="small" />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#41819b' },
                    '&.Mui-focused fieldset': { borderColor: '#122440' },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #122440 0%, #41819b 100%)',
                  letterSpacing: '0.3px',
                  boxShadow: '0 4px 16px rgba(18,36,64,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a3a60 0%, #4e9ab8 100%)',
                    boxShadow: '0 6px 20px rgba(18,36,64,0.4)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #122440 0%, #41819b 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                {loading
                  ? <CircularProgress size={22} sx={{ color: 'white' }} />
                  : 'Solicitar usuario'
                }
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

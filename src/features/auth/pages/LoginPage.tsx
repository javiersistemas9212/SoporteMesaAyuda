import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from '@mui/icons-material'
import { keyframes } from '@mui/system'
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema'
import { authenticate } from '../services/authService'
import { useAuthContext } from '../../../contexts/AuthContext'

const scrollWord = keyframes`
  from { transform: translateX(50vw);   }
  to   { transform: translateX(-260vw); }
`

const fadeInLogo = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.92); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`

const SCROLL_DURATION = 7       // seconds — word crosses the panel
const LOGO_DELAY      = SCROLL_DURATION + 0.4  // logo appears just after word exits

function MakersLogo({ height = 56 }: { height?: number }) {
  const width = Math.round(height * (310 / 80))
  return (
    <svg width={width} height={height} viewBox="0 0 310 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="52" width="18" height="18" rx="3" fill="#E91E63" />
      <rect x="2"  y="32" width="18" height="18" rx="3" fill="#29B6F6" />
      <rect x="22" y="32" width="18" height="18" rx="3" fill="#4CAF50" />
      <text
        x="46" y="68"
        fill="#1A1464"
        style={{
          fontFamily: "'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: '56px',
          letterSpacing: '-2px',
        }}
      >makers</text>
    </svg>
  )
}

const FEATURES = [
  'Gestión de tickets Jira y Usuario',
  'Monitoreo de salud del sistema',
  'Administración de agentes y roles',
]

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const { login } = useAuthContext()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    setAuthError(null)
    await new Promise(r => setTimeout(r, 500))
    const user = authenticate({ correo: values.correo, contrasena: values.contrasena })
    if (!user) {
      setAuthError('Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.')
      setLoading(false)
      return
    }
    login(user)
    navigate('/dashboard', { replace: true })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#f0f2f5',
      }}
    >
      {/* ── Left panel ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '0 0 44%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg, #122440 0%, #1a3f6b 45%, #41819b 100%)',
          p: 6,
        }}
      >
        {/* Decorative rings */}
        {[480, 360, 260, 170, 90].map((size, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `1px solid rgba(255,255,255,${0.04 + i * 0.02})`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Glowing blob */}
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(2,136,209,0.25) 0%, transparent 70%)',
            top: '20%',
            right: '-60px',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(65,129,155,0.3) 0%, transparent 70%)',
            bottom: '10%',
            left: '-40px',
          }}
        />

        {/* Background word marquee — "makers" scrolls right → left as one unit */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.3,
            animation: `${scrollWord} ${SCROLL_DURATION}s linear both`,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: '52vw',
              fontWeight: 900,
              fontStyle: 'italic',
              lineHeight: 1,
              color: 'white',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              fontFamily: "'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            makers
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 360 }}>
          {/* Logo card — aparece con animación tras la última letra */}
          <Box
            sx={{
              mb: 3,
              display: 'inline-block',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 3,
              px: 4,
              py: 2.5,
              boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.35)',
              animation: `${fadeInLogo} 0.9s cubic-bezier(0.34,1.56,0.64,1) ${LOGO_DELAY}s both`,
            }}
          >
            <MakersLogo height={56} />
          </Box>

          <Typography
            variant="h4"
            sx={{ color: 'white', fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}
          >
            Makers Soporte
          </Typography>
          <Typography
            sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}
          >
            Sistema de gestión de soporte técnico empresarial
          </Typography>

          {/* Feature list */}
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FEATURES.map(feat => (
              <Box
                key={feat}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <CheckCircleOutline sx={{ color: '#03a9f4', fontSize: 18, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                  {feat}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Version */}
          <Chip
            label="v1.0.0"
            size="small"
            sx={{
              mt: 5,
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
        </Box>
      </Box>

      {/* ── Right panel ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
          }}
        >
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
            <MakersLogo height={36} />
          </Box>

          {/* Card */}
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 4,
              p: { xs: 3.5, sm: 5 },
              boxShadow: '0 24px 64px rgba(18,36,64,0.12)',
              border: '1px solid rgba(18,36,64,0.06)',
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: '#122440', mb: 0.5, letterSpacing: '-0.3px' }}
              >
                Iniciar sesión
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Ingresa tus credenciales para acceder al sistema
              </Typography>
            </Box>

            {authError && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2, fontSize: '0.85rem' }}
                onClose={() => setAuthError(null)}
              >
                {authError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
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
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
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
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                autoComplete="current-password"
                {...register('contrasena')}
                error={!!errors.contrasena}
                helperText={errors.contrasena?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(p => !p)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showPassword
                          ? <VisibilityOff fontSize="small" />
                          : <Visibility fontSize="small" />
                        }
                      </IconButton>
                    </InputAdornment>
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
                  py: 1.6,
                  fontWeight: 700,
                  fontSize: '0.95rem',
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
                  : 'Ingresar al sistema'
                }
              </Button>
            </Box>

            {/* Footer hint */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: '#f8fafc',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 600 }}>
                Credenciales de prueba:
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Admin: jonathan@makers.com / admin123
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Agente: hugo@makers.com / agente123
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'text.disabled' }}
          >
            © 2026 Makers Soporte · Versión 1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

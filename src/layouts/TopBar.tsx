import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material'
import { Logout, Person, AdminPanelSettings, SupportAgent } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { MiPerfilDialog } from '../components/MiPerfilDialog'
import { ChangelogDialog } from '../features/changelog/components/ChangelogDialog'
import { useChangelog } from '../features/changelog/hooks/useChangelog'

const ROL_COLORS: Record<string, string> = {
  Administrador: '#0288d1',
  Agente: '#2e7d32',
  Supervisor: '#f57f17',
}

export function TopBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [changelogOpen, setChangelogOpen] = useState(false)
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  const { version } = useChangelog()

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLogout = () => {
    handleClose()
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.nombre
    ? user.nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <>
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        bgcolor: 'primary.main',
        zIndex: 99,
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important', px: 3, gap: 2 }}>
        {/* Branding */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SupportAgent sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '1.2rem',
              letterSpacing: '-0.3px',
            }}
          >
            Makers Soporte
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Ver changelog" arrow>
            <Chip
              label={`v${version}`}
              size="small"
              onClick={() => setChangelogOpen(true)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 24,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
              }}
            />
          </Tooltip>

          <IconButton onClick={handleOpen} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'secondary.main',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { opacity: 0.85 },
              }}
            >
              {initials}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: { mt: 1, minWidth: 220, borderRadius: 2 },
              },
            }}
          >
            {/* User info */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                {user?.nombre ?? 'Usuario'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {user?.correo ?? ''}
              </Typography>
              {user?.rol && (
                <Chip
                  label={user.rol}
                  size="small"
                  icon={<AdminPanelSettings sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    mt: 0.75,
                    height: 20,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    bgcolor: `${ROL_COLORS[user.rol] ?? '#6b7280'}18`,
                    color: ROL_COLORS[user.rol] ?? '#6b7280',
                    '& .MuiChip-icon': { color: ROL_COLORS[user.rol] ?? '#6b7280' },
                  }}
                />
              )}
            </Box>

            <Divider />

            <MenuItem
              onClick={() => { handleClose(); setProfileOpen(true) }}
              sx={{ gap: 1.5, py: 1.2 }}
            >
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>
              <Typography variant="body2">Mi perfil</Typography>
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              sx={{ gap: 1.5, py: 1.2, color: 'error.main' }}
            >
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <Typography variant="body2">Cerrar sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>

    <MiPerfilDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    <ChangelogDialog open={changelogOpen} onClose={() => setChangelogOpen(false)} />
  </>
  )
}

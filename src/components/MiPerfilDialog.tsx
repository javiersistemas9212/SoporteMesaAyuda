import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useAuthContext } from '../contexts/AuthContext'
import rolesData from '../app/Mocks/roles.json'

interface RolRaw { Id: number; Nombre: string }
const roles = rolesData as RolRaw[]

interface MiPerfilDialogProps {
  open: boolean
  onClose: () => void
}

export function MiPerfilDialog({ open, onClose }: MiPerfilDialogProps) {
  const { user } = useAuthContext()

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
              Mi Perfil
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              {user?.nombre ?? 'Usuario'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Nombre completo"
            fullWidth
            value={user?.nombre ?? ''}
            disabled
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            label="Correo electrónico"
            fullWidth
            value={user?.correo ?? ''}
            disabled
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <FormControl
            fullWidth
            disabled
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            <InputLabel>Rol</InputLabel>
            <Select value={user?.rolId ?? ''} label="Rol">
              {roles.map(rol => (
                <MenuItem key={rol.Id} value={rol.Id}>
                  {rol.Nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cerrar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

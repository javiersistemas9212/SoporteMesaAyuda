import { ThemeProvider } from '@mui/material/styles'
import { AppRoutes } from '../routes/AppRoutes'
import { AuthProvider } from '../contexts/AuthContext'
import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

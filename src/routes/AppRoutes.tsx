import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { JiraTicketsPage } from '../features/tickets/jira/pages/JiraTicketsPage'
import { TicketsUsuarioPage } from '../features/tickets/usuario/pages/TicketsUsuarioPage'
import { HealthyModulosPage } from '../features/healthy/modulos/pages/HealthyModulosPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { AgentesPage } from '../features/seguridad/agentes/pages/AgentesPage'
import { TicketAdminPage } from '../features/tickets/admin/pages/TicketAdminPage'
import { useAuthContext } from '../contexts/AuthContext'

function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tickets/jira" element={<JiraTicketsPage />} />
          <Route path="/tickets/usuario" element={<TicketsUsuarioPage />} />
          <Route path="/configuracion/clientes" element={<div>Clientes</div>} />
          <Route path="/configuracion/calendarios" element={<div>Calendarios</div>} />
          <Route path="/administracion/tickets" element={<TicketAdminPage />} />
          <Route path="/informes/ver" element={<div>Ver Informes</div>} />
          <Route path="/healthy/apis" element={<div>APIs</div>} />
          <Route path="/healthy/logs" element={<div>Logs</div>} />
          <Route path="/healthy/modulos" element={<HealthyModulosPage />} />
          <Route path="/seguridad/agentes" element={<AgentesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

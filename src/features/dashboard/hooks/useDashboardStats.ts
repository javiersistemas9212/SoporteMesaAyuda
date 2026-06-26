import type {
  StatCard,
  TicketsByStatus,
  TicketsOverTime,
  AgentPerformance,
} from '../types/dashboard.types'

export function useDashboardStats() {
  const statCards: StatCard[] = [
    { title: 'Tickets Abiertos', value: 142, change: +12, color: 'primary' },
    { title: 'Resueltos Hoy', value: 38, change: +5, color: 'success' },
    { title: 'En Espera', value: 27, change: -3, color: 'warning' },
    { title: 'Críticos', value: 6, change: +2, color: 'error' },
  ]

  const ticketsByStatus: TicketsByStatus[] = [
    { status: 'Abierto', count: 142 },
    { status: 'En Progreso', count: 58 },
    { status: 'En Espera', count: 27 },
    { status: 'Resuelto', count: 213 },
    { status: 'Cerrado', count: 189 },
  ]

  const ticketsOverTime: TicketsOverTime[] = [
    { date: 'Lun', abiertos: 28, resueltos: 22 },
    { date: 'Mar', abiertos: 35, resueltos: 30 },
    { date: 'Mié', abiertos: 42, resueltos: 38 },
    { date: 'Jue', abiertos: 31, resueltos: 40 },
    { date: 'Vie', abiertos: 24, resueltos: 35 },
    { date: 'Sáb', abiertos: 12, resueltos: 18 },
    { date: 'Dom', abiertos: 8, resueltos: 10 },
  ]

  const agentPerformance: AgentPerformance[] = [
    { agent: 'Ana G.', resueltos: 48, promedio: 1.8 },
    { agent: 'Carlos M.', resueltos: 42, promedio: 2.1 },
    { agent: 'Laura R.', resueltos: 39, promedio: 2.4 },
    { agent: 'Pedro S.', resueltos: 35, promedio: 2.7 },
    { agent: 'María T.', resueltos: 31, promedio: 3.0 },
  ]

  return { statCards, ticketsByStatus, ticketsOverTime, agentPerformance }
}

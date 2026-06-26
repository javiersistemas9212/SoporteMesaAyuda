export interface StatCard {
  title: string
  value: number | string
  change: number
  unit?: string
  color: 'primary' | 'success' | 'warning' | 'error'
}

export interface TicketsByStatus {
  status: string
  count: number
}

export interface TicketsOverTime {
  date: string
  abiertos: number
  resueltos: number
}

export interface AgentPerformance {
  agent: string
  resueltos: number
  promedio: number
}

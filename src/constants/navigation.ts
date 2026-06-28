import {
  ConfirmationNumber,
  Settings,
  Assignment,
  BarChart,
  FavoriteOutlined,
  AdminPanelSettings,
} from '@mui/icons-material'
import type { SvgIconComponent } from '@mui/icons-material'

export interface NavSubItem {
  label: string
  path: string
}

export interface NavItem {
  id: string
  label: string
  Icon: SvgIconComponent
  children: NavSubItem[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'tickets',
    label: 'Tickets',
    Icon: ConfirmationNumber,
    children: [
      { label: 'Tickets Jira', path: '/tickets/jira' },
      { label: 'Tickets Usuario', path: '/tickets/usuario' },
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración y Maestros',
    Icon: Settings,
    children: [
      { label: 'Clientes', path: '/configuracion/clientes' },
      { label: 'Calendarios', path: '/configuracion/calendarios' },
    ],
  },
  {
    id: 'administracion',
    label: 'Administración de Tickets',
    Icon: Assignment,
    children: [
      { label: 'Administración de Tickets', path: '/administracion/tickets' },
    ],
  },
  {
    id: 'informes',
    label: 'Informes',
    Icon: BarChart,
    children: [
      { label: 'Ver Informes', path: '/informes/ver' },
    ],
  },
  {
    id: 'healthy',
    label: 'Healthy',
    Icon: FavoriteOutlined,
    children: [
      { label: 'APIs', path: '/healthy/apis' },
      { label: 'Logs', path: '/healthy/logs' },
      { label: 'Módulos', path: '/healthy/modulos' },
    ],
  },
  {
    id: 'seguridad',
    label: 'Seguridad',
    Icon: AdminPanelSettings,
    children: [
      { label: 'Agentes', path: '/seguridad/agentes' },
    ],
  },
]

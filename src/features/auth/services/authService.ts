import agentesData from '../../../app/Mocks/agentes.json'
import rolesData from '../../../app/Mocks/roles.json'
import type { AgenteRaw, RolRaw, AuthUser, LoginCredentials } from '../types/auth.types'

const agentes = agentesData as AgenteRaw[]
const roles = rolesData as RolRaw[]

export function authenticate(credentials: LoginCredentials): AuthUser | null {
  const agente = agentes.find(
    a => a.Correo === credentials.correo && a.Contrasena === credentials.contrasena
  )
  if (!agente) return null

  const rol = roles.find(r => r.Id === agente.RolId)
  return {
    id: agente.Id,
    nombre: agente.Nombre,
    correo: agente.Correo,
    rolId: agente.RolId,
    rol: rol?.Nombre ?? 'Sin Rol',
  }
}

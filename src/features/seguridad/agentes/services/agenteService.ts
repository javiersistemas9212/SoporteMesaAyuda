import agentesMock from '../../../../app/Mocks/agentes.json'
import rolesMock from '../../../../app/Mocks/roles.json'
import type { Agente, CreateAgenteRequest, UpdateAgenteRequest } from '../types/agente.types'

interface AgenteRaw { Id: number; Nombre: string; Correo: string; Contrasena: string; RolId: number }
interface RolRaw { Id: number; Nombre: string }

const rolesData = rolesMock as RolRaw[]
let store: AgenteRaw[] = [...(agentesMock as AgenteRaw[])]
let nextId = Math.max(...store.map(a => a.Id)) + 1

function toAgente(raw: AgenteRaw): Agente {
  const rol = rolesData.find(r => r.Id === raw.RolId)
  return { ...raw, Rol: rol?.Nombre ?? 'Sin Rol' }
}

export const agenteService = {
  getAll: (): Promise<Agente[]> =>
    Promise.resolve(store.map(toAgente)),

  create: (data: CreateAgenteRequest): Promise<Agente> => {
    const raw: AgenteRaw = { Id: nextId++, ...data }
    store = [...store, raw]
    return Promise.resolve(toAgente(raw))
  },

  update: (id: number, data: UpdateAgenteRequest): Promise<Agente> => {
    const idx = store.findIndex(a => a.Id === id)
    if (idx === -1) return Promise.reject(new Error('Agente no encontrado'))
    store[idx] = { ...store[idx], ...data }
    store = [...store]
    return Promise.resolve(toAgente(store[idx]))
  },

  delete: (id: number): Promise<void> => {
    store = store.filter(a => a.Id !== id)
    return Promise.resolve()
  },
}

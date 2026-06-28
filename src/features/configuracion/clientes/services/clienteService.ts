import clientesMock from '../../../../app/Mocks/clientes.json'
import type { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../types/cliente.types'

let store: Cliente[] = [...(clientesMock as Cliente[])]
let nextId = Math.max(...store.map(c => c.Id)) + 1

export const clienteService = {
  getAll: (): Promise<Cliente[]> => Promise.resolve([...store]),

  create: (data: CreateClienteRequest): Promise<Cliente> => {
    const cliente: Cliente = { Id: nextId++, ...data }
    store = [...store, cliente]
    return Promise.resolve(cliente)
  },

  update: (id: number, data: UpdateClienteRequest): Promise<Cliente> => {
    const idx = store.findIndex(c => c.Id === id)
    if (idx === -1) return Promise.reject(new Error('Cliente no encontrado'))
    store[idx] = { ...store[idx], ...data }
    store = [...store]
    return Promise.resolve(store[idx])
  },

  delete: (id: number): Promise<void> => {
    store = store.filter(c => c.Id !== id)
    return Promise.resolve()
  },
}

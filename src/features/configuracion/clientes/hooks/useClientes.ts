import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clienteService } from '../services/clienteService'
import type { CreateClienteRequest, UpdateClienteRequest } from '../types/cliente.types'

const QUERY_KEY = ['clientes']

export function useClientes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: clienteService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateClienteRequest) => clienteService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClienteRequest }) =>
      clienteService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clienteService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  return { query, createMutation, updateMutation, deleteMutation }
}

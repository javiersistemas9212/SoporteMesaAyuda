import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agenteService } from '../services/agenteService'
import type { CreateAgenteRequest, UpdateAgenteRequest } from '../types/agente.types'

const QUERY_KEY = ['agentes']

export function useAgentes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: agenteService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateAgenteRequest) => agenteService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAgenteRequest }) =>
      agenteService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => agenteService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  return { query, createMutation, updateMutation, deleteMutation }
}

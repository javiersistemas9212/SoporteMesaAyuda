import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Skeleton,
  Alert,
} from '@mui/material'
import { Add, PersonAdd, WarningAmber } from '@mui/icons-material'
import { useAgentes } from '../hooks/useAgentes'
import { AgentesGrid } from '../components/AgentesGrid'
import { AgenteFormDialog } from '../components/AgenteFormDialog'
import type { Agente } from '../types/agente.types'

export function AgentesPage() {
  const { query, createMutation, updateMutation, deleteMutation } = useAgentes()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Agente | null>(null)

  const openCreate = () => {
    setSelectedAgente(null)
    setFormOpen(true)
  }

  const openEdit = (agente: Agente) => {
    setSelectedAgente(agente)
    setFormOpen(true)
  }

  const handleFormSubmit = async (
    values: { Nombre: string; Correo: string; Contrasena: string; RolId: number },
    isEdit: boolean,
  ) => {
    if (isEdit && selectedAgente) {
      const updateData = values.Contrasena
        ? values
        : { Nombre: values.Nombre, Correo: values.Correo, RolId: values.RolId }
      await updateMutation.mutateAsync({ id: selectedAgente.Id, data: updateData })
    } else {
      await createMutation.mutateAsync(values)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.Id)
    setDeleteTarget(null)
  }

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #122440, #41819b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonAdd sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#122440' }}>
              Agentes
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Gestiona los agentes del equipo de soporte y sus permisos de acceso
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreate}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            px: 3,
            py: 1.2,
            background: 'linear-gradient(135deg, #122440 0%, #41819b 100%)',
            boxShadow: '0 4px 14px rgba(18,36,64,0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1a3a60 0%, #4e9ab8 100%)',
              boxShadow: '0 6px 18px rgba(18,36,64,0.4)',
            },
          }}
        >
          Nuevo Agente
        </Button>
      </Box>

      {/* Stats row */}
      {query.data && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Agentes', value: query.data.length, color: '#122440' },
            { label: 'Administradores', value: query.data.filter(a => a.Rol === 'Administrador').length, color: '#0288d1' },
            { label: 'Agentes', value: query.data.filter(a => a.Rol === 'Agente').length, color: '#2e7d32' },
            { label: 'Supervisores', value: query.data.filter(a => a.Rol === 'Supervisor').length, color: '#f57f17' },
          ].map(stat => (
            <Box
              key={stat.label}
              sx={{
                bgcolor: 'white',
                borderRadius: 2.5,
                px: 2.5,
                py: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 130,
                boxShadow: '0 2px 8px rgba(18,36,64,0.06)',
              }}
            >
              <Typography variant="h5" fontWeight={800} sx={{ color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Error */}
      {query.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Error al cargar los agentes. Intenta de nuevo.
        </Alert>
      )}

      {/* Loading skeleton */}
      {query.isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      )}

      {/* Grid */}
      {query.data && (
        <AgentesGrid
          data={query.data}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Create / Edit dialog */}
      <AgenteFormDialog
        key={selectedAgente?.Id ?? 'new'}
        open={formOpen}
        agente={selectedAgente}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WarningAmber sx={{ color: 'error.main', fontSize: 28 }} />
            <Typography fontWeight={700}>Eliminar agente</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Estás seguro de que deseas eliminar a{' '}
            <strong>{deleteTarget?.Nombre}</strong>? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteTarget(null)}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

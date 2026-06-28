import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Typography,
} from '@mui/material'
import { Add, Business, WarningAmber } from '@mui/icons-material'
import { useClientes } from '../hooks/useClientes'
import { ClientesGrid } from '../components/ClientesGrid'
import { ClienteFormDialog } from '../components/ClienteFormDialog'
import type { Cliente } from '../types/cliente.types'
import type { ClienteFormValues } from '../schemas/cliente.schema'

export function ClientesPage() {
  const { query, createMutation, updateMutation, deleteMutation } = useClientes()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null)

  const openCreate = () => {
    setSelectedCliente(null)
    setFormOpen(true)
  }

  const openEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setFormOpen(true)
  }

  const handleFormSubmit = async (values: ClienteFormValues, isEdit: boolean) => {
    if (isEdit && selectedCliente) {
      await updateMutation.mutateAsync({ id: selectedCliente.Id, data: values })
    } else {
      await createMutation.mutateAsync(values)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.Id)
    setDeleteTarget(null)
  }

  const saasCount = query.data?.filter(c => c.TipoCliente === 'SaaS').length ?? 0
  const onPremCount = query.data?.filter(c => c.TipoCliente === 'On-premise').length ?? 0
  const totalCreditos = query.data?.reduce((sum, c) => sum + c.Creditos, 0) ?? 0

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
              <Business sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#122440' }}>
              Clientes Corporativos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Gestiona los clientes corporativos y sus configuraciones
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
          Nuevo Cliente
        </Button>
      </Box>

      {/* Stats row */}
      {query.data && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Clientes', value: query.data.length, color: '#122440' },
            { label: 'SaaS', value: saasCount, color: '#0288d1' },
            { label: 'On-premise', value: onPremCount, color: '#7b1fa2' },
            { label: 'Total Créditos', value: totalCreditos.toLocaleString('es-CO'), color: '#2e7d32' },
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
          Error al cargar los clientes. Intenta de nuevo.
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
        <ClientesGrid
          data={query.data}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Create / Edit dialog */}
      <ClienteFormDialog
        key={selectedCliente?.Id ?? 'new'}
        open={formOpen}
        cliente={selectedCliente}
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
            <Typography fontWeight={700}>Eliminar cliente</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Estás seguro de que deseas eliminar a{' '}
            <strong>{deleteTarget?.NombreLargo}</strong>? Esta acción no se puede deshacer.
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

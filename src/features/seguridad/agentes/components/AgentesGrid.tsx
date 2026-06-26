import { useMemo, useState } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Delete,
  Edit,
  FilterList,
  PersonOutline,
} from '@mui/icons-material'
import { ColumnFilter } from '../../../../components/ui/ColumnFilter'
import type { Agente } from '../types/agente.types'

type SortField = 'Nombre' | 'Correo' | 'Rol'
type SortOrder = 'asc' | 'desc'
type FilterField = 'Rol'

const ROL_COLORS: Record<string, { bg: string; color: string }> = {
  Administrador: { bg: '#e8f4fd', color: '#0288d1' },
  Agente: { bg: '#e8f5e9', color: '#2e7d32' },
  Supervisor: { bg: '#fff8e1', color: '#f57f17' },
}

interface AgentesGridProps {
  data: Agente[]
  onEdit: (agente: Agente) => void
  onDelete: (agente: Agente) => void
}

export function AgentesGrid({ data, onEdit, onDelete }: AgentesGridProps) {
  const [sortField, setSortField] = useState<SortField>('Nombre')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterAnchors, setFilterAnchors] = useState<Partial<Record<FilterField, HTMLElement | null>>>({})
  const [filters, setFilters] = useState<Partial<Record<FilterField, Set<string>>>>({})

  const roles = useMemo(() => [...new Set(data.map(a => a.Rol))].sort(), [data])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setPage(0)
  }

  const openFilter = (field: FilterField, el: HTMLElement) =>
    setFilterAnchors(prev => ({ ...prev, [field]: el }))

  const closeFilter = (field: FilterField) =>
    setFilterAnchors(prev => ({ ...prev, [field]: null }))

  const setFilter = (field: FilterField, val: Set<string>) => {
    setFilters(prev => ({ ...prev, [field]: val }))
    setPage(0)
  }

  const filtered = useMemo(() => {
    let rows = [...data]
    const rolFilter = filters.Rol
    if (rolFilter && rolFilter.size > 0) rows = rows.filter(r => rolFilter.has(r.Rol))
    rows.sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      return sortOrder === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return rows
  }, [data, filters, sortField, sortOrder])

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const activeFilters = Object.values(filters).filter(s => s && s.size > 0).length

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 12px rgba(18,36,64,0.07)',
      }}
    >
      {/* Table header bar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fafbfc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PersonOutline sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#122440' }}>
            Listado de Agentes
          </Typography>
          <Chip
            label={filtered.length}
            size="small"
            sx={{ bgcolor: '#122440', color: 'white', fontWeight: 700, height: 20, fontSize: '0.7rem' }}
          />
        </Box>
        {activeFilters > 0 && (
          <Chip
            label={`${activeFilters} filtro${activeFilters > 1 ? 's' : ''} activo${activeFilters > 1 ? 's' : ''}`}
            size="small"
            onDelete={() => setFilters({})}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '0.72rem' }}
          />
        )}
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f7fa' }}>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#122440', width: 110 }}>
                Acciones
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#122440', width: 60 }}>#</TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#122440' }}>
                <TableSortLabel
                  active={sortField === 'Nombre'}
                  direction={sortField === 'Nombre' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Nombre')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#122440' }}>
                <TableSortLabel
                  active={sortField === 'Correo'}
                  direction={sortField === 'Correo' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Correo')}
                >
                  Correo
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#122440' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TableSortLabel
                    active={sortField === 'Rol'}
                    direction={sortField === 'Rol' ? sortOrder : 'asc'}
                    onClick={() => handleSort('Rol')}
                  >
                    Rol
                  </TableSortLabel>
                  <Tooltip title="Filtrar por rol">
                    <IconButton
                      size="small"
                      onClick={e => openFilter('Rol', e.currentTarget)}
                      sx={{
                        p: 0.25,
                        color: (filters.Rol?.size ?? 0) > 0 ? 'primary.main' : 'text.disabled',
                      }}
                    >
                      <FilterList sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }} >
                  <PersonOutline sx={{ fontSize: 48, color: 'text.disabled', mb: 1, display: 'block', mx: 'auto' }} />
                  <Typography color="text.secondary" variant="body2">
                    No se encontraron agentes
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((agente, idx) => {
                const rolStyle = ROL_COLORS[agente.Rol] ?? { bg: '#f3f4f6', color: '#6b7280' }
                return (
                  <TableRow
                    key={agente.Id}
                    hover
                    sx={{
                      '&:last-child td': { border: 0 },
                      '&:hover': { bgcolor: '#f8faff' },
                      transition: 'background 0.15s',
                    }}
                  >
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(agente)}
                            sx={{
                              color: '#41819b',
                              '&:hover': { bgcolor: '#e8f4fd', color: '#0288d1' },
                            }}
                          >
                            <Edit sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(agente)}
                            sx={{
                              color: 'error.main',
                              '&:hover': { bgcolor: '#fdecea' },
                            }}
                          >
                            <Delete sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                        {page * rowsPerPage + idx + 1}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #122440, #41819b)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                            {agente.Nombre.charAt(0).toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#122440' }}>
                          {agente.Nombre}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {agente.Correo}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={agente.Rol}
                        size="small"
                        sx={{
                          bgcolor: rolStyle.bg,
                          color: rolStyle.color,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          height: 22,
                          border: `1px solid ${rolStyle.color}22`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
      />

      <ColumnFilter
        anchorEl={filterAnchors.Rol ?? null}
        onClose={() => closeFilter('Rol')}
        label="Rol"
        options={roles}
        selected={filters.Rol ?? new Set()}
        onChange={val => setFilter('Rol', val)}
      />
    </Paper>
  )
}

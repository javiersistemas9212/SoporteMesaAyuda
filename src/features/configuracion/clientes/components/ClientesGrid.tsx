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
import { Business, Delete, Edit } from '@mui/icons-material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { ColumnFilter } from '../../../../components/ui/ColumnFilter'
import type { Cliente } from '../types/cliente.types'

type SortField = 'NombreLargo' | 'Nit' | 'TipoCliente'
type SortOrder = 'asc' | 'desc'
type FilterField = 'NombreLargo' | 'Nit' | 'TipoCliente'

const TIPO_COLORS: Record<string, { bg: string; color: string }> = {
  SaaS: { bg: '#e8f4fd', color: '#0288d1' },
  'On-premise': { bg: '#f3e5f5', color: '#7b1fa2' },
}

const FILTER_LABELS: Record<FilterField, string> = {
  NombreLargo: 'Nombre Largo',
  Nit: 'NIT',
  TipoCliente: 'Tipo de Cliente',
}

interface ClientesGridProps {
  data: Cliente[]
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}

export function ClientesGrid({ data, onEdit, onDelete }: ClientesGridProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState<SortField>('NombreLargo')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [filters, setFilters] = useState<Partial<Record<FilterField, Set<string>>>>({})
  const [filterAnchor, setFilterAnchor] = useState<{ field: FilterField; el: HTMLElement } | null>(null)

  const filterOptions = useMemo<Record<FilterField, string[]>>(
    () => ({
      NombreLargo: Array.from(new Set(data.map(r => r.NombreLargo))).sort(),
      Nit: Array.from(new Set(data.map(r => r.Nit))).sort(),
      TipoCliente: Array.from(new Set(data.map(r => r.TipoCliente))).sort(),
    }),
    [data],
  )

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setPage(0)
  }

  const handleFilterChange = (field: FilterField, next: Set<string>) => {
    setFilters(prev => ({ ...prev, [field]: next }))
    setPage(0)
  }

  const isFilterActive = (field: FilterField) => (filters[field]?.size ?? 0) > 0

  const processedData = useMemo(() => {
    const filtered = data.filter(row =>
      (Object.entries(filters) as [FilterField, Set<string>][]).every(
        ([field, selected]) => selected.size === 0 || selected.has(row[field]),
      ),
    )
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortField]).localeCompare(String(b[sortField]))
      return sortOrder === 'asc' ? cmp : -cmp
    })
  }, [data, filters, sortField, sortOrder])

  const paginated = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const activeFilters = Object.values(filters).filter(s => s && s.size > 0).length

  return (
    <>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Primary-color header bar */}
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Business sx={{ color: 'white', fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
              Clientes Corporativos — {processedData.length} de {data.length} registros
            </Typography>
          </Box>
          {activeFilters > 0 && (
            <Chip
              label={`${activeFilters} filtro${activeFilters > 1 ? 's' : ''} activo${activeFilters > 1 ? 's' : ''}`}
              size="small"
              onDelete={() => setFilters({})}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50', width: 110 }}>
                  Acciones
                </TableCell>

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', width: 60 }}>#</TableCell>

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', whiteSpace: 'nowrap', pr: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TableSortLabel
                      active={sortField === 'NombreLargo'}
                      direction={sortField === 'NombreLargo' ? sortOrder : 'asc'}
                      onClick={() => handleSort('NombreLargo')}
                    >
                      Nombre Largo
                    </TableSortLabel>
                    <IconButton
                      size="small"
                      onClick={e => setFilterAnchor({ field: 'NombreLargo', el: e.currentTarget })}
                      sx={{ ml: 0.25, p: 0.25, color: isFilterActive('NombreLargo') ? 'primary.main' : 'text.disabled', '&:hover': { color: 'primary.main' } }}
                    >
                      <FilterListIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                </TableCell>

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', whiteSpace: 'nowrap', pr: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TableSortLabel
                      active={sortField === 'Nit'}
                      direction={sortField === 'Nit' ? sortOrder : 'asc'}
                      onClick={() => handleSort('Nit')}
                    >
                      NIT
                    </TableSortLabel>
                    <IconButton
                      size="small"
                      onClick={e => setFilterAnchor({ field: 'Nit', el: e.currentTarget })}
                      sx={{ ml: 0.25, p: 0.25, color: isFilterActive('Nit') ? 'primary.main' : 'text.disabled', '&:hover': { color: 'primary.main' } }}
                    >
                      <FilterListIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                </TableCell>

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', whiteSpace: 'nowrap', pr: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TableSortLabel
                      active={sortField === 'TipoCliente'}
                      direction={sortField === 'TipoCliente' ? sortOrder : 'asc'}
                      onClick={() => handleSort('TipoCliente')}
                    >
                      Tipo de Cliente
                    </TableSortLabel>
                    <IconButton
                      size="small"
                      onClick={e => setFilterAnchor({ field: 'TipoCliente', el: e.currentTarget })}
                      sx={{ ml: 0.25, p: 0.25, color: isFilterActive('TipoCliente') ? 'primary.main' : 'text.disabled', '&:hover': { color: 'primary.main' } }}
                    >
                      <FilterListIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Business sx={{ fontSize: 48, color: 'text.disabled', mb: 1, display: 'block', mx: 'auto' }} />
                    <Typography variant="body2" color="text.disabled">
                      No hay clientes que coincidan con los filtros aplicados.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((cliente, idx) => {
                  const tipoStyle = TIPO_COLORS[cliente.TipoCliente] ?? { bg: '#f3f4f6', color: '#6b7280' }
                  return (
                    <TableRow
                      key={cliente.Id}
                      sx={{
                        bgcolor: idx % 2 === 0 ? 'background.paper' : 'grey.50',
                        '&:hover': { bgcolor: 'primary.50' },
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(cliente)}
                              sx={{ color: '#41819b', '&:hover': { bgcolor: '#e8f4fd', color: '#0288d1' } }}
                            >
                              <Edit sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => onDelete(cliente)}
                              sx={{ color: 'error.main', '&:hover': { bgcolor: '#fdecea' } }}
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
                              width: 10,
                              height: 32,
                              borderRadius: 1,
                              bgcolor: cliente.ColorInstitucional,
                              flexShrink: 0,
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: '#122440' }}>
                              {cliente.NombreLargo}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                              {cliente.NombreCorto}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                          {cliente.Nit}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={cliente.TipoCliente}
                          size="small"
                          sx={{
                            bgcolor: tipoStyle.bg,
                            color: tipoStyle.color,
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            height: 22,
                            border: `1px solid ${tipoStyle.color}22`,
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
          count={processedData.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />

        {filterAnchor && (
          <ColumnFilter
            anchorEl={filterAnchor.el}
            onClose={() => setFilterAnchor(null)}
            label={FILTER_LABELS[filterAnchor.field]}
            options={filterOptions[filterAnchor.field]}
            selected={filters[filterAnchor.field] ?? new Set()}
            onChange={next => handleFilterChange(filterAnchor.field, next)}
          />
        )}
      </Paper>
    </>
  )
}

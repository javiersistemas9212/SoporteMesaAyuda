import { useMemo, useState } from 'react';
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
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ColumnFilter } from '../../../../components/ui/ColumnFilter';
import { TicketDetailDialog } from './TicketDetailDialog';
import type { TicketUsuario } from '../types/ticketUsuario.types';

interface Props {
  data: TicketUsuario[];
  agente: string;
}

type SortField = 'IdTicket' | 'Tipo' | 'Estado' | 'Titulo';
type SortOrder = 'asc' | 'desc';
type FilterField = 'Tipo' | 'Estado';

const ESTADO_COLOR: Record<TicketUsuario['Estado'], 'warning' | 'info' | 'success' | 'secondary'> = {
  Abierto: 'warning',
  'En proceso': 'info',
  Cerrado: 'success',
  Pendiente: 'secondary',
};

const TIPO_COLOR: Record<TicketUsuario['Tipo'], 'primary' | 'info'> = {
  Funcional: 'primary',
  Técnico: 'info',
};

export function UsuarioGrid({ data, agente }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('IdTicket');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filters, setFilters] = useState<Partial<Record<FilterField, Set<string>>>>({});
  const [filterAnchor, setFilterAnchor] = useState<{ field: FilterField; el: HTMLElement } | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketUsuario | null>(null);

  const filterOptions = useMemo<Record<FilterField, string[]>>(
    () => ({
      Tipo: Array.from(new Set(data.map(r => r.Tipo))).sort(),
      Estado: Array.from(new Set(data.map(r => r.Estado))).sort(),
    }),
    [data],
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(0);
  };

  const handleFilterChange = (field: FilterField, next: Set<string>) => {
    setFilters(prev => ({ ...prev, [field]: next }));
    setPage(0);
  };

  const isFilterActive = (field: FilterField) => (filters[field]?.size ?? 0) > 0;

  const processedData = useMemo(() => {
    const filtered = data.filter(row =>
      (Object.entries(filters) as [FilterField, Set<string>][]).every(
        ([field, selected]) => selected.size === 0 || selected.has(row[field]),
      ),
    );
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [data, filters, sortField, sortOrder]);

  const paginated = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const activeFilters = Object.values(filters).filter(s => s && s.size > 0).length;

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortOrder : 'asc'}
      onClick={() => handleSort(field)}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            px: 3, py: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
            Tickets de {agente} — {processedData.length} de {data.length} registros
          </Typography>
          {activeFilters > 0 && (
            <Chip
              label={`${activeFilters} filtro${activeFilters > 1 ? 's' : ''} activo${activeFilters > 1 ? 's' : ''}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', width: 56 }} />

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', whiteSpace: 'nowrap' }}>
                  <SortableHeader field="IdTicket" label="ID Ticket" />
                </TableCell>

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', whiteSpace: 'nowrap', pr: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SortableHeader field="Tipo" label="Tipo" />
                    <IconButton
                      size="small"
                      onClick={e => setFilterAnchor({ field: 'Tipo', el: e.currentTarget })}
                      sx={{
                        ml: 0.25, p: 0.25,
                        color: isFilterActive('Tipo') ? 'primary.main' : 'text.disabled',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                </TableCell>

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', whiteSpace: 'nowrap', pr: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SortableHeader field="Estado" label="Estado" />
                    <IconButton
                      size="small"
                      onClick={e => setFilterAnchor({ field: 'Estado', el: e.currentTarget })}
                      sx={{
                        ml: 0.25, p: 0.25,
                        color: isFilterActive('Estado') ? 'primary.main' : 'text.disabled',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                </TableCell>

                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>
                  <SortableHeader field="Titulo" label="Título" />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((row, idx) => (
                <TableRow
                  key={row.IdTicket}
                  sx={{
                    bgcolor: idx % 2 === 0 ? 'background.paper' : 'grey.50',
                    '&:hover': { bgcolor: 'primary.50' },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell>
                    <Tooltip title="Ver detalle" arrow>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedTicket(row)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'primary.100' },
                        }}
                      >
                        <SearchOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}
                    >
                      {row.IdTicket}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.Tipo}
                      color={TIPO_COLOR[row.Tipo]}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.Estado}
                      color={ESTADO_COLOR[row.Estado]}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{row.Titulo}</Typography>
                  </TableCell>
                </TableRow>
              ))}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body2" color="text.disabled">
                      No hay registros que coincidan con los filtros aplicados.
                    </Typography>
                  </TableCell>
                </TableRow>
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
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />

        {filterAnchor && (
          <ColumnFilter
            anchorEl={filterAnchor.el}
            onClose={() => setFilterAnchor(null)}
            label={filterAnchor.field}
            options={filterOptions[filterAnchor.field]}
            selected={filters[filterAnchor.field] ?? new Set()}
            onChange={next => handleFilterChange(filterAnchor.field, next)}
          />
        )}
      </Paper>

      <TicketDetailDialog
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}

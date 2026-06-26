import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ColumnFilter } from '../../../../components/ui/ColumnFilter';
import type { JiraTicket } from '../types/jira.types';

interface JiraGridProps {
  data: JiraTicket[];
}

type SortField = keyof Pick<JiraTicket, 'IdTicket' | 'AsignadoA' | 'Estado' | 'Prioridad'>;
type SortOrder = 'asc' | 'desc';
type FilterField = 'AsignadoA' | 'Estado' | 'Prioridad';

const ESTADO_COLORS: Record<JiraTicket['Estado'], 'warning' | 'info' | 'success' | 'secondary'> = {
  Abierto: 'warning',
  'En proceso': 'info',
  Cerrado: 'success',
  Pendiente: 'secondary',
};

const PRIORIDAD_COLORS: Record<JiraTicket['Prioridad'], 'error' | 'warning' | 'success'> = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'success',
};

const COLUMNS: { id: SortField; label: string; filterable?: boolean }[] = [
  { id: 'IdTicket', label: 'ID Ticket' },
  { id: 'AsignadoA', label: 'Asignado A', filterable: true },
  { id: 'Estado', label: 'Estado', filterable: true },
  { id: 'Prioridad', label: 'Prioridad', filterable: true },
];

export function JiraGrid({ data }: JiraGridProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('IdTicket');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Partial<Record<FilterField, Set<string>>>>({});
  const [filterAnchor, setFilterAnchor] = useState<{ field: FilterField; el: HTMLElement } | null>(null);

  const filterOptions = useMemo<Record<FilterField, string[]>>(
    () => ({
      AsignadoA: Array.from(new Set(data.map(r => r.AsignadoA))).sort(),
      Estado: Array.from(new Set(data.map(r => r.Estado))).sort(),
      Prioridad: Array.from(new Set(data.map(r => r.Prioridad))).sort(),
    }),
    [data]
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

  const toggleValidations = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isFilterActive = (field: FilterField) =>
    (filters[field]?.size ?? 0) > 0;

  const processedData = useMemo(() => {
    const filtered = data.filter(row =>
      (Object.entries(filters) as [FilterField, Set<string>][]).every(
        ([field, selected]) => selected.size === 0 || selected.has(row[field])
      )
    );
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [data, filters, sortField, sortOrder]);

  const paginated = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const activeFilterCount = Object.values(filters).filter(s => s && s.size > 0).length;

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          px: 3, py: 2, bgcolor: 'primary.main',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
          Tickets cargados desde Jira — {processedData.length} de {data.length} registros
        </Typography>
        {activeFilterCount > 0 && (
          <Chip
            label={`${activeFilterCount} filtro${activeFilterCount > 1 ? 's' : ''} activo${activeFilterCount > 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: '0.7rem' }}
          />
        )}
      </Box>

      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map(col => (
                <TableCell
                  key={col.id}
                  sortDirection={sortField === col.id ? sortOrder : false}
                  sx={{ fontWeight: 700, bgcolor: 'grey.50', whiteSpace: 'nowrap', pr: 0.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TableSortLabel
                      active={sortField === col.id}
                      direction={sortField === col.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>

                    {col.filterable && (
                      <IconButton
                        size="small"
                        onClick={e =>
                          setFilterAnchor({ field: col.id as FilterField, el: e.currentTarget })
                        }
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isFilterActive(col.id as FilterField)
                            ? 'primary.main'
                            : 'text.disabled',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        <FilterListIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}

              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>
                Validaciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((row, idx) => {
              const isExpanded = expandedRows.has(row.IdTicket);
              const hasIssues = row.Validaciones.length > 0;

              return (
                <TableRow
                  key={row.IdTicket}
                  sx={{
                    bgcolor: idx % 2 === 0 ? 'background.paper' : 'grey.50',
                    '&:hover': { bgcolor: 'primary.50' },
                    transition: 'background-color 0.15s ease',
                    verticalAlign: 'top',
                  }}
                >
                  <TableCell sx={{ pt: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}
                    >
                      {row.IdTicket}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ pt: 1.5 }}>
                    <Typography variant="body2">{row.AsignadoA}</Typography>
                  </TableCell>

                  <TableCell sx={{ pt: 1.5 }}>
                    <Chip
                      label={row.Estado}
                      color={ESTADO_COLORS[row.Estado]}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </TableCell>

                  <TableCell sx={{ pt: 1.5 }}>
                    <Chip
                      label={row.Prioridad}
                      color={PRIORIDAD_COLORS[row.Prioridad]}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </TableCell>

                  <TableCell>
                    {!hasIssues ? (
                      <Box sx={{ pt: 1 }}>
                        <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      </Box>
                    ) : isExpanded ? (
                      <Box sx={{ py: 0.5 }}>
                        {row.Validaciones.map((v, i) => (
                          <Typography
                            key={i}
                            variant="caption"
                            onClick={() => toggleValidations(row.IdTicket)}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 0.5,
                              color: 'warning.dark',
                              lineHeight: 1.6,
                              cursor: 'pointer',
                            }}
                          >
                            <WarningAmberRoundedIcon
                              sx={{ fontSize: 14, mt: '2px', flexShrink: 0, color: 'warning.main' }}
                            />
                            {v}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Box
                        onClick={() => toggleValidations(row.IdTicket)}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          cursor: 'pointer',
                          pt: 1,
                          '&:hover .warn-icon': { color: 'warning.dark' },
                        }}
                      >
                        <WarningAmberRoundedIcon
                          className="warn-icon"
                          sx={{ color: 'warning.main', fontSize: 20, transition: 'color 0.2s' }}
                        />
                        <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700 }}>
                          {row.Validaciones.length}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

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
        onPageChange={(_, newPage) => setPage(newPage)}
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
          label={COLUMNS.find(c => c.id === filterAnchor.field)?.label ?? filterAnchor.field}
          options={filterOptions[filterAnchor.field]}
          selected={filters[filterAnchor.field] ?? new Set()}
          onChange={next => handleFilterChange(filterAnchor.field, next)}
        />
      )}
    </Paper>
  );
}

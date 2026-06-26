import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import * as XLSX from 'xlsx';

import { UsuarioStatCards } from '../components/UsuarioStatCards';
import { UsuarioGrid } from '../components/UsuarioGrid';
import {
  getAgentes,
  getTicketsByAgente,
  calcularEstadoCounts,
} from '../services/ticketUsuarioService';
import type { TicketUsuario, EstadoCounts } from '../types/ticketUsuario.types';

const AGENTES = getAgentes();

export function TicketsUsuarioPage() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [agenteSeleccionado, setAgenteSeleccionado] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [tickets, setTickets] = useState<TicketUsuario[]>([]);
  const [counts, setCounts] = useState<EstadoCounts | null>(null);
  const [agenteActivo, setAgenteActivo] = useState('');

  const handleCargar = () => {
    if (!agenteSeleccionado) {
      setError('Debe seleccionar un agente.');
      return;
    }
    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      setError('La fecha final no puede ser anterior a la fecha inicial.');
      return;
    }
    setError(null);

    const resultado = getTicketsByAgente(
      agenteSeleccionado,
      fechaInicio || undefined,
      fechaFin || undefined,
    );
    setTickets(resultado);
    setCounts(calcularEstadoCounts(resultado));
    setAgenteActivo(agenteSeleccionado);
  };

  const handleExport = () => {
    if (tickets.length === 0) return;

    const exportData = tickets.map(t => ({
      'ID Ticket': t.IdTicket,
      Tipo: t.Tipo,
      Estado: t.Estado,
      Título: t.Titulo,
      'Asignado A': t.AsignadoA,
      Prioridad: t.Prioridad,
      'Fecha Creación': t.FechaCreacion,
      Validaciones: t.Validaciones.join(' | ') || 'Sin validaciones',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 50 },
      { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 80 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets Usuario');
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `tickets_${agenteActivo}_${today}.xlsx`);
  };

  const loaded = counts !== null;

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Encabezado */}
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Tickets por Usuario
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Consulta y resumen de casos por agente de soporte
        </Typography>
      </Box>

      {/* ── ZONA 1: Filtros ── */}
      <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
          Parámetros de búsqueda
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Fecha inicial"
            type="date"
            size="small"
            value={fechaInicio}
            onChange={e => {
              setFechaInicio(e.target.value);
              setError(null);
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: fechaFin || undefined }}
            sx={{ width: 180 }}
          />

          <TextField
            label="Fecha final"
            type="date"
            size="small"
            value={fechaFin}
            onChange={e => {
              setFechaFin(e.target.value);
              setError(null);
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: fechaInicio || undefined }}
            sx={{ width: 180 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Agente</InputLabel>
            <Select
              label="Agente"
              value={agenteSeleccionado}
              onChange={e => {
                setAgenteSeleccionado(e.target.value);
                setError(null);
              }}
            >
              {AGENTES.map(a => (
                <MenuItem key={a.Id} value={a.Nombre}>
                  {a.Nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<CloudDownloadOutlinedIcon />}
              onClick={handleCargar}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Cargar
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleExport}
              disabled={!loaded || tickets.length === 0}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* ── ZONA 2: Tarjetas de resumen ── */}
      <Collapse in={loaded} unmountOnExit>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
            Resumen de {agenteActivo}
          </Typography>
          <UsuarioStatCards counts={counts!} />
        </Box>
      </Collapse>

      {/* ── ZONA 3: Grid de tickets ── */}
      <Collapse in={loaded} unmountOnExit>
        <Box>
          <Divider sx={{ mb: 3 }} />
          <UsuarioGrid data={tickets} agente={agenteActivo} />
        </Box>
      </Collapse>
    </Box>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import * as XLSX from 'xlsx';

import { JiraProgressStepper } from '../components/JiraProgressStepper';
import { JiraGrid } from '../components/JiraGrid';
import { getJiraTickets } from '../services/jiraService';
import type { JiraTicket } from '../types/jira.types';

const STEP_DURATION_MS = 10_000;

export function JiraTicketsPage() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);

  const [showProgress, setShowProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [tickets, setTickets] = useState<JiraTicket[]>([]);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleCargar = () => {
    if (!fechaInicio || !fechaFin) {
      setDateError('Debe seleccionar una fecha inicial y una fecha final.');
      return;
    }
    if (fechaFin < fechaInicio) {
      setDateError('La fecha final no puede ser anterior a la fecha inicial.');
      return;
    }
    setDateError(null);

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setShowProgress(true);
    setIsLoading(true);
    setCompletedSteps(0);
    setIsComplete(false);
    setTickets([]);

    timersRef.current = [
      setTimeout(() => setCompletedSteps(1), STEP_DURATION_MS),
      setTimeout(() => setCompletedSteps(2), STEP_DURATION_MS * 2),
      setTimeout(() => {
        setCompletedSteps(3);
        setIsComplete(true);
        setIsLoading(false);
        setTickets(getJiraTickets());
      }, STEP_DURATION_MS * 3),
    ];
  };

  const handleExport = () => {
    if (tickets.length === 0) return;

    const exportData = tickets.map(t => ({
      'ID Ticket': t.IdTicket,
      Título: t.Titulo,
      'Asignado A': t.AsignadoA,
      Estado: t.Estado,
      Prioridad: t.Prioridad,
      'Fecha Creación': t.FechaCreacion,
      Validaciones: t.Validaciones.join(' | ') || 'Sin validaciones',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 14 }, { wch: 45 }, { wch: 14 },
      { wch: 12 }, { wch: 10 }, { wch: 16 }, { wch: 80 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets Jira');
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `tickets_jira_${today}.xlsx`);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Tickets Jira
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Carga de tickets desde la API de Jira por rango de fechas
        </Typography>
      </Box>

      {/* ── ZONA 1: Filtros y acciones ── */}
      <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
          Rango de fechas
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Fecha inicial"
            type="date"
            size="small"
            value={fechaInicio}
            onChange={e => {
              setFechaInicio(e.target.value);
              setDateError(null);
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
              setDateError(null);
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: fechaInicio || undefined }}
            sx={{ width: 180 }}
          />

          <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<CloudDownloadOutlinedIcon />}
              onClick={handleCargar}
              disabled={isLoading}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Cargar
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleExport}
              disabled={!isComplete || tickets.length === 0}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        {dateError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {dateError}
          </Alert>
        )}
      </Paper>

      {/* ── ZONA 2: Barra de progreso ── */}
      <Collapse in={showProgress} unmountOnExit>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ px: 3, pt: 2.5, pb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
              {isComplete
                ? 'Carga completada exitosamente'
                : `Procesando — paso ${completedSteps + 1} de 3`}
            </Typography>
          </Box>
          <JiraProgressStepper completedSteps={completedSteps} isLoading={isLoading} />
        </Paper>
      </Collapse>

      {/* ── ZONA 3: Grid de resultados ── */}
      <Collapse in={isComplete && tickets.length > 0} unmountOnExit>
        <Box>
          <Divider sx={{ mb: 3 }} />
          <JiraGrid data={tickets} />
        </Box>
      </Collapse>
    </Box>
  );
}

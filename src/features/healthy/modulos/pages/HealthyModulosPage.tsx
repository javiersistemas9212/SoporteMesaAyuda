import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Typography,
} from '@mui/material';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import { HealthySummaryCards } from '../components/HealthySummaryCards';
import { HealthyModulosGrid } from '../components/HealthyModulosGrid';
import { HealthyCellDetailDialog } from '../components/HealthyCellDetailDialog';
import {
  fetchHealthyModulos,
  calculateSummary,
  formatDateTime,
} from '../services/healthyModulosService';
import type { ModuleCheckResult, HealthySummary } from '../types/healthyModulos.types';

export function HealthyModulosPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ModuleCheckResult[]>([]);
  const [summary, setSummary] = useState<HealthySummary | null>(null);
  const [lastExecution, setLastExecution] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<ModuleCheckResult | null>(null);

  const handleCargar = () => {
    setLoading(true);
    setTimeout(() => {
      const data = fetchHealthyModulos();
      setResults(data.results);
      setSummary(calculateSummary(data.results));
      setLastExecution(formatDateTime(data.lastExecution));
      setLoading(false);
    }, 900);
  };

  const loaded = summary !== null;

  return (
    <Box sx={{ mx: -3, px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header */}
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Healthy — Módulos
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Estado de los módulos de aplicación por cliente en tiempo real
        </Typography>
      </Box>

      {/* Main Content: Two-column layout */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>

        {/* ── Left Panel ── */}
        <Box sx={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={
              loading
                ? <CircularProgress size={18} color="inherit" />
                : <CloudSyncOutlinedIcon />
            }
            onClick={handleCargar}
            disabled={loading}
            sx={{ fontWeight: 700, py: 1.5, borderRadius: 2 }}
          >
            {loading ? 'Cargando...' : 'Cargar'}
          </Button>

          <Collapse in={loaded} unmountOnExit>
            {summary && lastExecution && (
              <HealthySummaryCards summary={summary} lastExecution={lastExecution} />
            )}
          </Collapse>
        </Box>

        {/* ── Right Panel: Grid ── */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {!loaded ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                height: 340,
                color: 'text.disabled',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <MonitorHeartOutlinedIcon sx={{ fontSize: 56, opacity: 0.3 }} />
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Presiona <strong>Cargar</strong> para ejecutar
                <br />
                las validaciones de los módulos
              </Typography>
            </Box>
          ) : (
            <HealthyModulosGrid results={results} onCellClick={setSelectedResult} />
          )}
        </Box>
      </Box>

      <HealthyCellDetailDialog
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </Box>
  );
}

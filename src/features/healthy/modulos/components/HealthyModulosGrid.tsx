import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import RadarIcon from '@mui/icons-material/Radar';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import type { SvgIconProps } from '@mui/material';
import type { ComponentType } from 'react';
import type { ModuleCheckResult, ModuleName, ModuleStatus } from '../types/healthyModulos.types';
import { CLIENTS, MODULES, getResultByClientModule } from '../services/healthyModulosService';

const MODULE_ICONS: Record<ModuleName, ComponentType<SvgIconProps>> = {
  'Activo': AccountBalanceOutlinedIcon,
  'Cierre pasivo': ArchiveOutlinedIcon,
  'Contabilidad': CalculateOutlinedIcon,
  'Gestión de ordenes': AssignmentOutlinedIcon,
  'Ordenes': ReceiptLongOutlinedIcon,
  'Riesgos': SecurityOutlinedIcon,
  'Senty': RadarIcon,
};

interface StatusConfig {
  bg: string;
  hoverBg: string;
  Icon: ComponentType<SvgIconProps>;
  label: string;
  tooltip: string;
}

const STATUS_CONFIG: Record<ModuleStatus, StatusConfig> = {
  OK: {
    bg: '#388e3c',
    hoverBg: '#2e7d32',
    Icon: CheckCircleOutlinedIcon,
    label: 'OK',
    tooltip: 'Operando correctamente — Clic para ver detalle',
  },
  OFF: {
    bg: '#1976d2',
    hoverBg: '#1565c0',
    Icon: PowerSettingsNewIcon,
    label: 'Apagado',
    tooltip: 'Fuera de horario — Clic para ver detalle',
  },
  ERROR: {
    bg: '#d32f2f',
    hoverBg: '#b71c1c',
    Icon: ErrorOutlineIcon,
    label: 'Error',
    tooltip: 'Error en el servicio — Clic para ver detalle',
  },
};

interface StatusCellProps {
  result: ModuleCheckResult | undefined;
  onClick: (result: ModuleCheckResult) => void;
}

function StatusCell({ result, onClick }: StatusCellProps) {
  if (!result) {
    return (
      <Box
        sx={{
          width: 120,
          height: 140,
          bgcolor: 'grey.200',
          borderRadius: 2,
          m: 'auto',
        }}
      />
    );
  }

  const cfg = STATUS_CONFIG[result.status];
  const Icon = cfg.Icon;

  return (
    <Tooltip title={cfg.tooltip} arrow placement="top">
      <Box
        onClick={() => onClick(result)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onClick(result)}
        sx={{
          bgcolor: cfg.bg,
          borderRadius: 2,
          px: 1,
          py: 1.5,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.4,
          width: '100%',
          height: 140,
          mx: '2px',
          transition: 'all 0.15s ease',
          outline: 'none',
          '&:hover, &:focus': {
            bgcolor: cfg.hoverBg,
            transform: 'scale(1.06)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          },
        }}
      >
        <Icon sx={{ fontSize: 42, color: '#ffffff', mb: 0.25 }} />
        <Typography
          variant="caption"
          sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', letterSpacing: 0.4 }}
        >
          {cfg.label}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.6rem', lineHeight: 1.4 }}>
          Versión: 20.0.1
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.6rem', lineHeight: 1.4 }}>
          Core: 20.0.0
        </Typography>
      </Box>
    </Tooltip>
  );
}

interface Props {
  results: ModuleCheckResult[];
  onCellClick: (result: ModuleCheckResult) => void;
}

export function HealthyModulosGrid({ results, onCellClick }: Props) {
  return (
    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                bgcolor: 'grey.50',
                fontWeight: 700,
                color: 'text.secondary',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                minWidth: 100,
                borderBottom: 2,
                borderColor: 'divider',
              }}
            >
              Módulo
            </TableCell>
            {CLIENTS.map(client => (
              <TableCell
                key={client}
                align="center"
                sx={{
                  bgcolor: 'grey.50',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: 'text.primary',
                  minWidth: 110,
                  borderBottom: 2,
                  borderColor: 'divider',
                }}
              >
                {client}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {MODULES.map((module, i) => {
            const ModuleIcon = MODULE_ICONS[module];
            return (
              <TableRow
                key={module}
                sx={{
                  bgcolor: i % 2 === 0 ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                {/* Module column: icon big + name below */}
                <TableCell
                  align="center"
                  sx={{ py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <ModuleIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        lineHeight: 1.3,
                        textAlign: 'center',
                        maxWidth: 110,
                      }}
                    >
                      {module}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Status cells */}
                {CLIENTS.map(client => {
                  const result = getResultByClientModule(results, client, module);
                  return (
                    <TableCell
                      key={client}
                      align="center"
                      sx={{ py: 0.5, px: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                      <StatusCell result={result} onClick={onCellClick} />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

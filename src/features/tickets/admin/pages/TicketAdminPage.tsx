import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

import { findTicketById } from '../services/ticketAdminService';
import { TicketInfoTab } from '../components/TicketInfoTab';
import { ScriptsTab } from '../components/ScriptsTab';
import { BitacoraTab } from '../components/BitacoraTab';
import { CreditosTab } from '../components/CreditosTab';
import { SaveConfirmModal } from '../components/SaveConfirmModal';
import type { TicketUsuario } from '../../usuario/types/ticketUsuario.types';
import type { BitacoraData, ScriptObjeto } from '../types/ticketAdmin.types';

const TICKET_PREFIXES = ['MKRS'] as const;

const DEFAULT_BITACORA: BitacoraData = {
  agregarBitacora: false,
  canales: [],
  detalle: '',
};

export function TicketAdminPage() {
  const [ticketPrefix, setTicketPrefix] = useState<string>(TICKET_PREFIXES[0]);
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticket, setTicket] = useState<TicketUsuario | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [scripts, setScripts] = useState<ScriptObjeto[]>([]);
  const [bitacora, setBitacora] = useState<BitacoraData>(DEFAULT_BITACORA);
  const [showValidation, setShowValidation] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savedTicketId, setSavedTicketId] = useState('');

  const fullTicketId = ticketNumber.trim() ? `${ticketPrefix}-${ticketNumber.trim()}` : '';

  const handleSearch = () => {
    if (!ticketNumber.trim()) {
      setSearchError('Ingrese el número del ticket.');
      return;
    }
    const found = findTicketById(fullTicketId);
    if (!found) {
      setSearchError(`No se encontró el ticket "${fullTicketId}".`);
      setTicket(null);
    } else {
      setSearchError(null);
      setTicket(found);
      setActiveTab(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSave = () => {
    if (bitacora.agregarBitacora) {
      if (bitacora.canales.length === 0 || bitacora.detalle.trim() === '') {
        setShowValidation(true);
        setActiveTab(2);
        return;
      }
    }

    const idToConfirm = ticket?.IdTicket ?? fullTicketId;
    setSavedTicketId(idToConfirm);

    // Reset all state
    setTicketNumber('');
    setTicket(null);
    setSearchError(null);
    setScripts([]);
    setBitacora(DEFAULT_BITACORA);
    setShowValidation(false);
    setActiveTab(0);

    setConfirmOpen(true);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page header */}
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Administración de Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Busque un ticket y registre scripts, bitácora y créditos asociados.
        </Typography>
      </Box>

      {/* Zone 1: Ticket search */}
      <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
          Ticket
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <FormControl size="small" sx={{ width: 110 }}>
              <InputLabel>Proyecto</InputLabel>
              <Select
                value={ticketPrefix}
                label="Proyecto"
                onChange={e => {
                  setTicketPrefix(e.target.value);
                  setSearchError(null);
                }}
                sx={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  '& fieldset': { borderRight: 0 },
                }}
              >
                {TICKET_PREFIXES.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Número"
              size="small"
              value={ticketNumber}
              onChange={e => {
                setTicketNumber(e.target.value.replace(/\D/g, ''));
                setSearchError(null);
              }}
              onKeyDown={handleKeyDown}
              error={!!searchError}
              helperText={searchError}
              placeholder="101"
              inputProps={{ inputMode: 'numeric' }}
              sx={{
                width: 140,
                '& .MuiOutlinedInput-root': {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, pt: 0.25 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Buscar
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSave}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Guardar
            </Button>
          </Box>
        </Box>

        {ticket && !searchError && (
          <Alert severity="success" sx={{ mt: 2, py: 0.5 }}>
            Ticket <strong>{ticket.IdTicket}</strong> — {ticket.Titulo}
          </Alert>
        )}
      </Paper>

      {/* Zone 2: Tabs */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab
              icon={<AssignmentOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Información del ticket"
              sx={{ fontWeight: 600, minHeight: 52 }}
            />
            <Tab
              icon={<CodeOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Scripts / Objetos BD"
              sx={{ fontWeight: 600, minHeight: 52 }}
            />
            <Tab
              icon={<MenuBookOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Bitácora"
              sx={{ fontWeight: 600, minHeight: 52 }}
            />
            <Tab
              icon={<CreditCardOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Créditos"
              sx={{ fontWeight: 600, minHeight: 52 }}
            />
          </Tabs>
        </Box>

        <Divider />

        {activeTab === 0 && <TicketInfoTab ticket={ticket} />}
        {activeTab === 1 && <ScriptsTab scripts={scripts} onChange={setScripts} />}
        {activeTab === 2 && (
          <BitacoraTab
            data={bitacora}
            onChange={setBitacora}
            showValidation={showValidation}
          />
        )}
        {activeTab === 3 && <CreditosTab />}
      </Paper>

      <SaveConfirmModal
        open={confirmOpen}
        ticketId={savedTicketId}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  );
}

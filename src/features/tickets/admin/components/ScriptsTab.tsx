import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
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
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ScriptFormDialog } from './ScriptFormDialog';
import type { ScriptObjeto } from '../types/ticketAdmin.types';
import type { ScriptFormValues } from '../schemas/ticketAdmin.schemas';

interface Props {
  scripts: ScriptObjeto[];
  onChange: (scripts: ScriptObjeto[]) => void;
}

const accionColor: Record<string, 'success' | 'warning' | 'error'> = {
  Crear: 'success',
  Actualizar: 'warning',
  Eliminar: 'error',
};

export function ScriptsTab({ scripts, onChange }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ScriptObjeto | null>(null);

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (script: ScriptObjeto) => {
    setEditing(script);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    onChange(scripts.filter(s => s.id !== id));
  };

  const handleSubmit = (values: ScriptFormValues) => {
    if (editing) {
      onChange(scripts.map(s => (s.id === editing.id ? { ...values, id: editing.id } : s)));
    } else {
      const newScript: ScriptObjeto = {
        ...values,
        id: crypto.randomUUID(),
      };
      onChange([...scripts, newScript]);
    }
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {scripts.length === 0
            ? 'Sin scripts registrados'
            : `${scripts.length} script${scripts.length > 1 ? 's' : ''} registrado${scripts.length > 1 ? 's' : ''}`}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ fontWeight: 600 }}
        >
          Agregar script
        </Button>
      </Box>

      {scripts.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ py: 6, textAlign: 'center', borderRadius: 2, borderStyle: 'dashed' }}
        >
          <Typography color="text.secondary" variant="body2">
            Aún no hay scripts registrados para este ticket.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700, width: 60 }}>Acciones</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acción</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Base de datos</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre del script</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scripts.map((script, index) => (
                <TableRow key={script.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleEdit(script)} color="primary">
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => handleDelete(script.id)} color="error">
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Chip label={script.tipoObjeto} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={script.accion}
                      size="small"
                      color={accionColor[script.accion]}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" fontSize={12}>
                      {script.baseDatos}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{script.nombreScript}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {script.descripcion}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ScriptFormDialog
        open={dialogOpen}
        editing={editing}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

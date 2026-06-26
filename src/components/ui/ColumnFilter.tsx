import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface ColumnFilterProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  label: string;
  options: string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  renderOption?: (value: string) => React.ReactNode;
}

export function ColumnFilter({
  anchorEl,
  onClose,
  label,
  options,
  selected,
  onChange,
  renderOption,
}: ColumnFilterProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!anchorEl) setSearch('');
  }, [anchorEl]);

  const visible = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = options.length > 0 && options.every(o => selected.has(o));
  const someSelected = selected.size > 0 && !allSelected;

  const toggle = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  };

  const toggleAll = () => {
    onChange(allSelected ? new Set() : new Set(options));
  };

  const handleClear = () => {
    onChange(new Set());
    onClose();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { width: 240, borderRadius: 2, boxShadow: 6 } }}
    >
      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ px: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {label}
        </Typography>

        <TextField
          size="small"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          autoFocus
          sx={{ mt: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Divider sx={{ my: 1 }} />

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
            />
          }
          label={
            <Typography variant="body2" fontWeight={600}>
              Seleccionar todo
            </Typography>
          }
          sx={{ mx: 0, width: '100%' }}
        />

        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
          {visible.length === 0 ? (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ px: 1.5, py: 0.5, display: 'block' }}
            >
              Sin resultados
            </Typography>
          ) : (
            visible.map(option => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    size="small"
                    checked={selected.has(option)}
                    onChange={() => toggle(option)}
                  />
                }
                label={
                  renderOption ? (
                    renderOption(option)
                  ) : (
                    <Typography variant="body2">{option}</Typography>
                  )
                }
                sx={{ mx: 0, width: '100%', display: 'flex' }}
              />
            ))
          )}
        </Box>

        <Divider sx={{ mt: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
          <Button size="small" onClick={handleClear} color="inherit">
            Limpiar
          </Button>
          <Button size="small" variant="contained" onClick={onClose}>
            Aplicar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

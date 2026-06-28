import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Paper,
} from '@mui/material'
import {
  Close,
  NewReleases,
  TuneOutlined,
  RocketLaunchOutlined,
  CalendarToday,
  RouteOutlined,
} from '@mui/icons-material'
import type { ChangeType, ChangelogEntry } from '../types/changelog.types'
import { useChangelog } from '../hooks/useChangelog'

interface Props {
  open: boolean
  onClose: () => void
}

const TYPE_CONFIG: Record<ChangeType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  initial: {
    label: 'Inicial',
    color: '#6b7280',
    bg: '#f3f4f6',
    icon: <RocketLaunchOutlined sx={{ fontSize: 14 }} />,
  },
  major: {
    label: 'Mayor',
    color: '#9333ea',
    bg: '#faf5ff',
    icon: <NewReleases sx={{ fontSize: 14 }} />,
  },
  minor: {
    label: 'Menor',
    color: '#0288d1',
    bg: '#e0f2fe',
    icon: <NewReleases sx={{ fontSize: 14 }} />,
  },
  patch: {
    label: 'Parche',
    color: '#2e7d32',
    bg: '#f0fdf4',
    icon: <TuneOutlined sx={{ fontSize: 14 }} />,
  },
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function ChangelogEntryCard({ entry, isLatest }: { entry: ChangelogEntry; isLatest: boolean }) {
  const cfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.patch

  return (
    <Paper
      elevation={0}
      sx={{
        border: isLatest ? '1.5px solid' : '1px solid',
        borderColor: isLatest ? 'primary.main' : 'divider',
        borderRadius: 2.5,
        p: 2.5,
        position: 'relative',
        bgcolor: isLatest ? 'rgba(40,66,214,0.02)' : 'background.paper',
      }}
    >
      {isLatest && (
        <Chip
          label="Actual"
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 700,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        />
      )}

      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
        <Chip
          label={`v${entry.version}`}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.78rem',
            height: 24,
            bgcolor: isLatest ? 'primary.main' : '#1e3a5f',
            color: 'white',
            letterSpacing: '0.3px',
          }}
        />
        <Chip
          icon={cfg.icon as React.ReactElement}
          label={cfg.label}
          size="small"
          sx={{
            height: 22,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: cfg.bg,
            color: cfg.color,
            '& .MuiChip-icon': { color: cfg.color },
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {formatDate(entry.date)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RouteOutlined sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.7rem' }}
          >
            {entry.route}
          </Typography>
        </Box>
      </Box>

      {/* Summary */}
      <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5, lineHeight: 1.6 }}>
        {entry.summary}
      </Typography>

      {/* Changes list */}
      {entry.changes.length > 0 && (
        <>
          <Divider sx={{ mb: 1.5 }} />
          <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {entry.changes.map((change, i) => (
              <Box
                component="li"
                key={i}
                sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.5 }}
              >
                {change}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  )
}

export function ChangelogDialog({ open, onClose }: Props) {
  const { version, entries } = useChangelog()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3, maxHeight: '85vh' } },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 1,
          pr: 1,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <RocketLaunchOutlined sx={{ fontSize: 20 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Changelog
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Versión actual: v{version} · {entries.length} versión{entries.length !== 1 ? 'es' : ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {entries.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No hay entradas en el changelog.
          </Typography>
        ) : (
          entries.map((entry, i) => (
            <ChangelogEntryCard key={entry.version} entry={entry} isLatest={i === 0} />
          ))
        )}
      </DialogContent>
    </Dialog>
  )
}

import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import type { StatCard as StatCardType } from '../types/dashboard.types'

interface Props {
  stat: StatCardType
}

const colorMap = {
  primary: { bg: '#e8eef7', accent: '#1e3a5f', text: '#1e3a5f' },
  success: { bg: '#e8f5e9', accent: '#2e7d32', text: '#2e7d32' },
  warning: { bg: '#fff3e0', accent: '#ed6c02', text: '#e65100' },
  error: { bg: '#fce4ec', accent: '#d32f2f', text: '#b71c1c' },
}

export function StatCard({ stat }: Props) {
  const colors = colorMap[stat.color]
  const isPositive = stat.change > 0

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          />
          <Chip
            icon={isPositive
              ? <TrendingUp sx={{ fontSize: '14px !important' }} />
              : <TrendingDown sx={{ fontSize: '14px !important' }} />
            }
            label={`${isPositive ? '+' : ''}${stat.change}`}
            size="small"
            sx={{
              bgcolor: isPositive ? '#e8f5e9' : '#fce4ec',
              color: isPositive ? '#2e7d32' : '#d32f2f',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: colors.text, lineHeight: 1, mb: 0.5 }}
        >
          {stat.value}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
          {stat.title}
        </Typography>
      </CardContent>
    </Card>
  )
}

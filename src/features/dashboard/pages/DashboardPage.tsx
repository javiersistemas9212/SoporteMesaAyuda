import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Divider, Button, Chip } from '@mui/material'
import { HistoryOutlined, RocketLaunchOutlined } from '@mui/icons-material'
import { StatCard } from '../components/StatCard'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { ChangelogDialog } from '../../changelog/components/ChangelogDialog'
import { useChangelog } from '../../changelog/hooks/useChangelog'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const chartDefaults = {
  plugins: {
    legend: {
      labels: { font: { family: 'Inter, Roboto, sans-serif', size: 12 }, boxWidth: 12, padding: 16 },
    },
    tooltip: {
      backgroundColor: '#1e3a5f',
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 8,
    },
  },
}

export function DashboardPage() {
  const { statCards, ticketsByStatus, ticketsOverTime, agentPerformance } = useDashboardStats()
  const [changelogOpen, setChangelogOpen] = useState(false)
  const { version, entries } = useChangelog()
  const latestEntry = entries[0]

  const barData = {
    labels: ticketsOverTime.map(d => d.date),
    datasets: [
      {
        label: 'Abiertos',
        data: ticketsOverTime.map(d => d.abiertos),
        backgroundColor: 'rgba(2, 136, 209, 0.85)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Resueltos',
        data: ticketsOverTime.map(d => d.resueltos),
        backgroundColor: 'rgba(46, 125, 50, 0.85)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const barOptions = {
    ...chartDefaults,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 12 } },
        beginAtZero: true,
      },
    },
    plugins: {
      ...chartDefaults.plugins,
      legend: { ...chartDefaults.plugins.legend, position: 'top' as const },
    },
  }

  const doughnutData = {
    labels: ticketsByStatus.map(d => d.status),
    datasets: [
      {
        data: ticketsByStatus.map(d => d.count),
        backgroundColor: [
          '#1e3a5f',
          '#0288d1',
          '#ed6c02',
          '#2e7d32',
          '#9e9e9e',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  }

  const doughnutOptions = {
    ...chartDefaults,
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      ...chartDefaults.plugins,
      legend: {
        ...chartDefaults.plugins.legend,
        position: 'bottom' as const,
      },
    },
  }

  const lineData = {
    labels: ticketsOverTime.map(d => d.date),
    datasets: [
      {
        label: 'Resueltos',
        data: ticketsOverTime.map(d => d.resueltos),
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#2e7d32',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Abiertos',
        data: ticketsOverTime.map(d => d.abiertos),
        borderColor: '#0288d1',
        backgroundColor: 'rgba(2, 136, 209, 0.06)',
        borderWidth: 2.5,
        borderDash: [6, 4],
        pointBackgroundColor: '#0288d1',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const lineOptions = {
    ...chartDefaults,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 12 } },
        beginAtZero: true,
      },
    },
    plugins: {
      ...chartDefaults.plugins,
      legend: { ...chartDefaults.plugins.legend, position: 'top' as const },
    },
  }

  const agentBarData = {
    labels: agentPerformance.map(a => a.agent),
    datasets: [
      {
        label: 'Tickets Resueltos',
        data: agentPerformance.map(a => a.resueltos),
        backgroundColor: [
          'rgba(30, 58, 95, 0.9)',
          'rgba(2, 136, 209, 0.85)',
          'rgba(46, 125, 50, 0.85)',
          'rgba(237, 108, 2, 0.85)',
          'rgba(158, 158, 158, 0.85)',
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const agentBarOptions = {
    ...chartDefaults,
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 12 } },
        beginAtZero: true,
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
    },
    plugins: {
      ...chartDefaults.plugins,
      legend: { display: false },
    },
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Resumen del equipo de soporte al cliente
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<HistoryOutlined />}
          onClick={() => setChangelogOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
        >
          Changelog · v{version}
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} justifyContent="center" sx={{ mb: 3 }}>
        {statCards.map(stat => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      {/* Row 1: Bar chart (wide) + Doughnut */}
      <Grid container spacing={2.5} justifyContent="center" sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }} textAlign="center">
                Tickets por Semana
              </Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Comparativa de tickets abiertos vs resueltos
              </Typography>
              <Divider sx={{ my: 1.5, width: '100%' }} />
              <Box sx={{ position: 'relative', width: '100%', height: 280 }}>
                <Bar data={barData} options={barOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }} textAlign="center">
                Estado de Tickets
              </Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Distribución actual por estado
              </Typography>
              <Divider sx={{ my: 1.5, width: '100%' }} />
              <Box sx={{ position: 'relative', width: '100%', flex: 1, minHeight: 260 }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Line chart + Horizontal bar */}
      <Grid container spacing={2.5} justifyContent="center" sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }} textAlign="center">
                Tendencia de Resolución
              </Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Evolución semanal de tickets
              </Typography>
              <Divider sx={{ my: 1.5, width: '100%' }} />
              <Box sx={{ position: 'relative', width: '100%', height: 250 }}>
                <Line data={lineData} options={lineOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }} textAlign="center">
                Top Agentes
              </Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Tickets resueltos por agente
              </Typography>
              <Divider sx={{ my: 1.5, width: '100%' }} />
              <Box sx={{ position: 'relative', width: '100%', height: 250 }}>
                <Bar data={agentBarData} options={agentBarOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Último cambio */}
      {latestEntry && (
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: 3 },
          }}
          onClick={() => setChangelogOpen(true)}
        >
          <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RocketLaunchOutlined sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Último cambio documentado
                </Typography>
                <Chip
                  label={`v${latestEntry.version}`}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#1e3a5f', color: 'white' }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {latestEntry.summary}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              Ver todo →
            </Typography>
          </CardContent>
        </Card>
      )}

      <ChangelogDialog open={changelogOpen} onClose={() => setChangelogOpen(false)} />
    </Box>
  )
}

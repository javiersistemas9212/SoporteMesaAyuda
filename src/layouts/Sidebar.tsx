import { useState } from 'react'
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  AccountCircleOutlined,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../constants/navigation'
import { useAuthContext } from '../contexts/AuthContext'

const SIDEBAR_COLLAPSED = 64
const SIDEBAR_EXPANDED = 240

export function Sidebar() {
  const [hovered, setHovered] = useState(false)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthContext()

  const expanded = hovered

  const toggleItem = (id: string) => {
    if (!expanded) return
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const isChildActive = (children: { path: string }[]) =>
    children.some(c => location.pathname === c.path)

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED,
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'width 0.25s ease',
        overflowX: 'hidden',
        overflowY: 'auto',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '3px 0 12px rgba(0,0,0,0.15)',
        zIndex: 100,
      }}
    >
      {/* Header — keeps primary color */}
      <Box
        sx={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 1.5,
          overflow: 'hidden',
          flexShrink: 0,
          bgcolor: 'primary.main',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <AccountCircleOutlined sx={{ color: 'white', fontSize: 28, flexShrink: 0 }} />
        {expanded && (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.nombre ?? 'Usuario'}
          </Typography>
        )}
      </Box>

      {/* Navigation */}
      <List disablePadding sx={{ mt: 1, flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, Icon, children }) => {
          const isOpen = openItems[id] ?? false
          const childActive = isChildActive(children)

          return (
            <Box key={id}>
              <Tooltip
                title={!expanded ? label : ''}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => toggleItem(id)}
                  selected={childActive}
                  sx={{
                    minHeight: 48,
                    px: 2,
                    gap: 1.5,
                    borderRadius: '0 24px 24px 0',
                    mr: expanded ? 1 : 0,
                    transition: 'all 0.2s',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(65, 129, 155, 0.12)',
                      '&:hover': { bgcolor: 'rgba(65, 129, 155, 0.16)' },
                    },
                    '&:hover': {
                      bgcolor: 'rgba(65, 129, 155, 0.07)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Icon
                      sx={{
                        fontSize: 22,
                        color: childActive ? 'primary.main' : 'text.secondary',
                      }}
                    />
                  </ListItemIcon>
                  {expanded && (
                    <>
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: childActive ? 700 : 400,
                          color: childActive ? 'text.primary' : 'text.secondary',
                          whiteSpace: 'nowrap',
                        }}
                      />
                      {isOpen
                        ? <ExpandLess sx={{ color: 'text.secondary', fontSize: 18 }} />
                        : <ExpandMore sx={{ color: 'text.secondary', fontSize: 18 }} />
                      }
                    </>
                  )}
                </ListItemButton>
              </Tooltip>

              {expanded && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {children.map(child => (
                      <ListItemButton
                        key={child.path}
                        selected={location.pathname === child.path}
                        onClick={() => navigate(child.path)}
                        sx={{
                          pl: 5.5,
                          pr: 2,
                          py: 0.75,
                          minHeight: 38,
                          borderRadius: '0 24px 24px 0',
                          mr: 1,
                          '&.Mui-selected': {
                            bgcolor: 'rgba(65, 129, 155, 0.15)',
                            '&:hover': { bgcolor: 'rgba(65, 129, 155, 0.2)' },
                          },
                          '&:hover': {
                            bgcolor: 'rgba(65, 129, 155, 0.06)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: location.pathname === child.path
                              ? 'secondary.main'
                              : 'rgba(0,0,0,0.2)',
                            mr: 1.5,
                            flexShrink: 0,
                          }}
                        />
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: '0.8rem',
                            color: location.pathname === child.path
                              ? 'primary.dark'
                              : 'text.secondary',
                            fontWeight: location.pathname === child.path ? 600 : 400,
                            whiteSpace: 'nowrap',
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          )
        })}
      </List>
    </Box>
  )
}

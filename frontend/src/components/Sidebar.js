import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Biotech as DiagnosisIcon,
  History as HistoryIcon,
  Cloud as WeatherIcon,
  MenuBook as KnowledgeIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingIcon,
  Grass as CropIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { 
    text: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/',
    badge: null
  },
  { 
    text: 'AI Diagnosis', 
    icon: <DiagnosisIcon />, 
    path: '/diagnosis',
    badge: 'New'
  },
  { 
    text: 'History', 
    icon: <HistoryIcon />, 
    path: '/history',
    badge: '24'
  },
  { 
    text: 'Weather Insights', 
    icon: <WeatherIcon />, 
    path: '/weather',
    badge: null
  },
  { 
    text: 'Knowledge Base', 
    icon: <KnowledgeIcon />, 
    path: '/knowledge',
    badge: null
  },
  { 
    text: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/settings',
    badge: null
  },
];

const quickStats = [
  { label: 'Accuracy', value: '96.5%', icon: <SpeedIcon fontSize="small" /> },
  { label: 'Scans Today', value: '147', icon: <TrendingIcon fontSize="small" /> },
  { label: 'Crops', value: '12', icon: <CropIcon fontSize="small" /> },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'rgba(10, 15, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          pt: 8,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Quick Stats */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.1) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            mb: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block' }}>
            MODEL PERFORMANCE
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {quickStats.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.7)' }}>
                  {stat.icon}
                  <Typography variant="body2">{stat.label}</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />

        {/* Navigation */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(76, 175, 80, 0.3)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      bgcolor: item.badge === 'New' ? 'primary.main' : 'rgba(255,255,255,0.1)',
                      color: item.badge === 'New' ? '#fff' : 'rgba(255,255,255,0.7)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />

        {/* Supported Crops */}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', px: 2, mb: 1, display: 'block' }}>
          SUPPORTED CROPS
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: 2 }}>
          {['🥔 Potato', '🍅 Tomato', '🌶️ Pepper', '🌽 Corn', '🍇 Grape', '🍎 Apple'].map((crop) => (
            <Chip
              key={crop}
              label={crop}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.75rem',
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

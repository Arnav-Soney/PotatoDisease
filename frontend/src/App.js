import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DiagnosisPage from './pages/DiagnosisPage';
import HistoryPage from './pages/HistoryPage';
import WeatherPage from './pages/WeatherPage';
import KnowledgeBase from './pages/KnowledgeBase';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          pl: sidebarOpen ? '240px' : 0,
          transition: 'padding-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;

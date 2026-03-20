import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Delete,
  Download,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  CalendarToday,
} from '@mui/icons-material';

// Mock history data
const historyData = [
  {
    id: 1,
    date: '2024-01-15T10:30:00',
    crop: 'Tomato',
    cropIcon: '🍅',
    result: 'Late Blight',
    confidence: 94.2,
    severity: 'high',
    imageUrl: '/images/tomato1.jpg',
    status: 'treated',
  },
  {
    id: 2,
    date: '2024-01-15T09:15:00',
    crop: 'Potato',
    cropIcon: '🥔',
    result: 'Healthy',
    confidence: 98.5,
    severity: 'none',
    imageUrl: '/images/potato1.jpg',
    status: 'healthy',
  },
  {
    id: 3,
    date: '2024-01-14T16:45:00',
    crop: 'Pepper',
    cropIcon: '🌶️',
    result: 'Bacterial Spot',
    confidence: 87.3,
    severity: 'medium',
    imageUrl: '/images/pepper1.jpg',
    status: 'pending',
  },
  {
    id: 4,
    date: '2024-01-14T14:20:00',
    crop: 'Tomato',
    cropIcon: '🍅',
    result: 'Early Blight',
    confidence: 91.8,
    severity: 'medium',
    imageUrl: '/images/tomato2.jpg',
    status: 'treated',
  },
  {
    id: 5,
    date: '2024-01-14T11:00:00',
    crop: 'Potato',
    cropIcon: '🥔',
    result: 'Early Blight',
    confidence: 89.5,
    severity: 'medium',
    imageUrl: '/images/potato2.jpg',
    status: 'pending',
  },
  {
    id: 6,
    date: '2024-01-13T15:30:00',
    crop: 'Tomato',
    cropIcon: '🍅',
    result: 'Healthy',
    confidence: 96.7,
    severity: 'none',
    imageUrl: '/images/tomato3.jpg',
    status: 'healthy',
  },
  {
    id: 7,
    date: '2024-01-13T10:45:00',
    crop: 'Pepper',
    cropIcon: '🌶️',
    result: 'Healthy',
    confidence: 95.2,
    severity: 'none',
    imageUrl: '/images/pepper2.jpg',
    status: 'healthy',
  },
  {
    id: 8,
    date: '2024-01-12T14:00:00',
    crop: 'Potato',
    cropIcon: '🥔',
    result: 'Late Blight',
    confidence: 92.1,
    severity: 'high',
    imageUrl: '/images/potato3.jpg',
    status: 'treated',
  },
];

const HistoryPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [actionAnchor, setActionAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'success';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'treated':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />;
      case 'pending':
        return <Warning sx={{ color: 'warning.main', fontSize: 18 }} />;
      case 'healthy':
        return <CheckCircle sx={{ color: 'info.main', fontSize: 18 }} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredData = historyData.filter((row) => {
    const matchesSearch =
      row.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.result.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'diseased' && row.severity !== 'none') ||
      (selectedFilter === 'healthy' && row.severity === 'none') ||
      selectedFilter === row.status;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: historyData.length,
    healthy: historyData.filter((d) => d.severity === 'none').length,
    diseased: historyData.filter((d) => d.severity !== 'none').length,
    treated: historyData.filter((d) => d.status === 'treated').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Diagnosis History
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          View and manage your previous crop analyses
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Total Scans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.healthy}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Healthy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.diseased}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Diseased
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.treated}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Treated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table Card */}
      <Card>
        <CardContent>
          {/* Search and Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search by crop or disease..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
            >
              Filter: {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
            </Button>
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={() => setFilterAnchor(null)}
            >
              {['all', 'healthy', 'diseased', 'treated', 'pending'].map((filter) => (
                <MenuItem
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setFilterAnchor(null);
                  }}
                  selected={selectedFilter === filter}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </MenuItem>
              ))}
            </Menu>
            <Button variant="outlined" startIcon={<Download />}>
              Export
            </Button>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Crop</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell align="center">Confidence</TableCell>
                  <TableCell align="center">Severity</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.02)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                          <Typography variant="body2">{formatDate(row.date)}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{row.cropIcon}</Typography>
                          <Typography variant="body2">{row.crop}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.result}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${row.confidence.toFixed(1)}%`}
                          size="small"
                          sx={{
                            bgcolor:
                              row.confidence >= 90
                                ? 'rgba(76, 175, 80, 0.2)'
                                : 'rgba(255, 152, 0, 0.2)',
                            color: row.confidence >= 90 ? 'success.main' : 'warning.main',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.severity === 'none' ? 'None' : row.severity}
                          size="small"
                          color={getSeverityColor(row.severity)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          {getStatusIcon(row.status)}
                          <Typography
                            variant="caption"
                            sx={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.7)' }}
                          >
                            {row.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setActionAnchor(e.currentTarget);
                            setSelectedRow(row);
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={() => setActionAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setDetailDialog(true);
            setActionAnchor(null);
          }}
        >
          <Visibility sx={{ mr: 1, fontSize: 18 }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => setActionAnchor(null)}>
          <Download sx={{ mr: 1, fontSize: 18 }} /> Download Report
        </MenuItem>
        <MenuItem onClick={() => setActionAnchor(null)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(20, 25, 40, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4">{selectedRow?.cropIcon}</Typography>
            <Box>
              <Typography variant="h6">{selectedRow?.result}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {selectedRow && formatDate(selectedRow.date)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: 250,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>Image Preview</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                DIAGNOSIS DETAILS
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Crop Type
                  </Typography>
                  <Typography>{selectedRow?.crop}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Result
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>{selectedRow?.result}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Confidence
                  </Typography>
                  <Typography>{selectedRow?.confidence}%</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Severity
                  </Typography>
                  <Chip
                    label={selectedRow?.severity}
                    size="small"
                    color={getSeverityColor(selectedRow?.severity)}
                    sx={{ ml: 1, textTransform: 'capitalize' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HistoryPage;

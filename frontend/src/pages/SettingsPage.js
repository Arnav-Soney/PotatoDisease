import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Chip,
  Slider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import {
  Notifications,
  Language,
  Palette,
  Security,
  Storage,
  CloudSync,
  Speed,
  Api,
  Delete,
  Add,
  Check,
} from "@mui/icons-material";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    diseaseAlerts: true,
    weatherAlerts: true,
    weeklyReport: false,

    // Appearance
    darkMode: true,
    language: "en",
    dateFormat: "MM/DD/YYYY",

    // Model Settings
    confidenceThreshold: 70,
    enableUncertainty: true,
    enableGradCAM: true,
    mcDropoutSamples: 10,

    // API
    apiEndpoint: "http://localhost:8000",
    apiTimeout: 30,

    // Data
    autoSync: true,
    cacheEnabled: true,
    historyRetention: 30,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "hi", name: "हिंदी" },
    { code: "pt", name: "Português" },
    { code: "fr", name: "Français" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
          Configure your CropGuard AI experience
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Notifications sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
              </Box>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        handleChange("emailNotifications", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Browser push notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) =>
                        handleChange("pushNotifications", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Disease Alerts"
                    secondary="Get notified about high-risk conditions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.diseaseAlerts}
                      onChange={(e) =>
                        handleChange("diseaseAlerts", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Weather Alerts"
                    secondary="Notifications for weather changes"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.weatherAlerts}
                      onChange={(e) =>
                        handleChange("weatherAlerts", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Weekly Reports"
                    secondary="Receive weekly summary reports"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.weeklyReport}
                      onChange={(e) =>
                        handleChange("weeklyReport", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Palette sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Appearance & Language
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  label="Language"
                  onChange={(e) => handleChange("language", e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={settings.dateFormat}
                  label="Date Format"
                  onChange={(e) => handleChange("dateFormat", e.target.value)}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) => handleChange("darkMode", e.target.checked)}
                    color="primary"
                  />
                }
                label="Dark Mode"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Model Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Speed sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Model Settings
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Confidence Threshold: {settings.confidenceThreshold}%
                </Typography>
                <Slider
                  value={settings.confidenceThreshold}
                  onChange={(e, v) => handleChange("confidenceThreshold", v)}
                  min={50}
                  max={95}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ color: "primary.main" }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Predictions below this threshold will be flagged as uncertain
                </Typography>
              </Box>
              <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Enable Uncertainty Estimation"
                    secondary="Use MC Dropout for confidence intervals"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.enableUncertainty}
                      onChange={(e) =>
                        handleChange("enableUncertainty", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Enable Grad-CAM Visualization"
                    secondary="Show attention heatmaps for predictions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.enableGradCAM}
                      onChange={(e) =>
                        handleChange("enableGradCAM", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              {settings.enableUncertainty && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    MC Dropout Samples: {settings.mcDropoutSamples}
                  </Typography>
                  <Slider
                    value={settings.mcDropoutSamples}
                    onChange={(e, v) => handleChange("mcDropoutSamples", v)}
                    min={5}
                    max={30}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    More samples = better uncertainty estimate but slower
                    inference
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* API Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Api sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  API Configuration
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="API Endpoint"
                value={settings.apiEndpoint}
                onChange={(e) => handleChange("apiEndpoint", e.target.value)}
                sx={{ mb: 3 }}
              />
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Request Timeout: {settings.apiTimeout}s
                </Typography>
                <Slider
                  value={settings.apiTimeout}
                  onChange={(e, v) => handleChange("apiTimeout", v)}
                  min={10}
                  max={60}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ color: "primary.main" }}
                />
              </Box>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
              >
                Test Connection
              </Button>
              <Alert
                severity="success"
                sx={{ bgcolor: "rgba(76, 175, 80, 0.1)" }}
              >
                API Status: Connected ✓
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Data & Storage */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Storage sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Data & Storage
                </Typography>
              </Box>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Auto Sync"
                    secondary="Automatically sync data to cloud"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoSync}
                      onChange={(e) =>
                        handleChange("autoSync", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Enable Cache"
                    secondary="Cache model for faster loading"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.cacheEnabled}
                      onChange={(e) =>
                        handleChange("cacheEnabled", e.target.checked)
                      }
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  History Retention: {settings.historyRetention} days
                </Typography>
                <Slider
                  value={settings.historyRetention}
                  onChange={(e, v) => handleChange("historyRetention", v)}
                  min={7}
                  max={90}
                  step={7}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ color: "primary.main" }}
                />
              </Box>
              <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" color="error" startIcon={<Delete />}>
                  Clear Cache
                </Button>
                <Button variant="outlined" startIcon={<CloudSync />}>
                  Sync Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Security sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Security & Privacy
                </Typography>
              </Box>
              <Alert
                severity="info"
                sx={{ mb: 3, bgcolor: "rgba(33, 150, 243, 0.1)" }}
              >
                Your data is encrypted and stored securely. Images are processed
                locally when possible.
              </Alert>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                Change Password
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                Two-Factor Authentication
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                Download My Data
              </Button>
              <Button variant="outlined" color="error" fullWidth>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined">Reset to Defaults</Button>
            <Button variant="contained" color="primary" startIcon={<Check />}>
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;

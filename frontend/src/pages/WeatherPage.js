import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  WaterDrop,
  Thermostat,
  Air,
  WbSunny,
  Grain,
  Warning,
  TipsAndUpdates,
  LocationOn,
  Refresh,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Mock weather data
const weatherForecast = [
  { day: "Mon", temp: 24, humidity: 65, rain: 10 },
  { day: "Tue", temp: 26, humidity: 70, rain: 30 },
  { day: "Wed", temp: 23, humidity: 80, rain: 60 },
  { day: "Thu", temp: 22, humidity: 85, rain: 70 },
  { day: "Fri", temp: 25, humidity: 75, rain: 40 },
  { day: "Sat", temp: 27, humidity: 60, rain: 15 },
  { day: "Sun", temp: 28, humidity: 55, rain: 5 },
];

const diseaseRisks = [
  {
    disease: "Late Blight",
    risk: 78,
    conditions: "High humidity and cool temps predicted",
  },
  {
    disease: "Early Blight",
    risk: 45,
    conditions: "Moderate risk with current forecast",
  },
  { disease: "Bacterial Spot", risk: 32, conditions: "Low risk conditions" },
  {
    disease: "Downy Mildew",
    risk: 65,
    conditions: "Rising humidity increases risk",
  },
];

const WeatherPage = () => {
  const [location, setLocation] = useState("San Francisco, CA");
  const [currentWeather, setCurrentWeather] = useState({
    temp: 24,
    humidity: 68,
    wind: 12,
    uv: 6,
    condition: "Partly Cloudy",
    feelsLike: 26,
  });

  const getRiskColor = (risk) => {
    if (risk >= 70) return "error";
    if (risk >= 50) return "warning";
    return "success";
  };

  const getRiskBgColor = (risk) => {
    if (risk >= 70) return "rgba(244, 67, 54, 0.1)";
    if (risk >= 50) return "rgba(255, 152, 0, 0.1)";
    return "rgba(76, 175, 80, 0.1)";
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Weather & Disease Risk
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
          AI-powered disease risk assessment based on weather conditions
        </Typography>
      </Box>

      {/* Location Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <LocationOn sx={{ color: "primary.main" }} />
            <TextField
              size="small"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location..."
              sx={{ flex: 1 }}
            />
            <Button variant="contained" startIcon={<Refresh />}>
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Current Weather */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}
              >
                CURRENT CONDITIONS
              </Typography>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <WbSunny sx={{ fontSize: 64, color: "#ffc107", mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {currentWeather.temp}°C
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {currentWeather.condition}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Feels like {currentWeather.feelsLike}°C
                </Typography>
              </Box>
              <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WaterDrop sx={{ color: "info.main" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Humidity
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currentWeather.humidity}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Air sx={{ color: "info.main" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Wind
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currentWeather.wind} km/h
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WbSunny sx={{ color: "warning.main" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        UV Index
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currentWeather.uv} (High)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Grain sx={{ color: "success.main" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Soil Moisture
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        42%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 7-Day Forecast */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}
              >
                7-DAY FORECAST
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weatherForecast}>
                  <defs>
                    <linearGradient
                      id="tempGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ff9800" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="humidityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2196f3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20, 25, 40, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="temp"
                    stroke="#ff9800"
                    fill="url(#tempGradient)"
                    strokeWidth={2}
                    name="Temperature (°C)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#2196f3"
                    fill="url(#humidityGradient)"
                    strokeWidth={2}
                    name="Humidity (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                  mt: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#ff9800",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Temperature
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#2196f3",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Humidity
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Disease Risk Alert */}
        <Grid item xs={12}>
          <Alert
            severity="warning"
            icon={<Warning />}
            sx={{
              bgcolor: "rgba(255, 152, 0, 0.1)",
              border: "1px solid rgba(255, 152, 0, 0.3)",
            }}
          >
            <AlertTitle>High Disease Risk Alert</AlertTitle>
            Weather conditions over the next 3 days are favorable for Late
            Blight development. Consider preventive fungicide application and
            increase monitoring frequency.
          </Alert>
        </Grid>

        {/* Disease Risk Assessment */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Warning sx={{ color: "warning.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Disease Risk Assessment
                </Typography>
              </Box>
              {diseaseRisks.map((disease, idx) => (
                <Box
                  key={disease.disease}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: getRiskBgColor(disease.risk),
                    border: "1px solid",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {disease.disease}
                    </Typography>
                    <Chip
                      label={`${disease.risk}% Risk`}
                      size="small"
                      color={getRiskColor(disease.risk)}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={disease.risk}
                    color={getRiskColor(disease.risk)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.1)",
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {disease.conditions}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <TipsAndUpdates sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Weather-Based Recommendations
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "error.main", mb: 1 }}
                >
                  ⚠️ High Priority
                </Typography>
                <Typography variant="body2">
                  Apply preventive copper fungicide before the forecasted rain
                  on Wednesday. High humidity conditions expected for 48+ hours.
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  border: "1px solid rgba(255, 152, 0, 0.3)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "warning.main", mb: 1 }}
                >
                  🕐 This Week
                </Typography>
                <Typography variant="body2">
                  Increase field monitoring frequency to every 2-3 days. Check
                  lower leaves for early signs of blight lesions.
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(76, 175, 80, 0.1)",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "success.main", mb: 1 }}
                >
                  ✓ Good Practice
                </Typography>
                <Typography variant="body2">
                  Continue regular irrigation schedule. Avoid overhead watering
                  during humid periods to reduce leaf wetness duration.
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(33, 150, 243, 0.1)",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "info.main", mb: 1 }}
                >
                  📊 Analytics Tip
                </Typography>
                <Typography variant="body2">
                  Based on historical data, disease incidence typically
                  increases 40% when humidity exceeds 80% for more than 3
                  consecutive days.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeatherPage;

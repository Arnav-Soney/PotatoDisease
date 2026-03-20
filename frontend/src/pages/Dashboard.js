import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
  BugReport,
  CheckCircle,
  Warning,
  Speed,
  Psychology,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample data
const weeklyData = [
  { day: "Mon", scans: 45, healthy: 38, diseased: 7 },
  { day: "Tue", scans: 52, healthy: 42, diseased: 10 },
  { day: "Wed", scans: 38, healthy: 30, diseased: 8 },
  { day: "Thu", scans: 65, healthy: 55, diseased: 10 },
  { day: "Fri", scans: 58, healthy: 48, diseased: 10 },
  { day: "Sat", scans: 72, healthy: 60, diseased: 12 },
  { day: "Sun", scans: 48, healthy: 40, diseased: 8 },
];

const diseaseDistribution = [
  { name: "Early Blight", value: 35, color: "#ff9800" },
  { name: "Late Blight", value: 28, color: "#f44336" },
  { name: "Bacterial Spot", value: 18, color: "#9c27b0" },
  { name: "Healthy", value: 19, color: "#4caf50" },
];

const recentActivity = [
  {
    id: 1,
    crop: "🍅 Tomato",
    result: "Late Blight",
    confidence: 94,
    time: "2 min ago",
    severity: "high",
  },
  {
    id: 2,
    crop: "🥔 Potato",
    result: "Healthy",
    confidence: 98,
    time: "5 min ago",
    severity: "none",
  },
  {
    id: 3,
    crop: "🌶️ Pepper",
    result: "Bacterial Spot",
    confidence: 87,
    time: "12 min ago",
    severity: "medium",
  },
  {
    id: 4,
    crop: "🍅 Tomato",
    result: "Early Blight",
    confidence: 91,
    time: "18 min ago",
    severity: "medium",
  },
  {
    id: 5,
    crop: "🥔 Potato",
    result: "Healthy",
    confidence: 96,
    time: "25 min ago",
    severity: "none",
  },
];

const modelMetrics = [
  { name: "Accuracy", value: 96.5, trend: 2.3, icon: <Speed /> },
  { name: "Precision", value: 94.2, trend: 1.8, icon: <Psychology /> },
  { name: "Recall", value: 95.8, trend: -0.5, icon: <BugReport /> },
  { name: "F1 Score", value: 95.0, trend: 1.2, icon: <CheckCircle /> },
];

const StatCard = ({ title, value, subtitle, trend, icon, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{ mt: 1, fontWeight: 700, color: color || "white" }}
          >
            {value}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
            {trend > 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: "error.main" }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: trend > 0 ? "success.main" : "error.main" }}
            >
              {Math.abs(trend)}%
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.5)" }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color}20` || "rgba(76, 175, 80, 0.2)",
            color: color || "primary.main",
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
          Monitor your crop health analysis and AI model performance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Scans Today"
            value="378"
            subtitle="vs last week"
            trend={12.5}
            icon={<BugReport />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Diseases Detected"
            value="47"
            subtitle="vs last week"
            trend={-8.2}
            icon={<Warning />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Healthy Plants"
            value="331"
            subtitle="vs last week"
            trend={15.3}
            icon={<CheckCircle />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Model Accuracy"
            value="96.5%"
            subtitle="vs last version"
            trend={2.3}
            icon={<Speed />}
            color="#2196f3"
          />
        </Grid>

        {/* Weekly Scans Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Weekly Scan Activity
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Healthy vs Diseased plants detected
                  </Typography>
                </Box>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient
                      id="colorHealthy"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorDiseased"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ff9800" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(20, 25, 40, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="healthy"
                    stroke="#4caf50"
                    fillOpacity={1}
                    fill="url(#colorHealthy)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="diseased"
                    stroke="#ff9800"
                    fillOpacity={1}
                    fill="url(#colorDiseased)"
                    strokeWidth={2}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Disease Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Disease Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(20, 25, 40, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {diseaseDistribution.map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: item.color,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Metrics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Model Performance
              </Typography>
              {modelMetrics.map((metric) => (
                <Box key={metric.name} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: "rgba(76, 175, 80, 0.2)",
                        }}
                      >
                        {React.cloneElement(metric.icon, {
                          sx: { fontSize: 16, color: "primary.main" },
                        })}
                      </Avatar>
                      <Typography variant="body2">{metric.name}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metric.value}%
                      </Typography>
                      {metric.trend > 0 ? (
                        <TrendingUp
                          sx={{ fontSize: 14, color: "success.main" }}
                        />
                      ) : (
                        <TrendingDown
                          sx={{ fontSize: 14, color: "error.main" }}
                        />
                      )}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 3,
                        background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Diagnoses
                </Typography>
                <Chip
                  label="View All"
                  size="small"
                  sx={{ cursor: "pointer" }}
                />
              </Box>
              {recentActivity.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h5">
                      {activity.crop.split(" ")[0]}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {activity.result}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {activity.crop.split(" ")[1]} • {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={`${activity.confidence}%`}
                      size="small"
                      sx={{
                        bgcolor:
                          activity.confidence >= 90
                            ? "rgba(76, 175, 80, 0.2)"
                            : "rgba(255, 152, 0, 0.2)",
                        color:
                          activity.confidence >= 90
                            ? "success.main"
                            : "warning.main",
                      }}
                    />
                    <Chip
                      label={
                        activity.severity === "none"
                          ? "Healthy"
                          : activity.severity
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          activity.severity === "none"
                            ? "rgba(76, 175, 80, 0.2)"
                            : activity.severity === "high"
                              ? "rgba(244, 67, 54, 0.2)"
                              : "rgba(255, 152, 0, 0.2)",
                        color:
                          activity.severity === "none"
                            ? "success.main"
                            : activity.severity === "high"
                              ? "error.main"
                              : "warning.main",
                        textTransform: "capitalize",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

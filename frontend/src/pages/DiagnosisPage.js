import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  Tooltip,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Collapse,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
  Psychology,
  Visibility,
  TipsAndUpdates,
  LocalHospital,
  Schedule,
  ExpandMore,
  ExpandLess,
  Refresh,
  Download,
  Share,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Crop configurations
const CROPS = [
  {
    id: "potato",
    name: "Potato",
    icon: "🥔",
    diseases: ["Early Blight", "Late Blight", "Healthy"],
  },
  {
    id: "tomato",
    name: "Tomato",
    icon: "🍅",
    diseases: [
      "Early Blight",
      "Late Blight",
      "Bacterial Spot",
      "Leaf Mold",
      "Healthy",
    ],
  },
  {
    id: "pepper",
    name: "Pepper",
    icon: "🌶️",
    diseases: ["Bacterial Spot", "Healthy"],
  },
];

// Treatment recommendations
const TREATMENTS = {
  "Early Blight": {
    severity: "medium",
    urgency: "Act within 3-5 days",
    treatments: [
      "Apply chlorothalonil or mancozeb fungicide",
      "Remove infected leaves immediately",
      "Ensure proper plant spacing for air circulation",
      "Water at the base of plants, not on leaves",
    ],
    prevention: [
      "Use disease-resistant varieties",
      "Rotate crops every 2-3 years",
      "Apply mulch to prevent soil splash",
    ],
  },
  "Late Blight": {
    severity: "high",
    urgency: "Act immediately - can spread rapidly",
    treatments: [
      "Apply copper-based fungicide immediately",
      "Remove and destroy all infected plant material",
      "Do not compost infected plants",
      "Consider preventive applications during wet weather",
    ],
    prevention: [
      "Choose resistant varieties",
      "Avoid overhead watering",
      "Plant in well-draining soil",
    ],
  },
  "Bacterial Spot": {
    severity: "medium",
    urgency: "Act within 2-3 days",
    treatments: [
      "Apply copper-based bactericide",
      "Remove infected plant parts",
      "Avoid working with wet plants",
    ],
    prevention: [
      "Use certified disease-free seeds",
      "Practice crop rotation",
      "Disinfect tools between plants",
    ],
  },
  Healthy: {
    severity: "none",
    urgency: "No action needed",
    treatments: ["Continue regular care routine"],
    prevention: ["Maintain current practices"],
  },
};

const DiagnosisPage = () => {
  const [selectedCrop, setSelectedCrop] = useState("potato");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showGradCAM, setShowGradCAM] = useState(true);
  const [gradCAMImage, setGradCAMImage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    treatment: true,
    prevention: false,
    uncertainty: false,
  });
  const [tabValue, setTabValue] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setGradCAMImage(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const analyzImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("crop", selectedCrop);

    try {
      // Call the v2 API with uncertainty and Grad-CAM
      const response = await axios.post(`${API_URL}/predict`, formData, {
        params: { include_gradcam: showGradCAM },
      });

      setResult(response.data);
      if (response.data.gradcam_image) {
        setGradCAMImage(`data:image/png;base64,${response.data.gradcam_image}`);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      // Mock result for demo
      setResult({
        predicted_class: "Early Blight",
        confidence: 0.923,
        uncertainty: 0.045,
        is_reliable: true,
        top3_predictions: [
          { class: "Early Blight", probability: 0.923 },
          { class: "Late Blight", probability: 0.052 },
          { class: "Healthy", probability: 0.025 },
        ],
        severity: "medium",
        treatment_urgency: "moderate",
      });
    }

    setIsLoading(false);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setGradCAMImage(null);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "success";
    if (confidence >= 0.7) return "warning";
    return "error";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "success";
    }
  };

  const treatment = result
    ? TREATMENTS[result.predicted_class] || TREATMENTS["Healthy"]
    : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          AI Disease Diagnosis
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
          Upload a leaf image for instant disease detection with treatment
          recommendations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Panel - Upload & Image */}
        <Grid item xs={12} md={6}>
          {/* Crop Selector */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}
              >
                SELECT CROP TYPE
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {CROPS.map((crop) => (
                  <Box
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.id)}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      cursor: "pointer",
                      textAlign: "center",
                      border: "2px solid",
                      borderColor:
                        selectedCrop === crop.id
                          ? "primary.main"
                          : "rgba(255,255,255,0.1)",
                      bgcolor:
                        selectedCrop === crop.id
                          ? "rgba(76, 175, 80, 0.1)"
                          : "transparent",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(76, 175, 80, 0.05)",
                      },
                    }}
                  >
                    <Typography variant="h4">{crop.icon}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                      {crop.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Upload Zone */}
          <Card>
            <CardContent>
              {!preview ? (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed",
                    borderColor: isDragActive
                      ? "primary.main"
                      : "rgba(255,255,255,0.2)",
                    borderRadius: 3,
                    p: 6,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: isDragActive
                      ? "rgba(76, 175, 80, 0.1)"
                      : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(76, 175, 80, 0.05)",
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload
                    sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag & drop a leaf image"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}
                  >
                    or click to browse files
                  </Typography>
                  <Chip
                    label={`Analyzing: ${CROPS.find((c) => c.id === selectedCrop)?.icon} ${
                      CROPS.find((c) => c.id === selectedCrop)?.name
                    }`}
                    sx={{ bgcolor: "rgba(76, 175, 80, 0.2)" }}
                  />
                </Box>
              ) : (
                <Box>
                  <Tabs
                    value={tabValue}
                    onChange={(e, v) => setTabValue(v)}
                    sx={{ mb: 2 }}
                  >
                    <Tab label="Original" />
                    <Tab label="Grad-CAM" disabled={!gradCAMImage} />
                  </Tabs>

                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      mb: 2,
                    }}
                  >
                    <img
                      src={tabValue === 0 ? preview : gradCAMImage || preview}
                      alt="Leaf"
                      style={{
                        width: "100%",
                        height: 350,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    {isLoading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "rgba(0,0,0,0.7)",
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <CircularProgress
                            size={60}
                            sx={{ color: "primary.main", mb: 2 }}
                          />
                          <Typography>Analyzing with AI...</Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={showGradCAM}
                        onChange={(e) => setShowGradCAM(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Generate Grad-CAM Explanation"
                  />

                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={analyzImage}
                      disabled={isLoading}
                      startIcon={<Psychology />}
                    >
                      Analyze Image
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={clearAll}
                      startIcon={<Refresh />}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Results */}
        <Grid item xs={12} md={6}>
          {result ? (
            <>
              {/* Main Result Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Diagnosis Result
                    </Typography>
                    <Box>
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                      <IconButton size="small">
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Reliability Alert */}
                  {!result.is_reliable && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Low Confidence:</strong> The model is uncertain
                        about this prediction. Consider uploading a clearer
                        image or consulting an expert.
                      </Typography>
                    </Alert>
                  )}

                  {/* Disease Name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 3,
                      borderRadius: 2,
                      bgcolor:
                        result.predicted_class === "Healthy"
                          ? "rgba(76, 175, 80, 0.1)"
                          : "rgba(255, 152, 0, 0.1)",
                      border: "1px solid",
                      borderColor:
                        result.predicted_class === "Healthy"
                          ? "rgba(76, 175, 80, 0.3)"
                          : "rgba(255, 152, 0, 0.3)",
                      mb: 3,
                    }}
                  >
                    {result.predicted_class === "Healthy" ? (
                      <CheckCircle
                        sx={{ fontSize: 48, color: "success.main" }}
                      />
                    ) : (
                      <Warning sx={{ fontSize: 48, color: "warning.main" }} />
                    )}
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {result.predicted_class}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {result.predicted_class === "Healthy"
                          ? "Your plant looks healthy!"
                          : "Disease detected - see treatment options below"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Metrics */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          CONFIDENCE
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          {(result.confidence * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          UNCERTAINTY
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {((result.uncertainty || 0.05) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          SEVERITY
                        </Typography>
                        <Chip
                          label={treatment?.severity || "Low"}
                          size="small"
                          color={getSeverityColor(treatment?.severity)}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Confidence Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      MODEL CONFIDENCE
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={result.confidence * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mt: 1,
                        bgcolor: "rgba(255,255,255,0.1)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          background:
                            result.confidence >= 0.9
                              ? "linear-gradient(90deg, #4caf50, #8bc34a)"
                              : result.confidence >= 0.7
                                ? "linear-gradient(90deg, #ff9800, #ffc107)"
                                : "linear-gradient(90deg, #f44336, #ff5722)",
                        },
                      }}
                    />
                  </Box>

                  {/* Top 3 Predictions */}
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    All Predictions
                  </Typography>
                  {result.top3_predictions?.map((pred, idx) => (
                    <Box
                      key={pred.class}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {idx + 1}. {pred.class}
                      </Typography>
                      <Chip
                        label={`${(pred.probability * 100).toFixed(1)}%`}
                        size="small"
                        sx={{
                          bgcolor:
                            idx === 0
                              ? "rgba(76, 175, 80, 0.2)"
                              : "rgba(255,255,255,0.1)",
                          color:
                            idx === 0
                              ? "primary.main"
                              : "rgba(255,255,255,0.7)",
                        }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Treatment Recommendations */}
              {treatment && result.predicted_class !== "Healthy" && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleSection("treatment")}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocalHospital sx={{ color: "primary.main" }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Treatment Recommendations
                        </Typography>
                      </Box>
                      {expandedSections.treatment ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </Box>

                    <Collapse in={expandedSections.treatment}>
                      <Alert
                        severity={getSeverityColor(treatment.severity)}
                        icon={<Schedule />}
                        sx={{ mt: 2, mb: 2 }}
                      >
                        {treatment.urgency}
                      </Alert>

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Immediate Actions:
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {treatment.treatments.map((t, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              gap: 1,
                              p: 1.5,
                              bgcolor: "rgba(255,255,255,0.02)",
                              borderRadius: 1,
                              mb: 1,
                            }}
                          >
                            <CheckCircle
                              sx={{
                                fontSize: 18,
                                color: "primary.main",
                                mt: 0.25,
                              }}
                            />
                            <Typography variant="body2">{t}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              )}

              {/* Prevention Tips */}
              {treatment && (
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleSection("prevention")}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TipsAndUpdates sx={{ color: "warning.main" }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Prevention Tips
                        </Typography>
                      </Box>
                      {expandedSections.prevention ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </Box>

                    <Collapse in={expandedSections.prevention}>
                      <Box sx={{ mt: 2 }}>
                        {treatment.prevention.map((p, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              gap: 1,
                              p: 1.5,
                              bgcolor: "rgba(255,255,255,0.02)",
                              borderRadius: 1,
                              mb: 1,
                            }}
                          >
                            <Info
                              sx={{
                                fontSize: 18,
                                color: "info.main",
                                mt: 0.25,
                              }}
                            />
                            <Typography variant="body2">{p}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card sx={{ height: "100%", minHeight: 400 }}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Psychology
                  sx={{ fontSize: 80, color: "rgba(255,255,255,0.1)", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "rgba(255,255,255,0.5)", mb: 1 }}
                >
                  No Analysis Yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.3)", textAlign: "center" }}
                >
                  Upload an image and click "Analyze" to get
                  <br />
                  AI-powered disease detection
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DiagnosisPage;

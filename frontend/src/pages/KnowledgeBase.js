import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from "@mui/material";
import {
  Search,
  ExpandMore,
  LocalFlorist,
  BugReport,
  Healing,
  Science,
  Warning,
  CheckCircle,
  Info,
  Lightbulb,
  ArrowForward,
} from "@mui/icons-material";

// Disease knowledge base
const diseaseDatabase = {
  potato: [
    {
      id: "early_blight",
      name: "Early Blight",
      scientificName: "Alternaria solani",
      severity: "medium",
      symptoms: [
        "Dark brown to black lesions with concentric rings (target-like appearance)",
        "Lesions typically start on older, lower leaves",
        "Yellowing of tissue around lesions",
        "Premature defoliation in severe cases",
      ],
      causes: [
        "Fungal pathogen Alternaria solani",
        "Warm temperatures (24-29°C)",
        "High humidity and leaf wetness",
        "Poor plant nutrition",
      ],
      treatments: [
        "Apply chlorothalonil or mancozeb fungicide",
        "Remove and destroy infected plant material",
        "Improve air circulation between plants",
        "Water at the base of plants",
      ],
      prevention: [
        "Use disease-resistant varieties",
        "Practice 2-3 year crop rotation",
        "Maintain proper plant spacing",
        "Apply mulch to prevent soil splash",
      ],
    },
    {
      id: "late_blight",
      name: "Late Blight",
      scientificName: "Phytophthora infestans",
      severity: "high",
      symptoms: [
        "Water-soaked lesions on leaves that turn brown/black",
        "White fuzzy growth on leaf undersides in humid conditions",
        "Rapid spread during cool, wet weather",
        "Entire plant can collapse within days",
      ],
      causes: [
        "Oomycete pathogen Phytophthora infestans",
        "Cool temperatures (10-25°C)",
        "High humidity (>90%)",
        "Extended leaf wetness",
      ],
      treatments: [
        "Apply copper-based fungicide immediately",
        "Remove and destroy ALL infected material",
        "Do NOT compost infected plants",
        "Apply preventive fungicides to healthy plants",
      ],
      prevention: [
        "Plant certified disease-free seed potatoes",
        "Choose resistant varieties",
        "Avoid overhead irrigation",
        "Destroy volunteer plants and cull piles",
      ],
    },
  ],
  tomato: [
    {
      id: "early_blight_tomato",
      name: "Early Blight",
      scientificName: "Alternaria solani",
      severity: "medium",
      symptoms: [
        "Brown to black lesions with concentric rings",
        "Yellowing around lesions",
        "Starts on lower leaves, moves upward",
        "Can affect stems and fruit",
      ],
      causes: [
        "Fungal pathogen Alternaria solani",
        "Warm, humid conditions",
        "Overhead watering",
        "Plant stress",
      ],
      treatments: [
        "Apply fungicides containing chlorothalonil",
        "Remove infected leaves promptly",
        "Stake plants for better air flow",
        "Apply copper-based fungicides",
      ],
      prevention: [
        "Rotate crops for 2-3 years",
        "Use disease-resistant varieties",
        "Mulch around plants",
        "Water at soil level",
      ],
    },
    {
      id: "late_blight_tomato",
      name: "Late Blight",
      scientificName: "Phytophthora infestans",
      severity: "high",
      symptoms: [
        "Large, greasy-looking brown spots",
        "White mold on leaf undersides",
        "Fruit develops brown, firm rot",
        "Rapid plant death",
      ],
      causes: [
        "Oomycete pathogen",
        "Cool, wet weather",
        "Fog or heavy dew",
        "Infected transplants",
      ],
      treatments: [
        "Apply copper fungicide immediately",
        "Remove and bag infected material",
        "Increase plant spacing",
        "Avoid working with wet plants",
      ],
      prevention: [
        "Plant resistant varieties",
        "Ensure good drainage",
        "Avoid crowding plants",
        "Monitor weather conditions",
      ],
    },
    {
      id: "bacterial_spot",
      name: "Bacterial Spot",
      scientificName: "Xanthomonas campestris",
      severity: "medium",
      symptoms: [
        "Small, water-soaked spots on leaves",
        "Spots turn brown with yellow halos",
        "Raised, scab-like spots on fruit",
        "Leaf drop in severe cases",
      ],
      causes: [
        "Bacterial pathogen",
        "Warm, wet conditions",
        "Splashing water",
        "Contaminated seeds",
      ],
      treatments: [
        "Apply copper-based bactericides",
        "Remove heavily infected plants",
        "Avoid overhead watering",
        "Prune for air circulation",
      ],
      prevention: [
        "Use certified disease-free seeds",
        "Practice crop rotation",
        "Sanitize tools and equipment",
        "Avoid working in wet conditions",
      ],
    },
  ],
  pepper: [
    {
      id: "bacterial_spot_pepper",
      name: "Bacterial Spot",
      scientificName: "Xanthomonas euvesicatoria",
      severity: "medium",
      symptoms: [
        "Small, water-soaked lesions on leaves",
        "Lesions become necrotic with yellow margins",
        "Raised, corky spots on fruit",
        "Severe defoliation possible",
      ],
      causes: [
        "Bacterial pathogen Xanthomonas",
        "Warm temperatures (24-30°C)",
        "High humidity",
        "Splashing water",
      ],
      treatments: [
        "Apply copper hydroxide sprays",
        "Remove infected plant parts",
        "Improve air circulation",
        "Avoid overhead irrigation",
      ],
      prevention: [
        "Use pathogen-free seeds and transplants",
        "Rotate crops for 2-3 years",
        "Disinfect tools between plants",
        "Control weeds that may harbor bacteria",
      ],
    },
  ],
};

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(0);
  const crops = ["potato", "tomato", "pepper"];
  const cropIcons = { potato: "🥔", tomato: "🍅", pepper: "🌶️" };

  const currentDiseases = diseaseDatabase[crops[selectedCrop]] || [];
  const filteredDiseases = currentDiseases.filter(
    (disease) =>
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.scientificName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Disease Knowledge Base
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
          Comprehensive guide to crop diseases, symptoms, and treatments
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.1) 100%)",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <BugReport />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  15+
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Diseases Documented
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(100, 181, 246, 0.1) 100%)",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "info.main", width: 56, height: 56 }}>
                <LocalFlorist />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  6
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Crops Supported
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%)",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56 }}>
                <Healing />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  50+
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Treatment Options
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Crop Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search diseases by name or scientific name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "rgba(255,255,255,0.5)" }} />
                </InputAdornment>
              ),
            }}
          />
          <Tabs
            value={selectedCrop}
            onChange={(e, v) => setSelectedCrop(v)}
            sx={{
              "& .MuiTab-root": {
                minWidth: 120,
              },
            }}
          >
            {crops.map((crop, idx) => (
              <Tab
                key={crop}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{cropIcons[crop]}</span>
                    <span>{crop.charAt(0).toUpperCase() + crop.slice(1)}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Disease Cards */}
      <Grid container spacing={3}>
        {filteredDiseases.map((disease) => (
          <Grid item xs={12} key={disease.id}>
            <Accordion
              sx={{
                bgcolor: "rgba(255,255,255,0.02)",
                "&:before": { display: "none" },
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Avatar sx={{ bgcolor: "rgba(255, 152, 0, 0.2)" }}>
                    <BugReport sx={{ color: "warning.main" }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {disease.name}
                      </Typography>
                      <Chip
                        label={disease.severity}
                        size="small"
                        color={getSeverityColor(disease.severity)}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontStyle: "italic",
                      }}
                    >
                      {disease.scientificName}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Symptoms */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(244, 67, 54, 0.1)",
                        border: "1px solid rgba(244, 67, 54, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Warning sx={{ color: "error.main" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Symptoms
                        </Typography>
                      </Box>
                      <List dense>
                        {disease.symptoms.map((symptom, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <ArrowForward
                                sx={{ fontSize: 14, color: "error.main" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={symptom} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>

                  {/* Causes */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(33, 150, 243, 0.1)",
                        border: "1px solid rgba(33, 150, 243, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Science sx={{ color: "info.main" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Causes
                        </Typography>
                      </Box>
                      <List dense>
                        {disease.causes.map((cause, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <ArrowForward
                                sx={{ fontSize: 14, color: "info.main" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={cause} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>

                  {/* Treatment */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(76, 175, 80, 0.1)",
                        border: "1px solid rgba(76, 175, 80, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Healing sx={{ color: "success.main" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Treatment
                        </Typography>
                      </Box>
                      <List dense>
                        {disease.treatments.map((treatment, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle
                                sx={{ fontSize: 14, color: "success.main" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={treatment} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>

                  {/* Prevention */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 152, 0, 0.1)",
                        border: "1px solid rgba(255, 152, 0, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Lightbulb sx={{ color: "warning.main" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Prevention
                        </Typography>
                      </Box>
                      <List dense>
                        {disease.prevention.map((tip, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Info
                                sx={{ fontSize: 14, color: "warning.main" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}

        {filteredDiseases.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <BugReport
                  sx={{ fontSize: 64, color: "rgba(255,255,255,0.1)", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "rgba(255,255,255,0.5)" }}
                >
                  No diseases found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Try a different search term or select another crop
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default KnowledgeBase;

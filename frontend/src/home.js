import { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  CardActionArea,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  Chip,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import Clear from "@material-ui/icons/Clear";
import LocalFloristIcon from "@material-ui/icons/LocalFlorist";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";

const axios = require("axios").default;

// Crop options with icons
const CROPS = [
  { id: "potato", name: "Potato", icon: "🥔" },
  { id: "pepper", name: "Pepper", icon: "🌶️" },
  { id: "tomato", name: "Tomato", icon: "🍅" },
];

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appbar: {
    background: "rgba(26, 26, 46, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
    borderBottom: "1px solid rgba(76, 175, 80, 0.3)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    color: "#4caf50",
    fontSize: "2rem",
  },
  brandName: {
    fontWeight: 700,
    fontSize: "1.5rem",
    background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.5px",
  },
  tagline: {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: "4px",
  },
  mainContainer: {
    minHeight: "calc(100vh - 64px)",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "40px",
    animation: "fadeIn 0.6s ease-out",
  },
  heroTitle: {
    color: "#fff",
    fontSize: "2.5rem",
    fontWeight: 700,
    marginBottom: "16px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.8rem",
    },
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "1.1rem",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  highlight: {
    color: "#4caf50",
    fontWeight: 600,
  },
  cardContainer: {
    maxWidth: "500px",
    width: "100%",
    animation: "fadeIn 0.8s ease-out",
  },
  imageCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4)",
      transform: "translateY(-4px)",
    },
  },
  media: {
    height: 350,
    objectFit: "cover",
  },
  dropzoneContent: {
    padding: "40px 24px",
  },
  resultSection: {
    padding: "24px",
    background: "rgba(255, 255, 255, 0.03)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  resultCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  resultItem: {
    textAlign: "center",
  },
  resultLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.85rem",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  resultValue: {
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  healthyIcon: {
    color: "#4caf50",
  },
  diseaseIcon: {
    color: "#ff9800",
  },
  confidenceBar: {
    marginTop: "16px",
    height: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    background: "linear-gradient(90deg, #4caf50, #8bc34a)",
    borderRadius: "4px",
    transition: "width 0.5s ease-out",
  },
  loaderSection: {
    padding: "40px",
    textAlign: "center",
  },
  loader: {
    color: "#4caf50 !important",
    marginBottom: "16px",
  },
  loaderText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "1rem",
  },
  buttonContainer: {
    marginTop: "24px",
    width: "100%",
    maxWidth: "500px",
  },
  clearButton: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "14px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 500,
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.15)",
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
  },
  featureSection: {
    marginTop: "60px",
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "wrap",
    maxWidth: "800px",
  },
  featureCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    minWidth: "200px",
    flex: "1",
    maxWidth: "250px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    },
  },
  featureIcon: {
    fontSize: "2.5rem",
    marginBottom: "12px",
  },
  featureTitle: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "8px",
  },
  featureDesc: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.85rem",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "40px",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.85rem",
  },
  // Crop Selector Styles
  cropSelectorSection: {
    marginBottom: "32px",
    textAlign: "center",
  },
  cropSelectorLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "1rem",
    marginBottom: "16px",
  },
  cropChipsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  cropChip: {
    padding: "8px 16px",
    fontSize: "1rem",
    background: "rgba(255, 255, 255, 0.1)",
    border: "2px solid transparent",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(76, 175, 80, 0.2)",
      borderColor: "rgba(76, 175, 80, 0.5)",
    },
  },
  cropChipSelected: {
    background: "rgba(76, 175, 80, 0.3)",
    borderColor: "#4caf50",
    boxShadow: "0 0 20px rgba(76, 175, 80, 0.3)",
  },
  cropIcon: {
    fontSize: "1.5rem",
    marginRight: "8px",
  },
  selectedCropBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(76, 175, 80, 0.2)",
    padding: "4px 12px",
    borderRadius: "20px",
    marginTop: "8px",
    color: "#4caf50",
    fontSize: "0.9rem",
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("potato");
  let confidence = 0;

  const sendFile = useCallback(async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("crop", selectedCrop);

      try {
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL,
          data: formData,
        });

        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("API Call Failed:", error);
        alert(
          "Prediction failed. Please check the API server and network connection.",
        );
      }

      setIsloading(false);
    }
  }, [image, selectedFile, selectedCrop]);

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleCropSelect = (cropId) => {
    setSelectedCrop(cropId);
    // Clear previous results when changing crop
    if (data) {
      clearData();
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview, sendFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  const isHealthy = data?.class?.toLowerCase().includes("healthy");

  return (
    <React.Fragment>
      {/* Navigation Bar */}
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Box className={classes.logo}>
            <LocalFloristIcon className={classes.logoIcon} />
            <div>
              <Typography className={classes.brandName}>CropGuard</Typography>
              <Typography className={classes.tagline}>
                AI-Powered Crop Health
              </Typography>
            </div>
          </Box>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" className={classes.mainContainer}>
        {/* Hero Section */}
        <Box className={classes.heroSection}>
          <Typography className={classes.heroTitle}>
            Protect Your Crops with{" "}
            <span className={classes.highlight}>AI</span>
          </Typography>
          <Typography className={classes.heroSubtitle}>
            Upload a photo of your plant leaf and get instant disease detection.
            Helping farmers make informed decisions for healthier harvests.
          </Typography>
        </Box>

        {/* Crop Selector */}
        <Box className={classes.cropSelectorSection}>
          <Typography className={classes.cropSelectorLabel}>
            Select your crop type:
          </Typography>
          <Box className={classes.cropChipsContainer}>
            {CROPS.map((crop) => (
              <Box
                key={crop.id}
                className={`${classes.cropChip} ${
                  selectedCrop === crop.id ? classes.cropChipSelected : ""
                }`}
                onClick={() => handleCropSelect(crop.id)}
              >
                <span className={classes.cropIcon}>{crop.icon}</span>
                {crop.name}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Upload Card */}
        <Box className={classes.cardContainer}>
          <Card className={classes.imageCard}>
            {/* Image Preview */}
            {image && (
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="img"
                  title="Uploaded leaf image"
                />
              </CardActionArea>
            )}

            {/* Dropzone */}
            {!image && (
              <CardContent className={classes.dropzoneContent}>
                <DropzoneArea
                  acceptedFiles={["image/*"]}
                  dropzoneText={`Drag and drop a ${selectedCrop} leaf image here or click to upload`}
                  onChange={onSelectFile}
                  filesLimit={1}
                  showPreviewsInDropzone={false}
                  showAlerts={false}
                />
                <Box className={classes.selectedCropBadge}>
                  {CROPS.find((c) => c.id === selectedCrop)?.icon} Analyzing:{" "}
                  {CROPS.find((c) => c.id === selectedCrop)?.name}
                </Box>
              </CardContent>
            )}

            {/* Results */}
            {data && (
              <Box className={classes.resultSection}>
                <Box className={classes.resultCard}>
                  <Box className={classes.resultItem}>
                    <Typography className={classes.resultLabel}>
                      Diagnosis
                    </Typography>
                    <Typography className={classes.resultValue}>
                      {isHealthy ? (
                        <CheckCircleIcon className={classes.healthyIcon} />
                      ) : (
                        <WarningIcon className={classes.diseaseIcon} />
                      )}
                      {data.class}
                    </Typography>
                  </Box>
                  <Box className={classes.resultItem}>
                    <Typography className={classes.resultLabel}>
                      Confidence
                    </Typography>
                    <Typography className={classes.resultValue}>
                      {confidence}%
                    </Typography>
                  </Box>
                </Box>
                <Box className={classes.confidenceBar}>
                  <Box
                    className={classes.confidenceFill}
                    style={{ width: `${confidence}%` }}
                  />
                </Box>
              </Box>
            )}

            {/* Loading State */}
            {isLoading && (
              <Box className={classes.loaderSection}>
                <CircularProgress size={48} className={classes.loader} />
                <Typography className={classes.loaderText}>
                  Analyzing your image...
                </Typography>
              </Box>
            )}
          </Card>

          {/* Clear Button */}
          {data && (
            <Box className={classes.buttonContainer}>
              <Button
                className={classes.clearButton}
                onClick={clearData}
                startIcon={<Clear />}
              >
                Clear & Upload New Image
              </Button>
            </Box>
          )}
        </Box>

        {/* Feature Cards */}
        {!image && (
          <Box className={classes.featureSection}>
            <Box className={classes.featureCard}>
              <Typography className={classes.featureIcon}>🥔</Typography>
              <Typography className={classes.featureTitle}>
                Potato Diseases
              </Typography>
              <Typography className={classes.featureDesc}>
                Early Blight, Late Blight detection
              </Typography>
            </Box>
            <Box className={classes.featureCard}>
              <Typography className={classes.featureIcon}>🌶️</Typography>
              <Typography className={classes.featureTitle}>
                Pepper Diseases
              </Typography>
              <Typography className={classes.featureDesc}>
                Bacterial Spot identification
              </Typography>
            </Box>
            <Box className={classes.featureCard}>
              <Typography className={classes.featureIcon}>🍅</Typography>
              <Typography className={classes.featureTitle}>
                Tomato Diseases
              </Typography>
              <Typography className={classes.featureDesc}>
                10+ disease types supported
              </Typography>
            </Box>
          </Box>
        )}

        {/* Footer */}
        <Box className={classes.footer}>
          <Typography>🌾 Empowering farmers with AI technology</Typography>
        </Box>
      </Container>
    </React.Fragment>
  );
};

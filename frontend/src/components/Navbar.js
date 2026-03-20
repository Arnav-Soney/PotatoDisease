import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  InputBase,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Translate as TranslateIcon,
  Mic as MicIcon,
} from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  border: "1px solid rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255, 255, 255, 0.5)",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

const Navbar = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [langAnchor, setLangAnchor] = React.useState(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "rgba(10, 15, 26, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            🌱
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CropGuard AI
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.5)" }}
            >
              v2.0 • Production Ready
            </Typography>
          </Box>
        </Box>

        <Search sx={{ ml: 4 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search diseases, crops, treatments..."
            inputProps={{ "aria-label": "search" }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Voice Assistant">
            <IconButton color="inherit" sx={{ color: "rgba(255,255,255,0.7)" }}>
              <MicIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Language">
            <IconButton
              color="inherit"
              sx={{ color: "rgba(255,255,255,0.7)" }}
              onClick={(e) => setLangAnchor(e.currentTarget)}
            >
              <TranslateIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            PaperProps={{
              sx: {
                bgcolor: "rgba(20, 25, 40, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} onClick={() => setLangAnchor(null)}>
                <span style={{ marginRight: 8 }}>{lang.flag}</span>
                {lang.name}
              </MenuItem>
            ))}
          </Menu>

          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ color: "rgba(255,255,255,0.7)" }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Dark Mode">
            <IconButton color="inherit" sx={{ color: "rgba(255,255,255,0.7)" }}>
              <DarkModeIcon />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, bgcolor: "rgba(255,255,255,0.1)" }}
          />

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                fontSize: "0.9rem",
              }}
            >
              JD
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: "rgba(20, 25, 40, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>My Account</MenuItem>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
            <MenuItem>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

// Import section (kept from original)
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  ListItemAvatar,
  Avatar,
  Switch,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  styled,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Autocomplete,
  Paper,
  LinearProgress,
  Alert,
  Snackbar,
} from "@mui/material";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { retrieveSiteSettings, updateSiteSettings, uploadFileChunks } from "src/redux/actions/siteSetting";
import environment from "src/config/environment";
import indonesiaAreas from "./indonesia_area.json"; // Import the Indonesia area data

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

// Constants for file uploads
const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB max video size
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB max image size

function SiteTab() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [previewBackground, setPreviewBackground] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCoverageArea, setSelectedCoverageArea] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [showAlert, setShowAlert] = useState(false);
  
  const siteSetting = useSelector((state) => state.siteSetting);
  const uploadStatus = useSelector((state) => state.siteSetting.uploadStatus || {
    isUploading: false,
    progress: 0,
    error: null
  });
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: "",
    institusi: "",
    url: "",
    alamat: "",
    email: "",
    telp: "",
    fax: "",
    deskripsi: "",
    format_background: "",
    coverage_area: "",
    uuid: ""
  });

  useEffect(() => {
    dispatch(retrieveSiteSettings());
  }, []);

  useEffect(() => {
    if (siteSetting && siteSetting.uuid) {
      setFormData({
        name: siteSetting.name || "",
        institusi: siteSetting.institusi || "",
        url: siteSetting.url || "",
        alamat: siteSetting.alamat || "",
        email: siteSetting.email || "",
        telp: siteSetting.telp || "",
        fax: siteSetting.fax || "",
        deskripsi: siteSetting.deskripsi || "",
        format_background: siteSetting.format_background || "",
        coverage_area: siteSetting.coverage_area || "",
        uuid: siteSetting.uuid || ""
      });

      // Parse the coverage area if it exists
      if (siteSetting.coverage_area) {
        try {
          const parsedCoverageArea = JSON.parse(siteSetting.coverage_area);
          setSelectedCoverageArea(parsedCoverageArea);
        } catch (e) {
          console.error("Error parsing coverage area:", e);
        }
      }
    }
  }, [siteSetting]);

  // Effect to handle upload status changes from Redux store
  useEffect(() => {
    if (uploadStatus.error) {
      showAlertMessage(`Error uploading file: ${uploadStatus.error}`, 'error');
    }
  }, [uploadStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // This function is called when format_background dropdown changes
  const handleFormatChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset the background file selection when format changes
    setSelectedBackground(null);
    setPreviewBackground(null);
  };

  // Handle coverage area selection
  const handleCoverageAreaChange = (event, newValue) => {
    setSelectedCoverageArea(newValue);
    if (newValue) {
      setFormData({
        ...formData,
        coverage_area: JSON.stringify(newValue)
      });
    } else {
      setFormData({
        ...formData,
        coverage_area: ""
      });
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      
      // Validate file is an image
      if (!fileType.startsWith('image/')) {
        showAlertMessage('Please upload an image file for the logo', 'error');
        return;
      }
      
      // Check file size
      if (file.size > MAX_IMAGE_SIZE) {
        showAlertMessage(`Logo file size exceeds the maximum limit of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`, 'error');
        return;
      }
      
      setSelectedImage(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };
  
  const handleIconChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Check if file is .ico or image/x-icon type
      if (fileExtension !== 'ico' && file.type !== 'image/x-icon') {
        showAlertMessage('Please upload an .ico file for the icon', 'error');
        return;
      }
      
      // Check file size
      if (file.size > MAX_IMAGE_SIZE) {
        showAlertMessage(`Icon file size exceeds the maximum limit of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`, 'error');
        return;
      }
      
      setSelectedIcon(file);
      setPreviewIcon(URL.createObjectURL(file));
    }
  };

  const handleBackgroundChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      
      // Validate file based on format_background selection
      if (formData.format_background === 'image' && !fileType.startsWith('image/')) {
        showAlertMessage('Please upload an image file for the background', 'error');
        return;
      }
      
      if (formData.format_background === 'video' && !fileType.startsWith('video/')) {
        showAlertMessage('Please upload a video file for the background', 'error');
        return;
      }
      
      // Check file size limits
      const maxSize = fileType.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      if (file.size > maxSize) {
        const sizeInMB = maxSize / (1024 * 1024);
        showAlertMessage(`File size exceeds the maximum limit of ${sizeInMB}MB`, 'error');
        return;
      }
      
      setSelectedBackground(file);
      setPreviewBackground(URL.createObjectURL(file));
    }
  };

  // Helper function to show alert messages
  const showAlertMessage = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  // Handle alert close
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Handle large background file upload first if needed
      let backgroundFilename = null;
      if (selectedBackground && selectedBackground.size > CHUNK_SIZE) {
        // Use the Redux action instead of local function
        backgroundFilename = await dispatch(uploadFileChunks(
          selectedBackground, 
          "background", 
          siteSetting.uuid
        ));
      }
      
      // Create form data for the regular submission
      const submitFormData = new FormData();
      
      // Add JSON data
      submitFormData.append("data", JSON.stringify(formData));
      
      // Add files that weren't chunked
      if (selectedImage) {
        submitFormData.append("logo", selectedImage);
      }
      
      if (selectedIcon) {
        submitFormData.append("icon", selectedIcon);
      }
      
      // Only append background if it wasn't chunked uploaded
      if (selectedBackground && selectedBackground.size <= CHUNK_SIZE) {
        submitFormData.append("background", selectedBackground);
      }
      
      // Update the site settings
      await dispatch(updateSiteSettings(formData.uuid, submitFormData));
      
      setIsEditing(false);
      setIsSubmitting(false);
      showAlertMessage("Site settings updated successfully", "success");
      
      // Refresh the site settings
      dispatch(retrieveSiteSettings());
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating site settings:", error);
      showAlertMessage(`Error updating site settings: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  const refreshSettings = () => {
    dispatch(retrieveSiteSettings());
  };

  return (
    <Card>
      <CardHeader
        title="Site Settings"
        action={
          isEditing ? (
            <>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={isSubmitting || uploadStatus.isUploading}
                sx={{ mr: 2 }}
              >
                {isSubmitting || uploadStatus.isUploading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  // Reset file selection
                  setSelectedImage(null);
                  setSelectedIcon(null);
                  setSelectedBackground(null);
                  setPreviewLogo(null);
                  setPreviewIcon(null);
                  setPreviewBackground(null);
                }}
                disabled={isSubmitting || uploadStatus.isUploading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<EditTwoToneIcon />}
                onClick={() => setIsEditing(true)}
                sx={{ mr: 2 }}
              >
                Edit Settings
              </Button>
              <IconButton
                onClick={refreshSettings}
                color="primary"
                aria-label="refresh settings"
              >
                <RefreshIcon />
              </IconButton>
            </>
          )
        }
      />
      
      <Divider />
      
      <CardContent>
        {uploadStatus.isUploading && (
          <Box sx={{ width: '100%', mb: 3 }}>
            <Typography variant="body2" color="textSecondary">
              Uploading large file: {Math.round(uploadStatus.progress)}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadStatus.progress} />
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Institution"
                name="institusi"
                value={formData.institusi}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL"
                name="url"
                value={formData.url}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="telp"
                value={formData.telp}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fax"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                id="coverage-area"
                options={indonesiaAreas}
                getOptionLabel={(option) => option.name}
                value={selectedCoverageArea}
                onChange={handleCoverageAreaChange}
                disabled={!isEditing}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Coverage Area"
                    variant={isEditing ? "outlined" : "filled"}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant={isEditing ? "outlined" : "filled"} disabled={!isEditing}>
                <InputLabel>Background Format</InputLabel>
                <Select
                  name="format_background"
                  value={formData.format_background}
                  onChange={handleFormatChange}
                  label="Background Format"
                >
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* File uploads */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Media Files
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            {/* Logo Upload */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Logo
              </Typography>
              
              <Box 
                sx={{ 
                  border: '1px dashed grey', 
                  p: 2, 
                  textAlign: 'center',
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                {previewLogo ? (
                  <img 
                    src={previewLogo} 
                    alt="Logo Preview" 
                    style={{ maxWidth: '100%', maxHeight: 180 }} 
                  />
                ) : siteSetting.logo ? (
                  <img 
                    src={`${environment.api}site-settings/logo`} 
                    alt="Current Logo" 
                    style={{ maxWidth: '100%', maxHeight: 180 }} 
                  />
                ) : (
                  <Typography color="textSecondary">
                    No logo uploaded
                  </Typography>
                )}
              </Box>
              
              {isEditing && (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </Button>
              )}
            </Grid>
            
            {/* Icon Upload */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Icon
              </Typography>
              
              <Box 
                sx={{ 
                  border: '1px dashed grey', 
                  p: 2, 
                  textAlign: 'center',
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                {previewIcon ? (
                  <img 
                    src={previewIcon} 
                    alt="Icon Preview" 
                    style={{ maxWidth: '100%', maxHeight: 180 }} 
                  />
                ) : siteSetting.icon ? (
                  <img 
                    src={`${environment.api}site-settings/icon`} 
                    alt="Current Icon" 
                    style={{ maxWidth: '100%', maxHeight: 180 }} 
                  />
                ) : (
                  <Typography color="textSecondary">
                    No icon uploaded
                  </Typography>
                )}
              </Box>
              
              {isEditing && (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Icon
                  <input
                    type="file"
                    hidden
                    accept=".ico"
                    onChange={handleIconChange}
                  />
                </Button>
              )}
            </Grid>
            
            {/* Background Upload */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Background {formData.format_background ? `(${formData.format_background})` : ""}
              </Typography>
              
              <Box 
                sx={{ 
                  border: '1px dashed grey', 
                  p: 2, 
                  textAlign: 'center',
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                {previewBackground ? (
                  formData.format_background === 'video' ? (
                    <video 
                      src={previewBackground} 
                      controls 
                      style={{ maxWidth: '100%', maxHeight: 180 }} 
                    />
                  ) : (
                    <img 
                      src={previewBackground} 
                      alt="Background Preview" 
                      style={{ maxWidth: '100%', maxHeight: 180 }} 
                    />
                  )
                ) : siteSetting.background ? (
                  formData.format_background === 'video' ? (
                    <video 
                      src={`${environment.api}site-settings/background`} 
                      controls 
                      style={{ maxWidth: '100%', maxHeight: 180 }} 
                    />
                  ) : (
                    <img 
                      src={`${environment.api}site-settings/background`} 
                      alt="Current Background" 
                      style={{ maxWidth: '100%', maxHeight: 180 }} 
                    />
                  )
                ) : (
                  <Typography color="textSecondary">
                    No background uploaded
                  </Typography>
                )}
              </Box>
              
              {isEditing && formData.format_background && (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  disabled={!formData.format_background}
                >
                  Upload Background
                  <input
                    type="file"
                    hidden
                    accept={formData.format_background === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleBackgroundChange}
                  />
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </CardContent>
      
      {/* Alert Snackbar */}
      <Snackbar 
        open={showAlert} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={alertSeverity} 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default SiteTab;
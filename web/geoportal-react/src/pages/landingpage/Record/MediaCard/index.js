import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import MapIcon from "@mui/icons-material/Map";
import GetAppIcon from "@mui/icons-material/GetApp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { NavLink as RouterLink } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import environment from "src/config/environment";

// Styled Components
const RootCard = styled(Card)(({ theme }) => ({
  width: 220,
  margin: 15,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
}));

const MediaWrapper = styled("div")({
  position: "relative",
  width: "100%",
});

const Media = styled(CardMedia)({
  height: 120,
  objectFit: "cover",
});

const DownloadButtonWrapper = styled("div")({
  position: "absolute",
  top: 5,
  right: 5,
  zIndex: 2,
});

const CardBottom = styled(CardActions)({
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#f5fafe", // Soft blue
  padding: "8px",
});

export default function MediaCard({
  row,
  identifier,
  title,
  abstract,
  url,
  setOpen,
}) {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDownloadClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDirectDownload = (event) => {
    event.stopPropagation();
    handleClose();
    
    try {
      // Extract link information from the record
      if (!row?.links) {
        console.error("No links information available");
        return;
      }
      
      const linkParts = row?.links.split(',');
      if (linkParts.length < 4) {
        console.error("Invalid link format");
        return;
      }
      
      const nameLayerPart = linkParts[0];
      const protocol = linkParts[2].trim();
      
      // Get original URL from link parts
      const originalUrl = linkParts[3].trim();
      
      // Extract geoserver URL from original
      const geoserverUrlMatch = originalUrl.match(/(https?:\/\/[^\/]+\/geoserver)/i);
      if (!geoserverUrlMatch) {
        console.error("Could not extract GeoServer URL from:", originalUrl);
        return;
      }
      
      const geoserverUrl = geoserverUrlMatch[1];
      
      // Parse layer info
      const layerInfo = nameLayerPart.includes(':') ? nameLayerPart.split(':') : [null, nameLayerPart];
      const workspace = layerInfo[0];
      const layerName = layerInfo[1];
      
      if (!workspace || !layerName) {
        console.error("Invalid workspace or layer name");
        return;
      }
      
      // Construct download URL based on protocol
      let downloadUrl;
      
      switch (protocol) {
        case 'OGC:WFS':
          downloadUrl = `${geoserverUrl}/${workspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=shape-zip`;
          break;
          
        case 'OGC:WCS':
          downloadUrl = `${geoserverUrl}/${workspace}/ows?service=WCS&version=2.0.1&request=GetCoverage&coverageId=${workspace}:${layerName}&format=geotiff`;
          break;
          
        case 'OGC:WMS':
          // For WMS service, default to WFS download as in your original code
          downloadUrl = `${geoserverUrl}/${workspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=shape-zip`;
          break;
          
        default:
          console.error(`Unsupported protocol: ${protocol}`);
          return;
      }
      
      console.log(`Direct download URL: ${downloadUrl}`);
      
      // Open the download URL in a new tab
      window.open(downloadUrl, '_blank');
      
    } catch (error) {
      console.error("Error processing direct download:", error);
    }
  };

  function shorten(str, maxLen, separator = " ") {
    if (!str) return "";
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + " ...";
  }

  return (
    <RootCard key={identifier}>
      <CardActionArea onClick={() => setOpen(row)}>
        <MediaWrapper>
          <Media
            image={
              url ||
              "https://geoservices.big.go.id/raster/rest/services/IMAGERY/FU_2011_KotaPekanbaru/ImageServer/info/thumbnail"
            }
            title="thumbnail service"
          />
          {row?.dataPublikasi?.is_public && (
            <DownloadButtonWrapper>
              <Tooltip title="Opsi Unduh" arrow>
                <Button
                  size="small"
                  variant="contained"
                  style={{
                    minWidth: "unset",
                    padding: 4,
                    backgroundColor: "rgba(25, 118, 210, 0.7)",
                    color: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                  onClick={handleDownloadClick}
                >
                  <GetAppIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={(e) => e.stopPropagation()}
              >
                {/* <MenuItem 
                  component={RouterLink}
                  to={`${environment.api}record/unduh/${row?.dataPublikasi?.uuid}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Unduh via Server
                </MenuItem> */}
                <MenuItem onClick={handleDirectDownload}>
                  Unduh Langsung (Browser)
                </MenuItem>
              </Menu>
            </DownloadButtonWrapper>
          )}
        </MediaWrapper>

        <CardContent>
          <Typography
            gutterBottom
            variant="body2"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            {identifier || "Identifier"}
          </Typography>
          <Typography
            gutterBottom
            variant="body2"
            color="textPrimary"
            sx={{ fontWeight: 500 }}
          >
            {title || "Title"}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {abstract ? shorten(abstract, 60) : "Abstract"}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardBottom>
        <Button
          size="small"
          color="primary"
          startIcon={<MapIcon />}
          onClick={() => setOpen(row)}
        >
          Lihat detail
        </Button>
      </CardBottom>
    </RootCard>
  );
}
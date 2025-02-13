import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/GetApp";
import MapIcon from "@mui/icons-material/Map";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled } from "@mui/material/styles";

const RootCard = styled(Card)(({ theme }) => ({
  width: 220,
  margin: 15,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const Media = styled(CardMedia)(({ theme }) => ({
  width: 200,
  height: 120,
}));

export default function MediaCard({
  identifier,
  title,
  abstract,
  url,
  produsen,
  download,
  view,
  setOpen,
}) {
  function shorten(str, maxLen, separator = " ") {
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + " ...";
  }

  return (
    <RootCard key={`${identifier} ${title}`}>
      <CardActionArea>
        <Media
          image={
            url ||
            "https://geoservices.big.go.id/raster/rest/services/IMAGERY/FU_2011_KotaPekanbaru/ImageServer/info/thumbnail"
          }
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="body2" color="primary">
            {title || "Title"}
          </Typography>
          <Typography display="block" variant="caption" color="textSecondary">
            {abstract ? shorten(abstract, 60) : "Abstract"}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#eff",
        }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<MapIcon />}
          onClick={() => setOpen(identifier)}
        >
          Lihat detail
        </Button>
      </CardActions>
    </RootCard>
  );
}

import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  styled,
  Avatar,
  Divider,
  alpha,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
} from "@mui/material";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Text from "src/components/Text";
import Chart from "react-apexcharts";

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
  background: ${
    theme.palette.mode === "dark"
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
  };

  img {
    background: ${theme.colors.alpha.trueWhite[100]};
    padding: ${theme.spacing(0.5)};
    display: block;
    border-radius: inherit;
    height: ${theme.spacing(4.5)};
    width: ${theme.spacing(4.5)};
  }
`
);

function AccountBalance() {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
    colors: ["#ff9900", "#1c81c2", "#333", "#5c6ac0"],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${val}%`;
      },
      style: {
        colors: [theme.colors.alpha.trueWhite[100]],
      },
      background: {
        enabled: true,
        foreColor: theme.colors.alpha.trueWhite[100],
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.3,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: theme.colors.alpha.black[70],
          opacity: 0.5,
        },
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5,
      },
    },
    fill: {
      opacity: 1,
    },
    labels: ["Bitcoin", "Ripple", "Cardano", "Ethereum"],
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100],
      },
      show: false,
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
  };

  const chartSeries = [10, 20, 25, 45];

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography
              sx={{
                pb: 3,
              }}
              variant="h4"
            >
              Statistics
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                Data Terunduh
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                1.584 kali
              </Typography>
              <Box
                display="flex"
                sx={{
                  py: 4,
                }}
                alignItems="center"
              >
                <AvatarSuccess
                  sx={{
                    mr: 2,
                  }}
                  variant="rounded"
                >
                  <TrendingUp fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h4">+ 121</Typography>
                  <Typography variant="subtitle2" noWrap>
                    bulan ini
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          sx={{
            position: "relative",
          }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Box
            component="span"
            sx={{
              display: { xs: "none", md: "inline-block" },
            }}
          >
            <Divider absolute orientation="vertical" />
          </Box>
          <Box py={4} pr={4} flex={1}>
            <Grid container spacing={0}>
              <Grid
                xs={12}
                sm={5}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Chart
                  height={250}
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                />
              </Grid>
              <Grid xs={12} sm={7} item display="flex" alignItems="center">
                <List
                  disablePadding
                  sx={{
                    width: "100%",
                  }}
                >
                  <ListItem disableGutters>
                    <ListItemAvatarWrapper>
                      <img
                        alt="BTC"
                        src={
                          process.env.PUBLIC_URL +
                          "/static/images/placeholders/logo/bitcoin.png"
                        }
                      />
                    </ListItemAvatarWrapper>
                    <ListItemText
                      primary="BPKHTL"
                      primaryTypographyProps={{ variant: "h5", noWrap: true }}
                      secondary="Badan Penetapan Kawasan Hutan"
                      secondaryTypographyProps={{
                        variant: "subtitle2",
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        20%
                      </Typography>
                      <Text color="success">+2.54%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatarWrapper>
                      <img
                        alt="XRP"
                        src={
                          process.env.PUBLIC_URL +
                          "/static/images/placeholders/logo/ripple.png"
                        }
                      />
                    </ListItemAvatarWrapper>
                    <ListItemText
                      primary="PRODUSEN DG"
                      primaryTypographyProps={{ variant: "h5", noWrap: true }}
                      secondary="Produsen Data Geospasial"
                      secondaryTypographyProps={{
                        variant: "subtitle2",
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        10%
                      </Typography>
                      <Text color="success">+1.22%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatarWrapper>
                      <img
                        alt="ADA"
                        src={
                          process.env.PUBLIC_URL +
                          "/static/images/placeholders/logo/cardano.png"
                        }
                      />
                    </ListItemAvatarWrapper>
                    <ListItemText
                      primary="EKSTERNAL"
                      primaryTypographyProps={{ variant: "h5", noWrap: true }}
                      secondary="K/L/D "
                      secondaryTypographyProps={{
                        variant: "subtitle2",
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        40%
                      </Typography>
                      <Text color="success">+10.50%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatarWrapper>
                      <img
                        alt="ETH"
                        src={
                          process.env.PUBLIC_URL +
                          "/static/images/placeholders/logo/ethereum.png"
                        }
                      />
                    </ListItemAvatarWrapper>
                    <ListItemText
                      primary="PUBLIKASI"
                      primaryTypographyProps={{ variant: "h5", noWrap: true }}
                      secondary="Publikasi Walidata"
                      secondaryTypographyProps={{
                        variant: "subtitle2",
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        30%
                      </Typography>
                      <Text color="success">+12.38%</Text>
                    </Box>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;

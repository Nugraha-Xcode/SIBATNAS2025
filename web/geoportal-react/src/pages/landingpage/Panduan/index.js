import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import environment from "src/config/environment";
import { useState, useEffect, useRef } from "react";
import TopMenu from "src/components/TopMenu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { retrievePanduanPublic } from "src/redux/actions/panduan";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import BookIcon from "@mui/icons-material/Book";
import InfoIcon from "@mui/icons-material/Info";
import Chip from "@mui/material/Chip";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function Panduan() {
  const dispatch = useDispatch();
  const publicPanduan = useSelector((state) => state.panduan || { publicPanduan: [] });

  const [windowY, setWindowY] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPanduan, setFilteredPanduan] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState("");
  const mainContentRef = useRef(null);
  const sectionsRef = useRef({});

  // Fetch public panduan data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(retrievePanduanPublic());
      } catch (error) {
        console.error("Error fetching panduan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // Filter and sort active panduan by order property
  const activePanduan = [...publicPanduan]
    .filter(item => item.is_active === true)
    .sort((a, b) => a.order - b.order);

  // Calculate estimated reading time
  useEffect(() => {
    const calculateReadingTime = () => {
      const totalWords = activePanduan.reduce((total, item) => {
        const textContent = item.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return total + textContent.split(/\s+/).length;
      }, 0);
      const wordsPerMinute = 200; // Average reading speed
      setEstimatedReadTime(Math.ceil(totalWords / wordsPerMinute));
    };

    if (activePanduan.length > 0) {
      calculateReadingTime();
    }
  }, [activePanduan]);

  // Search functionality
  useEffect(() => {
    const filtered = activePanduan.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPanduan(filtered);
  }, [searchQuery, activePanduan]);

  // Scroll event listener with intersection observer for active section
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setWindowY(currentScrollY);
      setShowScrollToTop(currentScrollY > 100);

      // Calculate reading progress
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrolled = (currentScrollY / (docHeight - winHeight)) * 100;
      setReadingProgress(Math.min(scrolled, 100));
    };

    // Intersection Observer for active section detection
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveMenu(sectionId);
          setCurrentSection(entry.target.querySelector('h3')?.textContent || '');
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionsRef.current).forEach(section => {
      if (section) observer.observe(section);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [filteredPanduan]);

  // Create menu items dynamically from filtered panduan data
  const menuItems = [
    { title: "PANDUAN PENGGUNA", id: "guidelines", isHeader: true },
    ...filteredPanduan.map(item => ({
      title: item.title,
      id: `section-${item.uuid}`,
      isHeader: false,
      uuid: item.uuid
    }))
  ];

  const handleScroll = (id) => {
    if (id === "guidelines") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setActiveMenu(id);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveMenu("guidelines");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
          Memuat panduan...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Panduan Pengguna - Sistem Informasi</title>
        <meta name="description" content="Panduan lengkap untuk menggunakan sistem informasi" />
      </Helmet>

      {/* Reading Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={readingProgress}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          height: 3
        }}
      />

      <Grid container sx={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
        {/* Enhanced Left Menu */}
        <Grid item xs={12} md={3} id="sidebar">
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              bgcolor: "#1a1d29",
              borderRadius: 0,
              color: "white",
              overflowY: "auto",
              position: "relative",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#0f1419",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#3b82f6",
                borderRadius: "3px",
              },
            }}
          >
            {/* Header with Search */}
            <Box sx={{ p: 3, borderBottom: "1px solid #374151" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BookIcon sx={{ mr: 1, color: "#3b82f6" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Panduan Pengguna
                </Typography>
              </Box>

              {/* Search Box */}
              <Paper
                component="form"
                sx={{
                  p: '2px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#374151',
                  color: 'white',
                  boxShadow: 'none',
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1, color: 'white' }}
                  placeholder="Cari panduan..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <IconButton type="button" sx={{ p: '10px', color: 'white' }}>
                  <SearchIcon />
                </IconButton>
              </Paper>

              {/* Search Results Info */}
              {searchQuery && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`${filteredPanduan.length} hasil ditemukan`}
                    size="small"
                    sx={{ bgcolor: '#3b82f6', color: 'white' }}
                    onDelete={clearSearch}
                  />
                </Box>
              )}

              {/* Reading Info */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1, fontSize: '16px', color: '#3b82f6' }} />
                <Typography variant="caption" sx={{ opacity: 0.8, color: 'white' }}>
                  Estimasi baca: {estimatedReadTime} menit
                </Typography>
              </Box>
            </Box>

            {/* Menu Items */}
            <List sx={{ px: 2, py: 1 }}>
              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  disablePadding
                  sx={{
                    mb: 0.5,
                    borderRadius: 1,
                    bgcolor: item.isHeader ? "transparent" :
                      activeMenu === item.id ? "#3b82f6" : "transparent",
                    "&:hover": {
                      bgcolor: !item.isHeader && "#374151",
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {item.isHeader ? (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        pl: 2,
                        py: 1,
                        "& .MuiListItemText-primary": {
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          color: "#60a5fa",
                        },
                      }}
                    />
                  ) : (
                    <Tooltip title={item.title} placement="right" arrow>
                      <ListItemButton
                        onClick={() => handleScroll(item.id)}
                        sx={{
                          pl: 3,
                          py: 1,
                          borderRadius: 1,
                          "&:hover": {
                            bgcolor: "#374151",
                          },
                        }}
                      >
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            sx: {
                              fontSize: "0.85rem",
                              fontWeight: activeMenu === item.id ? "bold" : "normal",
                            }
                          }}
                        />
                      </ListItemButton>
                    </Tooltip>
                  )}
                </ListItem>
              ))}

              {/* Scroll to Top Menu Item */}
              {showScrollToTop && (
                <Fade in={showScrollToTop}>
                  <ListItem
                    disablePadding
                    sx={{
                      mt: 2,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemButton
                      onClick={handleScrollToTop}
                      sx={{
                        pl: 2,
                        py: 1,
                        bgcolor: "#111827",
                        borderRadius: 1,
                        "&:hover": {
                          bgcolor: "#374151",
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <ListItemText
                        primary="Kembali ke Atas"
                        primaryTypographyProps={{
                          sx: {
                            color: 'white',
                            fontWeight: 'medium',
                            fontSize: '0.85rem',
                          }
                        }}
                      />
                      <ArrowUpwardIcon sx={{ color: 'white', fontSize: '18px' }} />
                    </ListItemButton>
                  </ListItem>
                </Fade>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Enhanced Main Content */}
        <Grid item xs={12} md={9}>
          <Box
            ref={mainContentRef}
            sx={{
              height: '100%',
              overflowY: 'auto',
              bgcolor: '#ffffff',
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "4px",
              },
            }}
          >
            {/* Breadcrumbs */}
            <Box sx={{ p: 3, pb: 1, bgcolor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                  <BookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  Beranda
                </Link>
                <Typography color="text.primary">Panduan Pengguna</Typography>
                {currentSection && (
                  <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>
                    {currentSection}
                  </Typography>
                )}
              </Breadcrumbs>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* Header Section */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    mb: 2
                  }}
                >
                  Panduan Pengguna
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#666',
                    mb: 3,
                    maxWidth: '600px',
                    mx: 'auto'
                  }}
                >
                  Temukan panduan lengkap untuk menggunakan sistem dengan mudah dan efisien
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<BookIcon />}
                    label={`${activePanduan.length} Panduan`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<InfoIcon />}
                    label={`${estimatedReadTime} menit baca`}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Content */}
              {filteredPanduan.length === 0 ? (
                <Alert severity="info" sx={{ mt: 4 }}>
                  <AlertTitle>Informasi</AlertTitle>
                  {searchQuery ?
                    `Tidak ada panduan yang sesuai dengan pencarian "${searchQuery}".` :
                    "Tidak ada panduan yang tersedia saat ini."
                  }
                </Alert>
              ) : (
                filteredPanduan.map((item, index) => (
                  <Fade in={true} timeout={300 + index * 100} key={item.uuid}>
                    <section
                      id={`section-${item.uuid}`}
                      ref={el => sectionsRef.current[item.uuid] = el}
                      style={{ marginBottom: '3rem' }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 4,
                          mb: 3,
                          borderLeft: '4px solid #3b82f6',
                          "&:hover": {
                            boxShadow: 4,
                          },
                          transition: 'box-shadow 0.3s ease',
                        }}
                      >
                        <Typography
                          variant="h3"
                          component="h2"
                          gutterBottom
                          sx={{
                            color: '#1f2937',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #e9ecef',
                            pb: 2,
                            mb: 3
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            fontSize: "1rem",
                            lineHeight: 1.7,
                            color: '#333',
                            '& p': { mb: 2 },
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                              color: '#1f2937',
                              fontWeight: 'bold',
                              mt: 3,
                              mb: 2,
                            },
                            '& ul, & ol': {
                              pl: 3,
                              mb: 2,
                            },
                            '& li': {
                              mb: 1,
                            },
                            '& img': {
                              maxWidth: '100%',
                              height: 'auto',
                              borderRadius: 1,
                              boxShadow: 2,
                              my: 2,
                            },
                            '& code': {
                              bgcolor: '#f8f9fa',
                              p: 0.5,
                              borderRadius: 0.5,
                              fontFamily: 'monospace',
                            },
                            '& pre': {
                              bgcolor: '#f8f9fa',
                              p: 2,
                              borderRadius: 1,
                              overflow: 'auto',
                            },
                          }}
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </Paper>
                    </section>
                  </Fade>
                ))
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Panduan;
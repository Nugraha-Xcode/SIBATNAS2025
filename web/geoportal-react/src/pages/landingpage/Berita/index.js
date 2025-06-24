import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
  Alert,
  Stack,
  Paper,
  IconButton,
  Fade
} from "@mui/material";
import {
  CalendarToday,
  ReadMore,
  Article,
  ChevronLeft,
  ChevronRight,
  PlayArrow,
  Pause
} from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import { retrieveBeritaPublic } from "src/redux/actions/berita";
import { useNavigate } from "react-router-dom";

function BeritaPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const beritaList = useSelector((state) => state.berita || []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(retrieveBeritaPublic());
      } catch (error) {
        console.error("Error fetching berita:", error);
        setError("Gagal memuat berita. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Auto slide effect
  useEffect(() => {
    if (!isAutoPlay || beritaList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % beritaList.length);
    }, 5000); // 5 detik

    return () => clearInterval(interval);
  }, [isAutoPlay, beritaList.length]);

  // Helper functions
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return "";
    const cleanContent = content.replace(/<[^>]*>/g, '');
    if (cleanContent.length <= maxLength) return cleanContent;
    return cleanContent.substring(0, maxLength) + "...";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x400?text=No+Image";

    if (imagePath.startsWith('http')) return imagePath;

    const baseUrl = process.env.REACT_APP_API_URL;
    return imagePath.startsWith('/api/')
      ? `${baseUrl}${imagePath}`
      : `${baseUrl}/api/berita/image/${imagePath.split('/').pop()}`;
  };

  // Carousel functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % beritaList.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + beritaList.length) % beritaList.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleReadMore = (uuid) => {
    navigate(`/berita/${uuid}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Memuat berita...
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Muat Ulang
          </Button>
        </Box>
      </Container>
    );
  }

  if (beritaList.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">
          Belum ada berita yang dipublikasikan.
        </Alert>
      </Container>
    );
  }

  const currentBerita = beritaList[currentSlide];
  const otherBerita = beritaList.filter((_, index) => index !== currentSlide);

  return (
    <>
      <Helmet>
        <title>Berita Terkini - Batimetri Nasional</title>
        <meta name="description" content="Berita dan informasi terbaru seputar Batimetri Nasional dan kegiatan Badan Informasi Geospasial" />
      </Helmet>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            <Article sx={{ mr: 2, fontSize: 'inherit' }} />
            Berita Terkini
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Informasi dan berita terbaru seputar Batimetri Nasional
          </Typography>
        </Box>

        {/* Container Atas - Carousel dan List Berita */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    Berita Utama
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={toggleAutoPlay}
                      color={isAutoPlay ? "primary" : "default"}
                      size="small"
                    >
                      {isAutoPlay ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton
                      onClick={prevSlide}
                      disabled={beritaList.length <= 1}
                      size="small"
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={nextSlide}
                      disabled={beritaList.length <= 1}
                      size="small"
                    >
                      <ChevronRight />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Single Carousel Item */}
                <Fade in={true} timeout={500} key={currentSlide}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 8
                      }
                    }}
                    onClick={() => handleReadMore(currentBerita.uuid)}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(currentBerita.gambar)}
                      alt={currentBerita.judul}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Chip
                        label={currentBerita.kategori}
                        color="primary"
                        sx={{ mb: 2 }}
                      />
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 'bold',
                          lineHeight: 1.3,
                          mb: 2
                        }}
                      >
                        {currentBerita.judul}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(currentBerita.createdAt)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                        sx={{ lineHeight: 1.6 }}
                      >
                        {truncateContent(currentBerita.konten, 200)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>

                {/* Slide Indicators */}
                {beritaList.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                    {beritaList.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => goToSlide(index)}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: index === currentSlide ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            transform: 'scale(1.2)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Side - List Berita Lainnya */}
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
                Berita Lainnya
              </Typography>
              <Box sx={{ maxHeight: '420px', overflowY: 'auto', pr: 1 }}>
                {otherBerita.length > 0 ? (
                  otherBerita.map((berita) => (
                    <Card
                      key={berita.uuid}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'grey.50',
                          transform: 'translateX(4px)'
                        }
                      }}
                      onClick={() => handleReadMore(berita.uuid)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography
                          variant="subtitle2"
                          component="h3"
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: 1.3,
                            mb: 1,
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                          }}
                        >
                          {berita.judul}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(berita.createdAt)}
                            </Typography>
                          </Box>
                          <Chip
                            label={berita.kategori}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography color="text.secondary" variant="body2" textAlign="center" sx={{ mt: 4 }}>
                    Tidak ada berita lainnya
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Container Bawah - Daftar Semua Berita dengan Judul dan Deskripsi */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Semua Berita
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Jelajahi semua berita dan informasi terbaru
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {beritaList.map((berita, index) => (
              <Grid item xs={12} sm={6} md={4} key={berita.uuid}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleReadMore(berita.uuid)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={berita.kategori}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {index === currentSlide && (
                        <Chip
                          label="Sedang Ditampilkan"
                          size="small"
                          color="success"
                          variant="filled"
                        />
                      )}
                    </Stack>

                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 'bold',
                        lineHeight: 1.3,
                        mb: 2,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        minHeight: '3.2em'
                      }}
                    >
                      {berita.judul}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(berita.createdAt)}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        mb: 3,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        minHeight: '4.8em'
                      }}
                    >
                      {truncateContent(berita.konten, 150)}
                    </Typography>

                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ReadMore />}
                      fullWidth
                      sx={{ mt: 'auto' }}
                    >
                      Lihat Selengkapnya
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* View All Button */}
          {beritaList.length > 6 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  // Scroll to top untuk melihat carousel
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Lihat Semua di Carousel
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default BeritaPage;

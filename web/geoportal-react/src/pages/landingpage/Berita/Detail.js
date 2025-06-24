import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  Divider, 
  CircularProgress,
  Button,
  Chip,
  Alert,
  Paper,
  Stack,
  Breadcrumbs,
  Link
} from "@mui/material";
import { 
  CalendarToday, 
  Category, 
  ArrowBack,
  Share,
  Print,
  Article,
  Home
} from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import Service from "src/services/berita.service";

function BeritaDetailPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!uuid) {
        setError("UUID berita tidak valid");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Gunakan endpoint public detail yang baru
        const response = await Service.getPublic(uuid);
        setBerita(response.data);
      } catch (error) {
        console.error("Error fetching berita detail:", error);
        if (error.response?.status === 404) {
          setError("Berita tidak ditemukan");
        } else {
          setError("Gagal memuat detail berita. Silakan coba lagi nanti.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) return imagePath;
    
    const baseUrl = process.env.REACT_APP_API_URL || 'http://10.10.171.9:8080';
    return imagePath.startsWith('/api/') 
      ? `${baseUrl}${imagePath}` 
      : `${baseUrl}/api/berita/image/${imagePath.split('/').pop()}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: berita.judul,
      text: berita.judul,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link berhasil disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/berita');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Memuat detail berita...
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
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Kembali ke Daftar Berita
          </Button>
        </Box>
      </Container>
    );
  }

  if (!berita) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Berita tidak ditemukan
        </Alert>
        <Box textAlign="center">
          <Button 
            variant="contained" 
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Kembali ke Daftar Berita
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{berita.judul} - Batimetri Nasional</title>
        <meta name="description" content={berita.konten?.replace(/<[^>]*>/g, '').substring(0, 155)} />
        <meta property="og:title" content={berita.judul} />
        <meta property="og:description" content={berita.konten?.replace(/<[^>]*>/g, '').substring(0, 155)} />
        {getImageUrl(berita.gambar) && (
          <meta property="og:image" content={getImageUrl(berita.gambar)} />
        )}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link 
            color="inherit" 
            href="/" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5, fontSize: 20 }} />
            Beranda
          </Link>
          <Link 
            color="inherit" 
            onClick={handleBack}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Article sx={{ mr: 0.5, fontSize: 20 }} />
            Berita
          </Link>
          <Typography color="text.primary">
            {berita.judul.length > 50 ? berita.judul.substring(0, 50) + '...' : berita.judul}
          </Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: 'grey.50' }}>
          {berita.kategori && (
            <Chip
              label={berita.kategori}
              color="primary"
              icon={<Category />}
              sx={{ mb: 3 }}
            />
          )}

          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              lineHeight: 1.2,
              color: 'text.primary'
            }}
          >
            {berita.judul}
          </Typography>

          {/* Meta Information */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(berita.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              variant="outlined"
              size="small"
            >
              Kembali
            </Button>
            <Button
              onClick={handleShare}
              startIcon={<Share />}
              variant="outlined"
              size="small"
            >
              Bagikan
            </Button>
            <Button
              onClick={handlePrint}
              startIcon={<Print />}
              variant="outlined"
              size="small"
            >
              Cetak
            </Button>
          </Stack>
        </Paper>

        {/* Featured Image */}
        {getImageUrl(berita.gambar) && (
          <Box sx={{ mb: 4 }}>
            <Card elevation={2}>
              <CardMedia
                component="img"
                image={getImageUrl(berita.gambar)}
                alt={berita.judul}
                sx={{ 
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Card>
          </Box>
        )}

        {/* Content */}
        <Paper elevation={1} sx={{ p: 4 }}>
          <Box 
            sx={{ 
              "& img": { 
                maxWidth: "100%", 
                height: "auto",
                borderRadius: 1,
                boxShadow: 1,
                margin: '16px 0'
              },
              "& iframe": { 
                maxWidth: "100%",
                borderRadius: 1
              },
              "& p": {
                marginBottom: 2,
                lineHeight: 1.8,
                fontSize: '1.1rem'
              },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                marginTop: 3,
                marginBottom: 2,
                fontWeight: 'bold'
              },
              "& ul, & ol": {
                marginBottom: 2,
                paddingLeft: 3
              },
              "& li": {
                marginBottom: 1
              },
              "& blockquote": {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                paddingLeft: 2,
                marginLeft: 0,
                marginRight: 0,
                fontStyle: 'italic',
                backgroundColor: 'grey.50',
                padding: 2,
                borderRadius: 1
              },
              "& a": {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: berita.konten }}
          />
        </Paper>

        {/* Footer Section */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Artikel ini dipublikasikan pada {formatDate(berita.createdAt)}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button
              onClick={handleBack}
              variant="contained"
              startIcon={<ArrowBack />}
            >
              Kembali ke Daftar Berita
            </Button>
            <Button
              onClick={handleShare}
              variant="outlined"
              startIcon={<Share />}
            >
              Bagikan Artikel
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default BeritaDetailPage;

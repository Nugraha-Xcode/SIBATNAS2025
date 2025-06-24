// src/components/VisitorStats.js - Fixed import path
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  styled,
  Tooltip,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// PERBAIKAN: Sesuaikan path dengan struktur folder Anda
// Jika visitor.js belum ada, comment dulu import ini
import {
  fetchVisitorStats,
  recordVisitor,
  clearVisitorError
} from '../../redux/actions/visitor';

const StatsContainer = styled(Box)(({ theme }) => `
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: ${theme.spacing(1)} ${theme.spacing(2)};
  border-radius: 0;
  margin-bottom: 0;
  box-shadow: none;
  width: 100%;
  height: auto;
  min-height: 50px;
  position: relative;
`);

const StatItem = styled(Box)(({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${theme.spacing(1.5)};
`);

const StatValue = styled(Typography)(({ theme }) => `
  font-weight: bold;
  font-size: 0.9rem;
  color: ${theme.palette.primary.main};
  min-width: 40px;
  text-align: center;
`);

const StatLabel = styled(Typography)(({ theme }) => `
  font-size: 0.7rem;
  color: ${theme.palette.text.secondary};
  text-align: center;
`);

const DividerVertical = styled(Box)(({ theme }) => `
  height: 30px;
  width: 1px;
  background-color: ${theme.palette.divider};
`);

const ContactInfo = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`);

const SocialIcons = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.5)};
  margin-left: ${theme.spacing(1)};
`);

const RefreshButton = styled(IconButton)(({ theme }) => `
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 2px;
`);

const LoadingOverlay = styled(Box)(({ theme }) => `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
`);

function VisitorStats() {
  const dispatch = useDispatch();

  // Menggunakan optional chaining untuk handle jika visitor reducer belum ada
  const stats = useSelector((state) => state.visitor?.stats || {
    visitorsToday: 214,
    visitorsThisMonth: 197491,
    downloadsToday: 1,
    downloadsThisMonth: 638
  });
  const loading = useSelector((state) => state.visitor?.loading || false);
  const error = useSelector((state) => state.visitor?.error || null);
  const lastUpdated = useSelector((state) => state.visitor?.lastUpdated || null);

  // Format numbers for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  // Record visitor on component mount
  useEffect(() => {
    try {
      dispatch(recordVisitor(window.location.pathname));
      dispatch(fetchVisitorStats());
    } catch (error) {
      console.warn('Visitor tracking not available:', error);
    }
  }, [dispatch]);

  // Auto refresh stats every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        dispatch(fetchVisitorStats());
      } catch (error) {
        console.warn('Auto refresh failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        try {
          dispatch(clearVisitorError());
        } catch (err) {
          console.warn('Clear error failed:', err);
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRefresh = useCallback(() => {
    try {
      dispatch(fetchVisitorStats());
    } catch (error) {
      console.warn('Manual refresh failed:', error);
    }
  }, [dispatch]);

  // Show error state in console (tidak mengganggu UI)
  if (error) {
    console.error('Visitor stats error:', error);
  }

  // Format last updated time
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Tidak pernah';

    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <StatsContainer>
      {loading && (
        <LoadingOverlay>
          <CircularProgress size={20} />
        </LoadingOverlay>
      )}

      <Tooltip
        title={`Terakhir diperbarui: ${formatLastUpdated(lastUpdated)}`}
        arrow
      >
        <RefreshButton
          size="small"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshIcon fontSize="small" />
        </RefreshButton>
      </Tooltip>

      <StatItem>
        <StatValue>{formatNumber(stats?.visitorsToday)}</StatValue>
        <StatLabel>Pengunjung (hari ini)</StatLabel>
      </StatItem>

      <StatItem>
        <StatValue>{formatNumber(stats?.visitorsThisMonth)}</StatValue>
        <StatLabel>Pengunjung (bulan ini)</StatLabel>
      </StatItem>

      <DividerVertical />

      <StatItem>
        <StatValue>{formatNumber(stats?.downloadsToday)}</StatValue>
        <StatLabel>Download (hari ini)</StatLabel>
      </StatItem>

      <StatItem>
        <StatValue>{formatNumber(stats?.downloadsThisMonth)}</StatValue>
        <StatLabel>Download (bulan ini)</StatLabel>
      </StatItem>

      <DividerVertical />

      <ContactInfo>
        <PhoneIcon fontSize="small" color="primary" />
        <StatValue>021-87801255</StatValue>
      </ContactInfo>

      <DividerVertical />

      <SocialIcons>
        <Tooltip title="Instagram" arrow>
          <IconButton
            size="small"
            color="primary"
            component="a"
            href="https://instagram.com/your-account"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Twitter" arrow>
          <IconButton
            size="small"
            color="primary"
            component="a"
            href="https://twitter.com/your-account"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="YouTube" arrow>
          <IconButton
            size="small"
            color="primary"
            component="a"
            href="https://youtube.com/your-channel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YouTubeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </SocialIcons>
    </StatsContainer>
  );
}

export default VisitorStats;
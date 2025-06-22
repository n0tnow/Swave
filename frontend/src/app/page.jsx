'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Threads } from './components/Threads';
import walletService from './lib/walletService';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
  useScrollTrigger,
  Slide
} from '@mui/material';
import {
  RocketLaunch as RocketIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  ExitToApp as DisconnectIcon,
  Explore as ExploreIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as MagicIcon,
  Waves as WavesIcon,
  FlashOn as FlashIcon,
  Timeline as TimelineIcon,
  AccountBalance as BalanceIcon,
  SwapHoriz as SwapIcon,
  Launch as LaunchIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import GlowingGridDemo from './components/GlowingGridDemo';
import StarBorderButton from './components/StarBorderButton';
import DataService from './lib/dataService';

// Enhanced Dark Background with better animation visibility
const EnhancedDarkBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          background: '#000000',
        }}
      />
    );
  }

  return (
    <>
      {/* Deep Black Base */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          background: `
            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
            #000000
          `,
        }}
      />
      
      {/* Enhanced Threads Animation */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: 0.8, // Increased opacity for better visibility
        }}
      >
        <Threads
          amplitude={0.8}
          distance={0.2}
          enableMouseInteraction={true}
          color={[0.4, 0.49, 0.91]}
          sx={{ width: '100%', height: '100%' }}
        />
      </Box>
    </>
  );
};

// Enhanced Wallet Connection Component
const WalletConnection = () => {
  const [walletStatus, setWalletStatus] = useState({
    isConnected: false,
    wallet: null,
    address: null,
    balance: null
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const status = walletService.getConnectionStatus();
    setWalletStatus(status);

    const unsubscribe = walletService.onConnectionChange((event) => {
      if (event.type === 'connected') {
        setWalletStatus({
          isConnected: true,
          wallet: event.wallet,
          address: event.address,
          balance: event.balance
        });
        setNotification({
          open: true,
          message: `Connected to ${event.wallet.name}`,
          severity: 'success'
        });
      } else if (event.type === 'disconnected') {
        setWalletStatus({
          isConnected: false,
          wallet: null,
          address: null,
          balance: null
        });
        setNotification({
          open: true,
          message: 'Wallet disconnected',
          severity: 'info'
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const result = await walletService.connectWallet();
      
      // If result is null, user cancelled the connection
      if (result === null) {
        console.log('ℹ️ User cancelled wallet connection');
        return;
      }
      
      // Connection successful
      console.log('✅ Wallet connected successfully');
    } catch (error) {
      console.error('Connection failed:', error);
      
      // Show error notification for real errors
      setNotification({
        open: true,
        message: error.message || 'Failed to connect wallet',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
    setAnchorEl(null);
  };

  const handleCopyAddress = () => {
    if (walletStatus.address) {
      navigator.clipboard.writeText(walletStatus.address);
      setNotification({
        open: true,
        message: 'Address copied to clipboard',
        severity: 'success'
      });
    }
    setAnchorEl(null);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    if (!balance || !balance.xlm) return '0 XLM';
    return `${balance.xlm.toFixed(2)} XLM`;
  };

  return (
    <>
      {walletStatus.isConnected ? (
        <>
          <StarBorderButton
            startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: '#667eea', fontSize: '0.8rem' }}>
              {walletStatus.wallet?.name?.[0] || 'W'}
            </Avatar>}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            color="#667eea"
            speed="3s"
            variant="outlined"
          >
            {formatAddress(walletStatus.address)}
          </StarBorderButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: 2,
                mt: 1,
                minWidth: 200,
              }
            }}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <WalletIcon sx={{ color: '#667eea' }} />
              </ListItemIcon>
              <ListItemText 
                primary={walletStatus.wallet?.name}
                secondary={formatBalance(walletStatus.balance)}
                sx={{ 
                  color: 'white',
                  '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.6)' }
                }}
              />
            </MenuItem>
            
            <Divider sx={{ bgcolor: 'rgba(102, 126, 234, 0.2)' }} />
            
            <MenuItem onClick={handleCopyAddress}>
              <ListItemIcon>
                <CopyIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Copy Address" sx={{ color: 'white' }} />
            </MenuItem>
            
            <MenuItem onClick={handleDisconnect}>
              <ListItemIcon>
                <DisconnectIcon sx={{ color: '#f44336' }} />
              </ListItemIcon>
              <ListItemText primary="Disconnect" sx={{ color: '#f44336' }} />
            </MenuItem>
          </Menu>
        </>
      ) : (
        <StarBorderButton
          startIcon={<WalletIcon />}
          onClick={handleConnectWallet}
          disabled={loading}
          color="#667eea"
          speed="4s"
          variant="contained"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </StarBorderButton>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            color: 'white'
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Real-time Stats Section with Live Data
const StatsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [platformStats, cryptoStats] = await Promise.all([
          DataService.getPlatformStats(),
          DataService.getCryptoData()
        ]);
        setStats(platformStats);
        setCryptoData(cryptoStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Update every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  const statsData = [
    {
      value: stats?.totalVolume || '$2.4B',
      label: 'Total Volume',
      icon: <AnalyticsIcon sx={{ fontSize: 28 }} />,
      color: '#667eea',
      realTime: true
    },
    {
      value: stats?.totalUsers || '125K+',
      label: 'Active Users',
      icon: <MagicIcon sx={{ fontSize: 28 }} />,
      color: '#f093fb',
      realTime: true
    },
    {
      value: stats?.totalTransactions || '890K+',
      label: 'Total Swaps',
      icon: <FlashIcon sx={{ fontSize: 28 }} />,
      color: '#764ba2',
      realTime: true
    },
    {
      value: stats?.activePools || 200,
      label: 'Liquidity Pools',
      icon: <SecurityIcon sx={{ fontSize: 28 }} />,
      color: '#4facfe',
      realTime: true
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      {/* Live XLM Price Banner */}
      {cryptoData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%)',
              border: '1px solid rgba(102,126,234,0.3)',
              borderRadius: 3,
              p: { xs: 2, sm: 2.5 },
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1.5, sm: 2 },
              flexWrap: 'wrap',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            <Typography 
              variant="body1" 
              color="white" 
              fontWeight={600}
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              XLM Price:
            </Typography>
            <Typography 
              variant="h6" 
              color="#667eea" 
              fontWeight={700}
              sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' } }}
            >
              ${cryptoData.stellar.price.toFixed(4)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {cryptoData.stellar.change24h >= 0 ? (
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />
              ) : (
                <TrendingDownIcon sx={{ color: '#f44336', fontSize: 20 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: cryptoData.stellar.change24h >= 0 ? '#4caf50' : '#f44336',
                  fontWeight: 600
                }}
              >
                {cryptoData.stellar.change24h >= 0 ? '+' : ''}{cryptoData.stellar.change24h.toFixed(2)}%
              </Typography>
            </Box>
            <Typography variant="caption" color="rgba(255,255,255,0.6)">
              24h change
            </Typography>
          </Box>
        </motion.div>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3,
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
                          <Card
                sx={{
                  height: 200, // Fixed height for consistency
                  minHeight: 200,
                  maxHeight: 200,
                  background: 'transparent',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${stat.color}20`,
                  borderRadius: 3,
                  p: 2.5,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                  },
                  '&:hover': {
                    border: `1px solid ${stat.color}40`,
                    boxShadow: `0 8px 32px ${stat.color}15`,
                    transform: 'translateY(-4px)',
                    background: `${stat.color}05`,
                  }
                }}
              >
              <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}20`,
                    color: stat.color,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1.5
                  }}
                >
                  {stat.icon}
                </Avatar>
                
                                <Typography 
                  variant="h5" 
                  fontWeight={700} 
                  color="white"
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' }, mb: 1 }}
                >
                  {stat.value}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="rgba(255,255,255,0.8)"
                  sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                >
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default function HomePage() {
  return (
    <>
      <EnhancedDarkBackground />
      
      {/* Enhanced Navigation Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(8px)',
          border: 'none',
          transition: 'all 0.2s ease',
          background: 'rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          py: { xs: 0.5, sm: 1 }, 
          px: { xs: 2, sm: 3 }, 
          minHeight: { xs: '56px !important', sm: '60px !important' }
        }}>
          {/* Left Side - Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, cursor: 'pointer' }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <RocketIcon 
                  sx={{ 
                    color: '#667eea', 
                    fontSize: { xs: 24, sm: 28, md: 32 },
                    filter: 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))',
                    transition: 'all 0.3s ease'
                  }} 
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #f093fb 50%, #667eea 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    '@keyframes gradientShift': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' }
                    }
                  }}
                >
                  Swave
                </Typography>
              </motion.div>
            </Box>
          </Link>
          
          {/* Center - Transparent Navigation Icons */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: { md: 2, lg: 3 },
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            {[
              { icon: <ExploreIcon />, label: 'Explore', color: '#8b9dc3', href: '/explore' },
              { icon: <AnalyticsIcon />, label: 'Analytics', color: '#9bb5c7', href: '/analytics' },
              { icon: <SwapIcon />, label: 'Swap', color: '#a8c2ca', href: '/swap' }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Box
                  component={item.href ? Link : 'div'}
                  href={item.href}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    width: { md: 40, lg: 'auto', xl: 'auto' },
                    height: { md: 40, lg: 40, xl: 44 },
                    borderRadius: { md: '50%', lg: '12px' },
                    transition: 'all 0.3s ease',
                    background: 'transparent',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    px: { md: 0, lg: 1.5, xl: 2 },
                    py: { md: 0, lg: 1, xl: 1 },
                    gap: { lg: 0.5, xl: 1 },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'left 0.6s ease',
                      zIndex: 1,
                    },
                    '&:hover': {
                      background: `${item.color}15`,
                      transform: 'translateY(-2px)',
                      '&::before': {
                        left: '100%',
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: item.color,
                      fontSize: { md: 18, lg: 20 },
                      transition: 'all 0.3s ease',
                      filter: `drop-shadow(0 0 4px ${item.color}60)`,
                      zIndex: 2,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                  
                  {/* Show text on larger screens */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: item.color,
                      fontSize: { lg: '0.8rem', xl: '0.85rem' },
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      textShadow: `0 0 6px ${item.color}40`,
                      zIndex: 2,
                      position: 'relative',
                      display: { xs: 'none', md: 'none', lg: 'block' },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
          
          {/* Right Side - Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <WalletConnection />
          </motion.div>
        </Toolbar>
      </AppBar>
      
      {/* Section 1: Hero/Landing - Full Screen */}
      <Box 
        component="section"
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg" sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Animated Swave Logo */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 2,
              ease: "easeOut",
              type: "spring",
              damping: 12
            }}
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.05, 1],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <RocketIcon 
                sx={{ 
                  fontSize: { xs: 60, sm: 80, md: 100 }, 
                  color: '#667eea',
                  filter: 'drop-shadow(0 0 40px rgba(102, 126, 234, 0.8))',
                  mb: { xs: 2, md: 3 },
                }} 
              />
            </motion.div>
          </motion.div>

          {/* Swave Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{
                fontSize: { xs: '2.5rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
                fontWeight: 900,
                lineHeight: 0.9,
                mb: { xs: 2, md: 3 },
                background: 'linear-gradient(45deg, #ffffff 20%, #667eea 40%, #f093fb 60%, #764ba2 80%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 60px rgba(102, 126, 234, 0.4)',
                letterSpacing: '-0.02em',
              }}
            >
              Swave
            </Typography>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Typography 
              variant="h4" 
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 300,
                mb: { xs: 4, md: 6 },
                maxWidth: { xs: '100%', md: 700 },
                mx: 'auto',
                lineHeight: 1.4,
                fontSize: { xs: '1rem', sm: '1.4rem', md: '1.8rem' },
                px: { xs: 1, sm: 2 },
              }}
            >
              The future of decentralized swapping with{' '}
              <Box component="span" sx={{ color: '#667eea', fontWeight: 500 }}>
                intelligent routing
              </Box>{' '}
              and{' '}
              <Box component="span" sx={{ color: '#f093fb', fontWeight: 500 }}>
                lightning speed
              </Box>
            </Typography>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 3 }} 
              justifyContent="center" 
              mb={{ xs: 4, md: 6 }}
              sx={{ width: '100%' }}
            >
              <Link href="/swap" passHref>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<LaunchIcon />}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 4, sm: 6 },
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      fontWeight: 700,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                      boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
                      textTransform: 'none',
                      minWidth: { xs: '200px', sm: 'auto' },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 50%, #ec4899 100%)',
                        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Start Swapping
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/explore" passHref>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ExploreIcon />}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 4, sm: 6 },
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      fontWeight: 600,
                      borderRadius: 4,
                      color: 'white',
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      backdropFilter: 'blur(20px)',
                      textTransform: 'none',
                      minWidth: { xs: '200px', sm: 'auto' },
                      '&:hover': {
                        borderColor: 'rgba(102, 126, 234, 0.8)',
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore Features
                  </Button>
                </motion.div>
              </Link>
            </Stack>
          </motion.div>

          {/* Enhanced Feature Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
                          <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  flexWrap: 'wrap',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  maxWidth: { xs: '320px', sm: '100%', md: '700px' },
                  mx: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {[
                  { icon: <SpeedIcon />, label: 'Lightning Fast', color: '#667eea' },
                  { icon: <SecurityIcon />, label: 'Ultra Secure', color: '#f093fb' },
                  { icon: <TrendingUpIcon />, label: 'Best Prices', color: '#764ba2' },
                  { icon: <MagicIcon />, label: 'Smart AI', color: '#667eea' }
                ].map((chip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                  >
                    <Chip 
                      icon={chip.icon}
                      label={chip.label}
                      sx={{ 
                        bgcolor: `${chip.color}15`,
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        border: `1px solid ${chip.color}30`,
                        height: { xs: '32px', sm: '36px', md: '40px' },
                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                        fontWeight: 600,
                        minWidth: { xs: '110px', sm: '130px', md: '150px' },
                        '& .MuiChip-icon': { 
                          color: chip.color,
                          fontSize: { xs: '14px', sm: '16px', md: '18px' }
                        },
                        '& .MuiChip-label': {
                          fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                          px: { xs: 0.5, sm: 1 }
                        },
                        '&:hover': {
                          bgcolor: `${chip.color}25`,
                          border: `1px solid ${chip.color}50`,
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Section 2: Features - Full Screen */}
      <Box 
        component="section"
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <GlowingGridDemo />
        </Container>
      </Box>

      {/* Section 3: Stats - Full Screen */}
      <Box 
        component="section"
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <StatsSection />
        </Container>
      </Box>
    </>
  );
} 
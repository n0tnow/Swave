'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  RocketLaunch as RocketIcon,
  Explore as ExploreIcon,
  Analytics as AnalyticsIcon,
  SwapHoriz as SwapIcon,
  Pool as PoolIcon,
  LocalAtm as LocalAtmIcon,
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  ExitToApp as DisconnectIcon
} from '@mui/icons-material';
import walletService from '../lib/walletService';
import StarBorderButton from './StarBorderButton';

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
    // Get initial status and fetch balance if connected
    const loadWalletStatus = async () => {
      const status = await walletService.getConnectionStatusWithBalance();
      setWalletStatus(status);
    };

    loadWalletStatus();

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
    </>
  );
};

export default function Header({ transparent = false }) {
  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        bgcolor: transparent ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)',
        backdropFilter: transparent ? 'blur(4px)' : 'blur(8px)',
        border: 'none',
        transition: 'all 0.2s ease',
        background: transparent ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)',
        zIndex: 1100,
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
          display: { xs: 'none', sm: 'flex' }, 
          alignItems: 'center', 
          gap: { sm: 1, md: 2, lg: 3 },
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          {[
            { icon: <ExploreIcon />, label: 'Explore', color: '#8b9dc3', href: '/explore' },
            { icon: <SwapIcon />, label: 'Swap', color: '#a8c2ca', href: '/swap' },
            { icon: <PoolIcon />, label: 'Liquidity', color: '#9bb5c7', href: '/liquidity' },
            { icon: <LocalAtmIcon />, label: 'Loans', color: '#b8a5d6', href: '/loans' },
            { icon: <AnalyticsIcon />, label: 'Analytics', color: '#c4a8e8', href: '/analytics' }
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
                component={Link}
                href={item.href}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  width: { sm: 32, md: 40, lg: 'auto', xl: 'auto' },
                  height: { sm: 32, md: 40, lg: 40, xl: 44 },
                  borderRadius: { sm: '50%', md: '50%', lg: '12px' },
                  transition: 'all 0.3s ease',
                  background: 'transparent',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  px: { sm: 0, md: 0, lg: 1.5, xl: 2 },
                  py: { sm: 0, md: 0, lg: 1, xl: 1 },
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
                    fontSize: { sm: 16, md: 18, lg: 20 },
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
                    display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
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
  );
} 
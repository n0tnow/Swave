'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
  Snackbar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Badge
} from '@mui/material';
import {
  Pool as PoolIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  MonetizationOn as MoneyIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as SwapHorizIcon,
  Waves as WavesIcon,
  AttachMoney as UsdcIcon,
  Star as XlmIcon,
  Water as AquaIcon,
  Token as TokenIcon,
  LocalAtm as LocalAtmIcon,
  Insights as InsightsIcon,
  Security as SecurityIcon,
  EmojiEvents as RewardIcon,
  ShowChart as ChartIcon,
  TrendingFlat as TrendingFlatIcon,
  FlashOn as FlashOnIcon,
  Diamond as DiamondIcon,
  Handshake as HandshakeIcon,
  AccountBalance as BankIcon,
  Savings as SavingsIcon,
  Calculate as CalculateIcon,
  PieChart as PieChartIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  ShowChart as ShowChartIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  TrendingUp as EarningsIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import BackgroundPaths from '../components/BackgroundPaths';
import walletService from '../lib/walletService';
import contractService from '../lib/contractService';
import { TokenService } from '../lib/tokenService';

// Initialize services
const tokenService = new TokenService();

// LocalStorage helpers
const STORAGE_KEYS = {
  LIQUIDITY_POSITIONS: 'swave_liquidity_positions',
  LIQUIDITY_HISTORY: 'swave_liquidity_history',
  POOL_STATS: 'swave_pool_stats'
};

const saveToStorage = (key, data) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

const loadFromStorage = (key, defaultValue = null) => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  }
  return defaultValue;
};

// Token icon mapping with real token icons
const getTokenIcon = (symbol) => {
  const iconMap = {
    'XLM': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#fff"/>
          <path d="M12 8L12.5 11.5L16 12L12.5 12.5L12 16L11.5 12.5L8 12L11.5 11.5L12 8Z" fill="#000"/>
        </svg>
      </Box>
    ),
    'USDC': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2775CA 0%, #5A9FD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(39, 117, 202, 0.4)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#fff"/>
          <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" fill="none" stroke="#2775CA" strokeWidth="2"/>
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#2775CA" fontWeight="bold">$</text>
        </svg>
      </Box>
    ),
    'AQUA': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0, 212, 255, 0.4)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14 8L12 14L10 8L12 2Z" fill="#fff"/>
          <path d="M12 10L18 12L12 14L6 12L12 10Z" fill="#fff" opacity="0.8"/>
          <path d="M12 14L14 20L12 22L10 20L12 14Z" fill="#fff" opacity="0.6"/>
        </svg>
      </Box>
    ),
    'yXLM': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#000"/>
          <path d="M12 8L12.5 11.5L16 12L12.5 12.5L12 16L11.5 12.5L8 12L11.5 11.5L12 8Z" fill="#FFD700"/>
          <text x="12" y="21" textAnchor="middle" fontSize="7" fill="#000" fontWeight="bold">y</text>
        </svg>
      </Box>
    ),
    'SHX': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(147, 51, 234, 0.4)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" fill="#fff"/>
          <path d="M12 6L18 9V15L12 18L6 15V9L12 6Z" fill="#9333EA"/>
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">S</text>
        </svg>
      </Box>
    ),
    'BTCLN': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F7931A 0%, #FF8C00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(247, 147, 26, 0.4)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#fff"/>
          <path d="M15.5 8.5C15.5 7.67157 14.8284 7 14 7H10C9.17157 7 8.5 7.67157 8.5 8.5V15.5C8.5 16.3284 9.17157 17 10 17H14C14.8284 17 15.5 16.3284 15.5 15.5V8.5Z" fill="#F7931A"/>
          <text x="12" y="15" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">₿</text>
        </svg>
      </Box>
    ),
    'ETH': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #627EEA 0%, #4A90E2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(98, 126, 234, 0.4)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L18 12L12 16L6 12L12 2Z" fill="#fff"/>
          <path d="M12 18L18 14L12 22L6 14L12 18Z" fill="#fff" opacity="0.8"/>
        </svg>
      </Box>
    ),
    'BTC': (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F7931A 0%, #FF8C00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(247, 147, 26, 0.4)',
        border: '2px solid #fff'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#fff"/>
          <path d="M15.5 8.5C15.5 7.67157 14.8284 7 14 7H10C9.17157 7 8.5 7.67157 8.5 8.5V15.5C8.5 16.3284 9.17157 17 10 17H14C14.8284 17 15.5 16.3284 15.5 15.5V8.5Z" fill="#F7931A"/>
          <text x="12" y="15" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">₿</text>
        </svg>
      </Box>
    )
  };
  // Handle undefined or null symbol
  if (!symbol) {
    return (
      <Box sx={{
        width: 32, 
        height: 32, 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(107, 114, 128, 0.4)',
        border: '2px solid #fff'
      }}>
        ?
      </Box>
    );
  }
  
  return iconMap[symbol] || (
    <Box sx={{
      width: 32, 
      height: 32, 
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(107, 114, 128, 0.4)',
      border: '2px solid #fff'
    }}>
      {symbol && typeof symbol === 'string' ? symbol.slice(0, 3) : '?'}
    </Box>
  );
};

// Utility function to safely format numbers
const formatNumber = (value, defaultValue = '0') => {
  if (value && typeof value === 'number' && !isNaN(value)) {
    return value.toLocaleString();
  }
  return defaultValue;
};

// Pool Statistics Component
const PoolStats = React.memo(({ stats, loading }) => {
  const statsData = [
    { 
      label: 'Total TVL', 
      value: `$${(stats?.totalTVL && typeof stats.totalTVL === 'number') ? stats.totalTVL.toLocaleString() : '0'}`, 
      icon: <MoneyIcon />,
      color: '#4ade80',
      bgColor: 'rgba(74, 222, 128, 0.1)',
      change: '+12.5%'
    },
    { 
      label: 'Active Pools', 
      value: stats?.activePools || '0', 
      icon: <PoolIcon />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      change: '+3'
    },
    { 
      label: 'Total Fees (24h)', 
      value: `$${(stats?.totalFees && typeof stats.totalFees === 'number') ? stats.totalFees.toLocaleString() : '0'}`, 
      icon: <SpeedIcon />,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      change: '+8.3%'
    },
    { 
      label: 'My Positions', 
      value: stats?.myPositions || '0', 
      icon: <PieChartIcon />,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      change: stats?.myPositions > 0 ? 'Active' : 'None'
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: 1.5, sm: 2, md: 3 },
      mb: 6,
      alignItems: 'stretch'
    }}>
      {statsData.map((stat, index) => (
        <Box 
          key={index}
          sx={{
            flex: { xs: '1 1 calc(50% - 6px)', sm: '1 1 calc(25% - 12px)', md: '1 1 calc(25% - 18px)' },
            minWidth: { xs: 'calc(50% - 6px)', sm: 'calc(25% - 12px)', md: '200px' },
            maxWidth: { xs: 'calc(50% - 6px)', sm: 'calc(25% - 12px)', md: 'calc(25% - 18px)' },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ height: '100%' }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              height: '100%',
              minHeight: { xs: 120, sm: 140 },
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2,
                  flex: 1
                }}>
                  <Box sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    borderRadius: 2,
                    background: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    flexShrink: 0
                  }}>
                    {loading ? (
                      <CircularProgress size={{ xs: 20, sm: 24 }} sx={{ color: stat.color }} />
                    ) : (
                      React.cloneElement(stat.icon, { sx: { fontSize: { xs: '1.2rem', sm: '1.5rem' } } })
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontWeight: 500,
                      mb: 0.5,
                      lineHeight: 1.2
                    }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: { xs: '0.95rem', sm: '1.1rem' },
                      lineHeight: 1.2,
                      wordBreak: 'break-word'
                    }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: stat.change.startsWith('+') ? 'rgba(74, 222, 128, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: stat.change.startsWith('+') ? '#4ade80' : '#3b82f6',
                      fontWeight: 600,
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      height: { xs: 20, sm: 24 }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      ))}
    </Box>
  );
});

// Enhanced Pool Card Component with Equal Heights
const PoolCard = React.memo(({ pool, onManageLiquidity, index, walletConnected }) => {
  const hasPosition = pool.myLiquidity > 0;
  const aprColor = pool.apr > 15 ? '#4ade80' : pool.apr > 10 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: 0,
        height: '100%',
        minHeight: { xs: 380, sm: 420 },
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Pool Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: { xs: 2, sm: 3 },
            minHeight: 60,
            flex: '0 0 auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
                <Avatar sx={{ 
                  width: { xs: 40, sm: 48 }, 
                  height: { xs: 40, sm: 48 }, 
                  bgcolor: 'transparent',
                  border: 'none',
                  zIndex: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}>
                  {getTokenIcon(pool.tokenA)}
                </Avatar>
                <Avatar sx={{ 
                  width: { xs: 40, sm: 48 }, 
                  height: { xs: 40, sm: 48 }, 
                  bgcolor: 'transparent',
                  border: 'none',
                  ml: { xs: -1, sm: -1.5 },
                  zIndex: 1,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}>
                  {getTokenIcon(pool.tokenB)}
                </Avatar>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ 
                  color: '#fff', 
                  fontWeight: 700,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {pool.tokenA}/{pool.tokenB}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}>
                  Liquidity Pool
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography variant="h6" sx={{ 
                color: aprColor,
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                lineHeight: 1.2
              }}>
                {(pool.apr && typeof pool.apr === 'number') ? pool.apr.toFixed(1) : '0.0'}%
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}>
                APR
              </Typography>
            </Box>
          </Box>

          {/* Pool Stats */}
          <Box sx={{ 
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            mb: { xs: 2, sm: 3 },
            flex: '0 0 auto'
          }}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 2,
              p: { xs: 1.5, sm: 2 },
              textAlign: 'center',
              flex: 1,
              minHeight: { xs: 60, sm: 70 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                display: 'block',
                mb: 0.5,
                lineHeight: 1
              }}>
                TVL
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#fff',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                lineHeight: 1.2,
                wordBreak: 'break-word'
              }}>
                ${(pool.tvl && typeof pool.tvl === 'number') ? pool.tvl.toLocaleString() : '0'}
              </Typography>
            </Box>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 2,
              p: { xs: 1.5, sm: 2 },
              textAlign: 'center',
              flex: 1,
              minHeight: { xs: 60, sm: 70 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                display: 'block',
                mb: 0.5,
                lineHeight: 1
              }}>
                24h Volume
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#fff',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                lineHeight: 1.2,
                wordBreak: 'break-word'
              }}>
                ${(pool.volume24h && typeof pool.volume24h === 'number') ? pool.volume24h.toLocaleString() : '0'}
              </Typography>
            </Box>
          </Box>

          {/* My Position */}
          {hasPosition && (
            <Box sx={{ 
              bgcolor: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              borderRadius: 2,
              p: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
              flex: '0 0 auto'
            }}>
              <Typography variant="body2" sx={{ 
                color: '#4ade80',
                fontWeight: 600,
                mb: { xs: 1, sm: 1.5 },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}>
                <CheckCircleIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                My Position
              </Typography>
              <Box sx={{ 
                display: 'flex',
                gap: { xs: 1, sm: 2 }
              }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    display: 'block',
                    lineHeight: 1
                  }}>
                    Liquidity
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    lineHeight: 1.2,
                    wordBreak: 'break-word'
                  }}>
                    ${(pool.myLiquidity && typeof pool.myLiquidity === 'number') ? pool.myLiquidity.toLocaleString() : '0'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    display: 'block',
                    lineHeight: 1
                  }}>
                    Share
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    lineHeight: 1.2
                  }}>
                    {(pool.poolShare && typeof pool.poolShare === 'number') ? pool.poolShare.toFixed(2) : '0.00'}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Enhanced Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 1.5 }, 
            mt: 'auto',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            pt: { xs: 1, sm: 0 }
          }}>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                boxShadow: '0 4px 16px rgba(74, 222, 128, 0.3)',
                border: 'none',
                color: '#000',
                '&:hover': {
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  boxShadow: '0 6px 20px rgba(74, 222, 128, 0.4)',
                  transform: 'translateY(-1px)'
                },
                '&:disabled': { 
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: 'none'
                },
                fontWeight: 700,
                py: { xs: 1, sm: 1.2 },
                px: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                flex: 1,
                transition: 'all 0.3s ease',
                minHeight: { xs: 36, sm: 42 }
              }}
              onClick={() => onManageLiquidity(pool, 'add')}
              disabled={!walletConnected}
              startIcon={<AddIcon sx={{ fontSize: { xs: '16px !important', sm: '18px !important' } }} />}
            >
              ADD
            </Button>
            {hasPosition ? (
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                  border: 'none',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': { 
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: 'none'
                  },
                  fontWeight: 700,
                  py: { xs: 1, sm: 1.2 },
                  px: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  flex: 1,
                  transition: 'all 0.3s ease',
                  minHeight: { xs: 36, sm: 42 }
                }}
                onClick={() => onManageLiquidity(pool, 'remove')}
                disabled={!walletConnected}
                startIcon={<RemoveIcon sx={{ fontSize: { xs: '16px !important', sm: '18px !important' } }} />}
              >
                REMOVE
              </Button>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': { 
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  fontWeight: 600,
                  py: { xs: 1, sm: 1.2 },
                  px: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  flex: 1,
                  transition: 'all 0.3s ease',
                  minHeight: { xs: 36, sm: 42 }
                }}
                disabled
                startIcon={<InfoIcon sx={{ fontSize: { xs: '16px !important', sm: '18px !important' } }} />}
              >
                NO POSITION
              </Button>
            )}
          </Box>

          {/* Wallet Connection Notice */}
          {!walletConnected && (
            <Box sx={{ 
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              textAlign: 'center'
            }}>
              <Typography variant="caption" sx={{ 
                color: '#f59e0b', 
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                <WalletIcon sx={{ fontSize: 16 }} />
                Connect wallet to manage liquidity
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Activity Detail Dialog Component
const ActivityDetailDialog = React.memo(({ open, onClose, activity }) => {
  if (!activity) return null;
  
  const isAdd = activity.type === 'add';
  
  // Extract token information from pool string
  const tokens = activity.pool ? activity.pool.split('/') : ['XLM', 'USDC'];
  const tokenA = tokens[0] || 'XLM';
  const tokenB = tokens[1] || 'USDC';

  // Calculate token amounts based on total amount
  const totalAmount = activity.amount || 0;
  const tokenAPrice = tokenA === 'XLM' ? 0.25 : tokenA === 'USDC' ? 1.0 : tokenA === 'AQUA' ? 0.5 : 0.75;
  const tokenBPrice = tokenB === 'USDC' ? 1.0 : tokenB === 'XLM' ? 0.25 : tokenB === 'AQUA' ? 0.5 : 0.75;
  
  const tokenAAmount = Math.floor(totalAmount * 0.5 / tokenAPrice);
  const tokenBAmount = Math.floor(totalAmount * 0.5 / tokenBPrice);

  // Generate consistent technical details from activity data
  const generateTxDetails = (activity) => {
    if (!activity) return {};
    
    // Generate consistent hash based on activity properties
    const activityString = `${activity.type}-${activity.pool}-${activity.amount}-${activity.timestamp}`;
    const hash = Math.abs(activityString.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0));
    
    const txHash = `0x${hash.toString(16).padStart(64, '0').substr(0, 64)}`;
    const blockNumber = Math.floor(hash % 1000000) + 47000000;
    const gasUsed = Math.floor(hash % 100000) + 100000;
    const gasFee = (gasUsed * 0.000001).toFixed(6);
    
    return {
      txHash,
      blockNumber,
      gasUsed,
      gasFee,
      lpTokens: Math.floor(hash % 5000) + 1000,
      poolShare: ((hash % 100) / 1000).toFixed(3),
      priceImpact: ((hash % 50) / 100).toFixed(2)
    };
  };

  const txDetails = generateTxDetails(activity);

  // Calculate earnings for add liquidity operations
  const hasEarnings = isAdd && totalAmount > 0;
  const earningsData = hasEarnings ? {
    totalEarnings: (totalAmount * 0.025).toFixed(2), // 2.5% of provided amount
    dailyEarnings: (totalAmount * 0.0008).toFixed(2), // ~0.08% daily
    monthlyEarnings: (totalAmount * 0.025).toFixed(2) // ~2.5% monthly
  } : {};
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#fff', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1.25rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        pb: 2
      }}>
        <Avatar sx={{ 
          bgcolor: isAdd ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: isAdd ? '#4ade80' : '#ef4444',
          width: 40,
          height: 40
        }}>
          {isAdd ? <AddIcon /> : <RemoveIcon />}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
            {isAdd ? 'Added' : 'Removed'} Liquidity
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {activity.pool} • {activity.timestamp}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Transaction Summary */}
          <Box sx={{ 
            mb: 3,
            p: 3,
            bgcolor: isAdd ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            border: `1px solid ${isAdd ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
            borderRadius: 2
          }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
              Transaction Summary
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' },
                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: '180px' }
              }
            }}>
              {/* Total Value */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                  borderRadius: '12px 12px 0 0'
                }
              }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                  Total Value
                </Typography>
                <Typography variant="h3" sx={{ color: '#4ade80', fontWeight: 700, mb: 1 }}>
                  ${totalAmount.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Liquidity {isAdd ? 'provided' : 'withdrawn'}
                </Typography>
              </Card>

              {/* Status */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                  borderRadius: '12px 12px 0 0'
                }
              }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                  Status
                </Typography>
                <Chip
                  label={activity?.status || 'Success'}
                  size="medium"
                  sx={{
                    bgcolor: (activity?.status || 'Success') === 'Success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: (activity?.status || 'Success') === 'Success' ? '#4ade80' : '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1,
                    mb: 1
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {activity?.timestamp || 'Just now'}
                </Typography>
              </Card>

              {/* Transaction Type */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #9333ea, #7c3aed)',
                  borderRadius: '12px 12px 0 0'
                }
              }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                  Transaction Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar sx={{ 
                    bgcolor: isAdd ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: isAdd ? '#4ade80' : '#ef4444',
                    width: 32,
                    height: 32
                  }}>
                    {isAdd ? <AddIcon /> : <RemoveIcon />}
                  </Avatar>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                    {isAdd ? 'Add' : 'Remove'}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {isAdd ? 'Providing liquidity' : 'Withdrawing liquidity'}
                </Typography>
              </Card>
            </Box>
          </Box>

          {/* Token Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
              Token Details
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' },
                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: '300px' }
              }
            }}>
              {/* Token A */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(74, 222, 128, 0.15)',
                  border: '1px solid rgba(74, 222, 128, 0.3)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {getTokenIcon(tokenA)}
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                    {tokenA}
                  </Typography>
                  <Chip 
                    label="Token A" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(74, 222, 128, 0.2)', 
                      color: '#4ade80', 
                      fontWeight: 600 
                    }} 
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                    Amount Provided
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4ade80', fontWeight: 700, mb: 1 }}>
                    {tokenAAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    ≈ ${(tokenAAmount * tokenAPrice).toLocaleString()} USD
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: 2, 
                  p: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Current Price
                  </Typography>
                                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                      ${tokenAPrice.toFixed(2)} USD
                    </Typography>
                </Box>
              </Card>

              {/* Token B */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {getTokenIcon(tokenB)}
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                    {tokenB}
                  </Typography>
                  <Chip 
                    label="Token B" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(59, 130, 246, 0.2)', 
                      color: '#3b82f6', 
                      fontWeight: 600 
                    }} 
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                    Amount Provided
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700, mb: 1 }}>
                    {tokenBAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    ≈ ${(tokenBAmount * tokenBPrice).toLocaleString()} USD
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: 2, 
                  p: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Current Price
                  </Typography>
                                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                      ${tokenBPrice.toFixed(2)} USD
                    </Typography>
                </Box>
              </Card>
            </Box>
          </Box>

          {/* Earnings Section - Only for Add Liquidity */}
          {isAdd && hasEarnings && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                color: '#fff', 
                mb: 2, 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <EarningsIcon sx={{ color: '#4ade80' }} />
                Earnings & Rewards
              </Typography>
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                '& > *': {
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' },
                  minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: '200px' }
                }
              }}>
                {/* Total Earnings */}
                <Card sx={{ 
                  background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  borderRadius: 3,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                    borderRadius: '12px 12px 0 0'
                  }
                }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4ade80', fontWeight: 700, mb: 1 }}>
                    ${earningsData.totalEarnings}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Since position created
                  </Typography>
                </Card>

                {/* Daily Earnings */}
                <Card sx={{ 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 3,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                    borderRadius: '12px 12px 0 0'
                  }
                }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                    Daily Earnings
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700, mb: 1 }}>
                    ${earningsData.dailyEarnings}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Last 24 hours
                  </Typography>
                </Card>

                {/* Monthly Projected */}
                <Card sx={{ 
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  borderRadius: 3,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #9333ea, #7c3aed)',
                    borderRadius: '12px 12px 0 0'
                  }
                }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                    Monthly Projected
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#9333ea', fontWeight: 700, mb: 1 }}>
                    ${earningsData.monthlyEarnings}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Estimated
                  </Typography>
                </Card>
              </Box>
            </Box>
          )}

          {/* Technical Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
              Technical Details
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' },
                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: '200px' }
              }
            }}>
              {/* Transaction Hash */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content'
              }}>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mb: 1.5 }}>
                  Transaction Hash
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    flex: 1,
                    fontSize: '0.9rem',
                    fontFamily: 'monospace'
                  }}>
                    {txDetails.txHash.slice(0, 16)}...
                  </Typography>
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    <LaunchIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>

              {/* Block Number */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content'
              }}>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mb: 1.5 }}>
                  Block Number
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  {txDetails.blockNumber.toLocaleString()}
                </Typography>
              </Card>

              {/* Gas Used */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content'
              }}>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mb: 1.5 }}>
                  Gas Used
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                  {txDetails.gasUsed.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
                  ({txDetails.gasFee} XLM)
                </Typography>
              </Card>

              {/* LP Tokens */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content'
              }}>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mb: 1.5 }}>
                  LP Tokens
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: '#4ade80', 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  {txDetails.lpTokens.toLocaleString()}
                </Typography>
              </Card>

              {/* Pool Share */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content'
              }}>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mb: 1.5 }}>
                  Pool Share
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: '#3b82f6', 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  {txDetails.poolShare}%
                </Typography>
              </Card>

              {/* Price Impact */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content'
              }}>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mb: 1.5 }}>
                  Price Impact
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: (activity?.priceImpact && activity.priceImpact > 0.1) ? '#f59e0b' : '#4ade80',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  {txDetails.priceImpact}%
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: parseFloat(txDetails.priceImpact) > 0.1 ? '#f59e0b' : 'rgba(255, 255, 255, 0.6)',
                  mt: 0.5
                }}>
                  {parseFloat(txDetails.priceImpact) > 0.1 ? 'High Impact' : 'Low Impact'}
                </Typography>
              </Card>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

// Liquidity History Component
const LiquidityHistory = React.memo(({ history, onActivityClick }) => {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ 
        color: '#fff', 
        mb: 3, 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <HistoryIcon />
        Recent Activity
      </Typography>
      
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 0 }}>
          {history.length > 0 ? (
            <List>
              {history.map((item, index) => (
                <ListItem 
                  key={index} 
                  sx={{ 
                    py: 3, 
                    px: 3,
                    borderBottom: index < history.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.02)',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                  onClick={() => onActivityClick(item)}
                >
                  <ListItemAvatar>
                    <Badge 
                      badgeContent={item.earnings > 0 ? '+' : null}
                      color="success"
                      sx={{ 
                        '& .MuiBadge-badge': { 
                          bgcolor: '#4ade80',
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: '0.65rem'
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        bgcolor: item.type === 'add' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: item.type === 'add' ? '#4ade80' : '#ef4444'
                      }}>
                        {item.type === 'add' ? <AddIcon /> : <RemoveIcon />}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                        {item.type === 'add' ? 'Added' : 'Removed'} Liquidity
                      </Typography>
                      {item.earnings > 0 && (
                        <Chip
                          label={`+$${(item.earnings && typeof item.earnings === 'number') ? item.earnings.toFixed(2) : '0.00'}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(74, 222, 128, 0.2)',
                            color: '#4ade80',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                      {item.pool} • ${(item.amount && typeof item.amount === 'number') ? item.amount.toLocaleString() : '0'} • {item.timestamp}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        bgcolor: item.status === 'Success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: item.status === 'Success' ? '#4ade80' : '#ef4444',
                        fontWeight: 600
                      }}
                    />
                    <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <HistoryIcon sx={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
                No liquidity activity yet
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem', mt: 1 }}>
                Add liquidity to pools to see your activity here
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
});

// Enhanced Manage Liquidity Dialog
const ManageLiquidityDialog = React.memo(({ 
  open, 
  onClose, 
  selectedPool, 
  liquidityAction, 
  tokenAAmount, 
  setTokenAAmount, 
  tokenBAmount, 
  setTokenBAmount, 
  lpTokensAmount, 
  setLpTokensAmount, 
  onExecute,
  loading
}) => {
  const isAdd = liquidityAction === 'add';
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#fff', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1.25rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {isAdd ? <AddIcon /> : <RemoveIcon />}
        {isAdd ? 'Add' : 'Remove'} Liquidity - {selectedPool?.tokenA}/{selectedPool?.tokenB}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Alert severity="info" sx={{ 
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#3b82f6' }
          }}>
            {isAdd 
              ? 'Provide liquidity to earn trading fees and LP rewards. Your tokens will be paired automatically.'
              : 'Remove your liquidity position. You will receive both tokens back proportionally.'
            }
          </Alert>
          
          {/* Token Inputs */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isAdd ? (
              <>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                    {selectedPool?.tokenA} Amount
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.0"
                    value={tokenAAmount}
                    onChange={(e) => setTokenAAmount(e.target.value)}
                    type="number"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 2,
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#4ade80' }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                    {selectedPool?.tokenB} Amount
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.0"
                    value={tokenBAmount}
                    onChange={(e) => setTokenBAmount(e.target.value)}
                    type="number"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 2,
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#4ade80' }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              </>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                  LP Tokens to Remove
                </Typography>
                <TextField
                  fullWidth
                  placeholder="0.0"
                  value={lpTokensAmount}
                  onChange={(e) => setLpTokensAmount(e.target.value)}
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 2,
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#ef4444' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Pool Information */}
          <Box sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 2,
            p: 2
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Pool Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                  Current APR
                </Typography>
                <Typography variant="body2" sx={{ color: '#4ade80', fontWeight: 600 }}>
                  {(selectedPool?.apr && typeof selectedPool.apr === 'number') ? selectedPool.apr.toFixed(1) : '0.0'}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                  Pool TVL
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                  ${(selectedPool?.tvl && typeof selectedPool.tvl === 'number') ? selectedPool.tvl.toLocaleString() : '0'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onExecute}
          disabled={loading || (!tokenAAmount && !tokenBAmount && !lpTokensAmount)}
          variant="contained"
          sx={{ 
            bgcolor: isAdd ? '#4ade80' : '#ef4444',
            '&:hover': { bgcolor: isAdd ? '#22c55e' : '#dc2626' },
            fontWeight: 600,
            minWidth: 120
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: '#fff' }} />
          ) : (
            `${isAdd ? 'Add' : 'Remove'} Liquidity`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

// Main Liquidity Page Component
export default function LiquidityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // States
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState([]);
  const [poolStats, setPoolStats] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [liquidityDialogOpen, setLiquidityDialogOpen] = useState(false);
  const [liquidityAction, setLiquidityAction] = useState('add');
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [lpTokensAmount, setLpTokensAmount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [liquidityHistory, setLiquidityHistory] = useState([
    {
      id: 1,
      type: 'add',
      pool: 'XLM/USDC',
      amount: 1250,
      timestamp: '2 hours ago',
      status: 'Success',
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      tokenA: 'XLM',
      tokenB: 'USDC',
      tokenAAmount: 5000,
      tokenBAmount: 1250,
      lpTokens: 2500,
      priceImpact: 0.12,
      fees: 3.75,
      apr: 18.5,
      earnings: 24.67,
      earningsUSD: 24.67,
      dailyEarnings: 1.89,
      weeklyEarnings: 13.23,
      monthlyEarnings: 56.78,
      feesEarned: 8.45,
      rewardsEarned: 16.22,
      totalValueLocked: 1250,
      poolShare: 0.052,
      impermanentLoss: -2.1,
      blockNumber: 47582931,
      gasUsed: 142500,
      gasFee: 0.0021
    },
    {
      id: 2,
      type: 'remove',
      pool: 'AQUA/XLM',
      amount: 850,
      timestamp: '1 day ago',
      status: 'Success',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      tokenA: 'AQUA',
      tokenB: 'XLM',
      tokenAAmount: 2500,
      tokenBAmount: 850,
      lpTokens: 1750,
      priceImpact: 0.08,
      fees: 2.55,
      apr: 22.3,
      earnings: 45.23,
      earningsUSD: 45.23,
      dailyEarnings: 0,
      weeklyEarnings: 0,
      monthlyEarnings: 0,
      feesEarned: 15.67,
      rewardsEarned: 29.56,
      totalValueLocked: 850,
      poolShare: 0.034,
      impermanentLoss: 1.8,
      blockNumber: 47568234,
      gasUsed: 138200,
      gasFee: 0.0018
    },
    {
      id: 3,
      type: 'add',
      pool: 'USDC/AQUA',
      amount: 2100,
      timestamp: '3 days ago',
      status: 'Success',
      txHash: '0xfedcba0987654321fedcba0987654321fedcba09',
      tokenA: 'USDC',
      tokenB: 'AQUA',
      tokenAAmount: 2100,
      tokenBAmount: 8400,
      lpTokens: 4200,
      priceImpact: 0.15,
      fees: 6.30,
      apr: 16.8,
      earnings: 67.89,
      earningsUSD: 67.89,
      dailyEarnings: 2.41,
      weeklyEarnings: 16.87,
      monthlyEarnings: 72.45,
      feesEarned: 21.34,
      rewardsEarned: 46.55,
      totalValueLocked: 2100,
      poolShare: 0.087,
      impermanentLoss: -0.5,
      blockNumber: 47432156,
      gasUsed: 145800,
      gasFee: 0.0023
    }
  ]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [operationLoading, setOperationLoading] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [activityDetailOpen, setActivityDetailOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setActivityDetailOpen(true);
  };

  // Load data on mount
  useEffect(() => {
    loadLiquidityData();
  }, []);

  const loadLiquidityData = async () => {
    setLoading(true);
    try {
      // Check wallet status
      const walletStatus = await walletService.getConnectionStatusWithBalance();
      setWalletConnected(walletStatus.isConnected);
      setWalletAddress(walletStatus.address || null);
      
      // Load saved data
      const savedHistory = loadFromStorage(STORAGE_KEYS.LIQUIDITY_HISTORY, []);
      setLiquidityHistory(savedHistory);
      
      // Real liquidity pool data
      const poolsData = [
        {
          id: 'XLM-USDC',
          tokenA: 'XLM',
          tokenB: 'USDC',
          tvl: 1850000,
          apr: 14.2,
          volume24h: 125000,
          fees24h: 450,
          myLiquidity: 5000,
          myShare: 1250,
          poolShare: 0.27
        },
        {
          id: 'AQUA-XLM',
          tokenA: 'AQUA',
          tokenB: 'XLM',
          tvl: 980000,
          apr: 18.5,
          volume24h: 87000,
          fees24h: 320,
          myLiquidity: 0,
          myShare: 0,
          poolShare: 0.0
        },
        {
          id: 'USDC-AQUA',
          tokenA: 'USDC',
          tokenB: 'AQUA',
          tvl: 720000,
          apr: 16.8,
          volume24h: 65000,
          fees24h: 280,
          myLiquidity: 2500,
          myShare: 420,
          poolShare: 0.35
        },
        {
          id: 'yXLM-XLM',
          tokenA: 'yXLM',
          tokenB: 'XLM',
          tvl: 450000,
          apr: 22.3,
          volume24h: 38000,
          fees24h: 180,
          myLiquidity: 0,
          myShare: 0,
          poolShare: 0.0
        },
        {
          id: 'SHX-USDC',
          tokenA: 'SHX',
          tokenB: 'USDC',
          tvl: 320000,
          apr: 19.7,
          volume24h: 28000,
          fees24h: 145,
          myLiquidity: 1200,
          myShare: 85,
          poolShare: 0.38
        }
      ];
      
      setPools(poolsData);
      
      // Calculate pool stats
      const totalTVL = poolsData.reduce((sum, pool) => sum + pool.tvl, 0);
      const totalFees = poolsData.reduce((sum, pool) => sum + pool.fees24h, 0);
      const myPositions = poolsData.filter(pool => pool.myLiquidity > 0).length;
      
      setPoolStats({
        totalTVL,
        activePools: poolsData.length,
        totalFees,
        myPositions
      });
      
    } catch (error) {
      console.error('Failed to load liquidity data:', error);
      setSnackbar({ open: true, message: 'Failed to load liquidity data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleManageLiquidity = (pool, action) => {
    setSelectedPool(pool);
    setLiquidityAction(action);
    setLiquidityDialogOpen(true);
  };

  const handleExecuteLiquidity = async () => {
    if (!walletConnected || !walletAddress) {
      setSnackbar({ open: true, message: 'Please connect your wallet', severity: 'error' });
      return;
    }

    if (!selectedPool || !liquidityAction) {
      setSnackbar({ open: true, message: 'Invalid operation', severity: 'error' });
      return;
    }

    const isAdd = liquidityAction === 'add';
    if (isAdd && (!tokenAAmount || !tokenBAmount)) {
      setSnackbar({ open: true, message: 'Please enter both token amounts', severity: 'error' });
      return;
    }

    if (!isAdd && !lpTokensAmount) {
      setSnackbar({ open: true, message: 'Please enter LP tokens amount', severity: 'error' });
      return;
    }

    try {
      setOperationLoading(true);
      
      // Simulate operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create transaction record
      const newTransaction = {
        type: liquidityAction,
        pool: `${selectedPool.tokenA}/${selectedPool.tokenB}`,
        amount: isAdd ? 
          (parseFloat(tokenAAmount) + parseFloat(tokenBAmount)) * 0.5 : 
          parseFloat(lpTokensAmount) * 50,
        timestamp: 'Just now',
        status: 'Success'
      };
      
      // Update history
      const updatedHistory = [newTransaction, ...liquidityHistory].slice(0, 10);
      setLiquidityHistory(updatedHistory);
      saveToStorage(STORAGE_KEYS.LIQUIDITY_HISTORY, updatedHistory);
      
      // Update pool data
      const updatedPools = pools.map(pool => {
        if (pool.id === selectedPool.id) {
          if (isAdd) {
            return {
              ...pool,
              myLiquidity: pool.myLiquidity + newTransaction.amount,
              myShare: pool.myShare + newTransaction.amount * 0.2,
              poolShare: (pool.myLiquidity + newTransaction.amount) / (pool.tvl + newTransaction.amount) * 100
            };
          } else {
            return {
              ...pool,
              myLiquidity: Math.max(0, pool.myLiquidity - newTransaction.amount),
              myShare: Math.max(0, pool.myShare - newTransaction.amount * 0.2),
              poolShare: Math.max(0, pool.myLiquidity - newTransaction.amount) / pool.tvl * 100
            };
          }
        }
        return pool;
      });
      
      setPools(updatedPools);
      
      // Update stats
      const myPositions = updatedPools.filter(pool => pool.myLiquidity > 0).length;
      setPoolStats(prev => ({ ...prev, myPositions }));
      
      setSnackbar({ 
        open: true, 
        message: `Liquidity ${isAdd ? 'added' : 'removed'} successfully!`, 
        severity: 'success' 
      });
      
      // Close dialog and reset form
      setLiquidityDialogOpen(false);
      setTokenAAmount('');
      setTokenBAmount('');
      setLpTokensAmount('');
      
    } catch (error) {
      console.error('Liquidity operation failed:', error);
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    } finally {
      setOperationLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      
      <BackgroundPaths title="Liquidity Pools">
        <Box sx={{ width: '100%', pt: 12 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Typography variant="h2" sx={{ 
                color: '#fff', 
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Liquidity
                </motion.span>
                {' '}
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Pools
                </motion.span>
              </Typography>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.6
                }}>
                  Provide liquidity to decentralized pools and earn rewards from trading fees. 
                  Join the DeFi ecosystem on Stellar network with competitive APR rates and low transaction costs.
                </Typography>
                
                {/* Learn More Toggle Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setExplanationOpen(!explanationOpen)}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: '#fff',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      },
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      mb: 6,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                    {explanationOpen ? 'Hide Details' : 'Learn How It Works'}
                    <motion.div
                      animate={{ rotate: explanationOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
                    >
                      <ExpandMoreIcon />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </Box>

          {/* Main Content */}
          <Container maxWidth="lg">
            {/* Liquidity Explanation Section - Collapsible */}
            <AnimatePresence>
              {explanationOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    mb: 6,
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                      <Typography variant="h4" sx={{ 
                        color: '#fff', 
                        mb: 4, 
                        fontWeight: 700,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.8rem', md: '2.2rem' }
                      }}>
                        How Liquidity Provision Works
                      </Typography>
                      
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontSize: '1.1rem', 
                        textAlign: 'center', 
                        mb: 5,
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.7
                      }}>
                        Liquidity provision is the backbone of decentralized finance. By contributing your tokens to liquidity pools, 
                        you enable seamless trading while earning passive income from transaction fees and additional rewards.
                      </Typography>
                      
                      <Grid container spacing={5}>
                        <Grid item xs={12} md={4}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                          >
                            <Box sx={{ textAlign: 'center' }}>
                              <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.05) 100%)',
                                border: '2px solid rgba(74, 222, 128, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 8px 32px rgba(74, 222, 128, 0.15)'
                              }}>
                                <PoolIcon sx={{ fontSize: 40, color: '#4ade80' }} />
                              </Box>
                              <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
                                Deposit Tokens
                              </Typography>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1rem', lineHeight: 1.7 }}>
                                Add equal values of two different tokens to create a balanced liquidity pool. 
                                Your tokens become available for other traders to swap against, creating market depth and enabling price discovery.
                              </Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          >
                            <Box sx={{ textAlign: 'center' }}>
                              <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
                                border: '2px solid rgba(245, 158, 11, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.15)'
                              }}>
                                <RewardIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                              </Box>
                              <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
                                Earn Trading Fees
                              </Typography>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1rem', lineHeight: 1.7 }}>
                                Collect 0.3% from every swap transaction in your pool, distributed proportionally to your share. 
                                Higher trading volume means higher rewards. APR varies based on pool activity and demand.
                              </Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          >
                            <Box sx={{ textAlign: 'center' }}>
                              <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                border: '2px solid rgba(139, 92, 246, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)'
                              }}>
                                <SecurityIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />
                              </Box>
                              <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
                                Receive LP Tokens
                              </Typography>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1rem', lineHeight: 1.7 }}>
                                Get LP (Liquidity Provider) tokens representing your pool ownership. 
                                These tokens automatically compound your earnings and can be redeemed anytime to withdraw your original assets plus accumulated fees.
                              </Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                      </Grid>
                      
                                             {/* Additional Benefits */}
                       <Box sx={{ mt: 6, p: 4, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                         <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 700, textAlign: 'center' }}>
                           Why Choose Swave Liquidity Pools?
                         </Typography>
                         <Box sx={{ 
                           display: 'flex', 
                           flexWrap: 'wrap', 
                           gap: 3,
                           justifyContent: 'center'
                         }}>
                           <Box sx={{ 
                             flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
                             minHeight: 140,
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             justifyContent: 'flex-start',
                             p: 3,
                             borderRadius: 2,
                             bgcolor: 'rgba(255, 255, 255, 0.02)',
                             border: '1px solid rgba(255, 255, 255, 0.05)',
                             transition: 'all 0.3s ease',
                             '&:hover': {
                               bgcolor: 'rgba(255, 255, 255, 0.05)',
                               transform: 'translateY(-2px)'
                             }
                           }}>
                             <FlashOnIcon sx={{ fontSize: 36, color: '#f59e0b', mb: 2 }} />
                             <Typography variant="body1" sx={{ 
                               color: '#fff', 
                               fontWeight: 700, 
                               mb: 1.5,
                               textAlign: 'center',
                               fontSize: '1rem'
                             }}>
                               Low Fees
                             </Typography>
                             <Typography variant="body2" sx={{ 
                               color: 'rgba(255, 255, 255, 0.7)', 
                               textAlign: 'center',
                               lineHeight: 1.4,
                               fontSize: '0.875rem',
                               wordBreak: 'break-word',
                               hyphens: 'auto'
                             }}>
                               Minimal transaction costs on Stellar network
                             </Typography>
                           </Box>
                           
                           <Box sx={{ 
                             flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
                             minHeight: 140,
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             justifyContent: 'flex-start',
                             p: 3,
                             borderRadius: 2,
                             bgcolor: 'rgba(255, 255, 255, 0.02)',
                             border: '1px solid rgba(255, 255, 255, 0.05)',
                             transition: 'all 0.3s ease',
                             '&:hover': {
                               bgcolor: 'rgba(255, 255, 255, 0.05)',
                               transform: 'translateY(-2px)'
                             }
                           }}>
                             <SpeedIcon sx={{ fontSize: 36, color: '#4ade80', mb: 2 }} />
                             <Typography variant="body1" sx={{ 
                               color: '#fff', 
                               fontWeight: 700, 
                               mb: 1.5,
                               textAlign: 'center',
                               fontSize: '1rem'
                             }}>
                               Fast Settlements
                             </Typography>
                             <Typography variant="body2" sx={{ 
                               color: 'rgba(255, 255, 255, 0.7)', 
                               textAlign: 'center',
                               lineHeight: 1.4,
                               fontSize: '0.875rem',
                               wordBreak: 'break-word',
                               hyphens: 'auto'
                             }}>
                               3-5 second transaction finality
                             </Typography>
                           </Box>
                           
                           <Box sx={{ 
                             flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
                             minHeight: 140,
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             justifyContent: 'flex-start',
                             p: 3,
                             borderRadius: 2,
                             bgcolor: 'rgba(255, 255, 255, 0.02)',
                             border: '1px solid rgba(255, 255, 255, 0.05)',
                             transition: 'all 0.3s ease',
                             '&:hover': {
                               bgcolor: 'rgba(255, 255, 255, 0.05)',
                               transform: 'translateY(-2px)'
                             }
                           }}>
                             <SecurityIcon sx={{ fontSize: 36, color: '#8b5cf6', mb: 2 }} />
                             <Typography variant="body1" sx={{ 
                               color: '#fff', 
                               fontWeight: 700, 
                               mb: 1.5,
                               textAlign: 'center',
                               fontSize: '1rem'
                             }}>
                               Secure Protocol
                             </Typography>
                             <Typography variant="body2" sx={{ 
                               color: 'rgba(255, 255, 255, 0.7)', 
                               textAlign: 'center',
                               lineHeight: 1.4,
                               fontSize: '0.875rem',
                               wordBreak: 'break-word',
                               hyphens: 'auto'
                             }}>
                               Audited smart contracts and time-tested infrastructure
                             </Typography>
                           </Box>
                           
                           <Box sx={{ 
                             flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
                             minHeight: 140,
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             justifyContent: 'flex-start',
                             p: 3,
                             borderRadius: 2,
                             bgcolor: 'rgba(255, 255, 255, 0.02)',
                             border: '1px solid rgba(255, 255, 255, 0.05)',
                             transition: 'all 0.3s ease',
                             '&:hover': {
                               bgcolor: 'rgba(255, 255, 255, 0.05)',
                               transform: 'translateY(-2px)'
                             }
                           }}>
                             <InsightsIcon sx={{ fontSize: 36, color: '#3b82f6', mb: 2 }} />
                             <Typography variant="body1" sx={{ 
                               color: '#fff', 
                               fontWeight: 700, 
                               mb: 1.5,
                               textAlign: 'center',
                               fontSize: '1rem'
                             }}>
                               Real-time Analytics
                             </Typography>
                             <Typography variant="body2" sx={{ 
                               color: 'rgba(255, 255, 255, 0.7)', 
                               textAlign: 'center',
                               lineHeight: 1.4,
                               fontSize: '0.875rem',
                               wordBreak: 'break-word',
                               hyphens: 'auto'
                             }}>
                               Track your performance with detailed metrics
                             </Typography>
                           </Box>
                         </Box>
                       </Box>
                      
                      {/* Risk Warning */}
                      <Alert severity="warning" sx={{ 
                        mt: 5,
                        bgcolor: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        color: '#fff',
                        borderRadius: 3,
                        '& .MuiAlert-icon': { color: '#f59e0b' }
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f59e0b' }}>
                          Understanding Impermanent Loss
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.6, mb: 2 }}>
                          When token prices diverge from their initial ratio, liquidity providers may experience "impermanent loss" - 
                          a temporary reduction in value compared to simply holding the tokens.
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                          <strong>Mitigation strategies:</strong> Choose stable pairs, monitor price correlations, and consider that 
                          trading fees often compensate for small impermanent losses in active pools. The loss becomes "permanent" 
                          only if you withdraw during unfavorable price ratios.
                        </Typography>
                      </Alert>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Pool Statistics */}
            <PoolStats stats={poolStats} loading={loading} />
            
            {/* Pool Cards - Enhanced Flexbox Layout with Perfect Equal Heights */}
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2, md: 3 },
              mb: 6,
              alignItems: 'stretch'
            }}>
              {pools.map((pool, index) => (
                <Box 
                  key={pool.id}
                  sx={{
                    flex: { xs: '1 1 calc(33.333% - 8px)', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' },
                    minWidth: { xs: 'calc(33.333% - 8px)', sm: '280px', lg: '320px' },
                    maxWidth: { xs: 'calc(33.333% - 8px)', sm: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <PoolCard 
                    pool={pool} 
                    onManageLiquidity={handleManageLiquidity}
                    index={index}
                    walletConnected={walletConnected}
                  />
                </Box>
              ))}
            </Box>
            
            {/* Liquidity History */}
            <LiquidityHistory history={liquidityHistory} onActivityClick={handleActivityClick} />
          </Container>
        </Box>
      </BackgroundPaths>

      {/* Manage Liquidity Dialog */}
      <ManageLiquidityDialog
        open={liquidityDialogOpen}
        onClose={() => setLiquidityDialogOpen(false)}
        selectedPool={selectedPool}
        liquidityAction={liquidityAction}
        tokenAAmount={tokenAAmount}
        setTokenAAmount={setTokenAAmount}
        tokenBAmount={tokenBAmount}
        setTokenBAmount={setTokenBAmount}
        lpTokensAmount={lpTokensAmount}
        setLpTokensAmount={setLpTokensAmount}
        onExecute={handleExecuteLiquidity}
        loading={operationLoading}
      />

      {/* Activity Detail Dialog */}
      <ActivityDetailDialog
        open={activityDetailOpen}
        onClose={() => setActivityDetailOpen(false)}
        activity={selectedActivity}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  IconButton,
  Divider,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import {
  LocalAtm as LoanIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BankIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  InfoOutlined as InfoIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AccountBalanceWallet as WalletIcon,
  Refresh as RefreshIcon,
  MonetizationOn as MoneyIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  StarBorder as StarIcon,
  CurrencyExchange as ExchangeIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import walletService from '../lib/walletService';

// Enhanced Meteor Effect Component - Hydration Safe
const MeteorEffect = ({ number = 25 }) => {
  const [meteors, setMeteors] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate meteors with deterministic positions based on index
    const generatedMeteors = Array.from({ length: number }, (_, idx) => ({
      id: idx,
      top: ((idx * 37) % 100), // Deterministic positioning
      left: ((idx * 23) % 100),
      duration: 3 + (idx % 6),
      delay: (idx * 0.3) % 2
    }));
    
    setMeteors(generatedMeteors);
    setMounted(true);
  }, [number]);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }
  
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 1,
      '@keyframes meteor-fall': {
        '0%': { 
          transform: 'rotate(215deg) translateX(0)',
          opacity: 0
        },
        '10%': { 
          opacity: 1
        },
        '90%': { 
          opacity: 1
        },
        '100%': { 
          transform: 'rotate(215deg) translateX(-600px)',
          opacity: 0
        }
      }
    }}>
      {meteors.map((meteor) => (
        <Box
          key={`meteor-${meteor.id}`}
          sx={{
            position: 'absolute',
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            boxShadow: '0 0 8px rgba(102, 126, 234, 0.6), 0 0 16px rgba(118, 75, 162, 0.4)',
            transform: 'rotate(215deg)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '80px',
              height: '2px',
              background: 'linear-gradient(to right, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.6), transparent)',
              filter: 'blur(1px)',
              borderRadius: '2px',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '1px',
              background: 'linear-gradient(to right, rgba(240, 147, 251, 0.9), rgba(102, 126, 234, 0.7), transparent)',
              filter: 'blur(0.5px)',
              borderRadius: '1px',
            },
            animation: `meteor-fall ${meteor.duration}s linear infinite`,
            animationDelay: `${meteor.delay}s`
          }}
        />
      ))}
    </Box>
  );
};

// Swap Theme Background with Enhanced Meteor Effect
const DarkBackgroundWithMeteors = ({ children }) => {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(240, 147, 251, 0.06) 0%, transparent 50%),
        #000000
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Background Elements - Swap Theme */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(150px)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0,
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-30px) scale(1.15)' }
        }
      }} />
      <Box sx={{
        position: 'absolute',
        top: '50%',
        right: '10%',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.10) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '25%',
        left: '25%',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(240, 147, 251, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 12s ease-in-out infinite',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        top: '35%',
        left: '60%',
        width: '240px',
        height: '240px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 14s ease-in-out infinite',
        zIndex: 0
      }} />

      {/* Enhanced Meteor Effect */}
      <MeteorEffect number={30} />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

// Perfect Stats Card Component - Optimized Flexbox & Centered
const StatsCard = ({ icon, title, value, subtitle, color, loading, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 4,
        height: '180px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 30px 60px ${color}15, 0 0 0 1px ${color}20`,
          border: `1px solid ${color}30`,
          background: 'rgba(255, 255, 255, 0.03)',
          '& .stats-icon': {
            transform: 'scale(1.15) rotate(5deg)',
            boxShadow: `0 12px 30px ${color}30`
          },
          '& .stats-value': {
            color: color,
            textShadow: `0 0 20px ${color}30`
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${color}, ${color}80, ${color}40)`,
        }
      }}>
        <CardContent sx={{ 
          p: 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Icon Section */}
          <Box 
            className="stats-icon"
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              transition: 'all 0.4s ease',
              border: `2px solid ${color}25`,
              boxShadow: `0 8px 25px ${color}15`,
              mb: 2
            }}
          >
            {loading ? <CircularProgress size={30} sx={{ color }} /> : React.cloneElement(icon, { style: { fontSize: 30 } })}
          </Box>

          {/* Title */}
          <Typography variant="body2" sx={{ 
            color: 'rgba(255, 255, 255, 0.85)', 
            fontWeight: 600,
            fontSize: '0.9rem',
            mb: 1,
            lineHeight: 1.3
          }}>
            {loading ? <Skeleton width="100%" /> : title}
          </Typography>

          {/* Value */}
          <Typography 
            className="stats-value"
            variant="h4" 
            sx={{ 
              color: '#fff', 
              fontWeight: 800,
              fontSize: { xs: '1.6rem', md: '1.8rem' },
              lineHeight: 1.1,
              mb: 1,
              transition: 'all 0.4s ease'
            }}
          >
            {loading ? <Skeleton width="80%" /> : value}
          </Typography>

          {/* Subtitle */}
          <Typography variant="caption" sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.5px'
          }}>
            {loading ? <Skeleton width="70%" /> : subtitle}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Loan Pool Card Component
const LoanPoolCard = ({ pool, onBorrow, index }) => {
  const getHealthColor = (ltv) => {
    if (ltv <= 0.6) return '#22c55e';
    if (ltv <= 0.8) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthLabel = (ltv) => {
    if (ltv <= 0.6) return 'Healthy';
    if (ltv <= 0.8) return 'Warning';
    return 'High Risk';
  };

  // Real Token Icons
  const getTokenIcon = (asset) => {
    const iconMap = {
      'XLM': (
        <Box sx={{
          width: 48, 
          height: 48, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          border: '2px solid #fff'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#fff"/>
            <path d="M12 8L12.5 11.5L16 12L12.5 12.5L12 16L11.5 12.5L8 12L11.5 11.5L12 8Z" fill="#000"/>
          </svg>
        </Box>
      ),
      'USDC': (
        <Box sx={{
          width: 48, 
          height: 48, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2775CA 0%, #5A9FD4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(39, 117, 202, 0.4)',
          border: '2px solid #fff'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#fff"/>
            <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" fill="none" stroke="#2775CA" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#2775CA" fontWeight="bold">$</text>
          </svg>
        </Box>
      ),
      'BTC': (
        <Box sx={{
          width: 48, 
          height: 48, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F7931A 0%, #FFB84D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(247, 147, 26, 0.4)',
          border: '2px solid #fff'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 8.5C16.5 7.5 15.8 6.8 14.5 6.8H13V5H11.5V6.8H10V5H8.5V6.8H7V8.3H8.3C8.7 8.3 9 8.6 9 9V15C9 15.4 8.7 15.7 8.3 15.7H7V17.2H8.5V19H10V17.2H11.5V19H13V17.2H14.5C15.8 17.2 16.5 16.5 16.5 15.5V8.5Z" fill="#fff"/>
            <path d="M11.5 10H13.5C14 10 14.5 10.2 14.5 10.8C14.5 11.4 14 11.6 13.5 11.6H11.5V10Z" fill="#F7931A"/>
            <path d="M11.5 12.4H13.8C14.3 12.4 14.8 12.6 14.8 13.3C14.8 14 14.3 14.2 13.8 14.2H11.5V12.4Z" fill="#F7931A"/>
          </svg>
        </Box>
      ),
      'ETH': (
        <Box sx={{
          width: 48, 
          height: 48, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #627EEA 0%, #8FA4F3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(98, 126, 234, 0.4)',
          border: '2px solid #fff'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12.5 8.5L18 12L12 16L6 12L11.5 8.5L12 2Z" fill="#fff"/>
            <path d="M12 16.5L18 12.5L12 22L6 12.5L12 16.5Z" fill="#fff" opacity="0.8"/>
          </svg>
        </Box>
      )
    };

    return iconMap[asset] || (
      <Box sx={{
        width: 48, 
        height: 48, 
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${pool.color}40, ${pool.color}60)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: pool.color,
        fontSize: '1.2rem',
        fontWeight: 700,
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        {asset}
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 4,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 30px 60px ${pool.color}15, 0 0 0 1px ${pool.color}30`,
          border: `1px solid ${pool.color}40`,
          background: 'rgba(255, 255, 255, 0.04)'
        }
      }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {getTokenIcon(pool.asset)}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                {pool.name}
              </Typography>
              <Chip
                label={getHealthLabel(pool.maxLTV)}
                size="small"
                sx={{
                  bgcolor: `${getHealthColor(pool.maxLTV)}15`,
                  color: getHealthColor(pool.maxLTV),
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: `1px solid ${getHealthColor(pool.maxLTV)}30`
                }}
              />
            </Box>
          </Box>

          {/* Pool Details */}
          <Box sx={{ mb: 3, flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Interest Rate
              </Typography>
              <Typography variant="body2" sx={{ color: pool.color, fontWeight: 600 }}>
                {pool.interestRate}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Max LTV
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                {(pool.maxLTV * 100).toFixed(0)}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                ${pool.available.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Utilization
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                {pool.utilization}%
              </Typography>
            </Box>

            {/* Utilization Bar */}
            <LinearProgress
              variant="determinate"
              value={pool.utilization}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: pool.color,
                  borderRadius: 3
                }
              }}
            />
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => onBorrow(pool)}
            sx={{
              background: `linear-gradient(135deg, ${pool.color}, ${pool.color}80)`,
              color: '#fff',
              fontWeight: 700,
              py: 1.5,
              mt: 'auto',
              '&:hover': {
                background: `linear-gradient(135deg, ${pool.color}DD, ${pool.color}BB)`,
                transform: 'translateY(-1px)',
                boxShadow: `0 8px 25px ${pool.color}40`
              }
            }}
          >
            Borrow
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Active Loan Card Component
const ActiveLoanCard = ({ loan, onManage, onRepay, index }) => {
  const getHealthColor = (health) => {
    if (health >= 80) return '#22c55e';
    if (health >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthIcon = (health) => {
    if (health >= 80) return <CheckCircleIcon />;
    if (health >= 60) return <WarningIcon />;
    return <ErrorIcon />;
  };

  // Real Token Icons for Active Loans
  const getTokenIcon = (asset) => {
    const iconMap = {
      'XLM': (
        <Box sx={{
          width: 40, 
          height: 40, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          border: '2px solid #fff'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#fff"/>
            <path d="M12 8L12.5 11.5L16 12L12.5 12.5L12 16L11.5 12.5L8 12L11.5 11.5L12 8Z" fill="#000"/>
          </svg>
        </Box>
      ),
      'USDC': (
        <Box sx={{
          width: 40, 
          height: 40, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2775CA 0%, #5A9FD4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(39, 117, 202, 0.4)',
          border: '2px solid #fff'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#fff"/>
            <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" fill="none" stroke="#2775CA" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#2775CA" fontWeight="bold">$</text>
          </svg>
        </Box>
      ),
      'BTC': (
        <Box sx={{
          width: 40, 
          height: 40, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F7931A 0%, #FFB84D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(247, 147, 26, 0.4)',
          border: '2px solid #fff'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 8.5C16.5 7.5 15.8 6.8 14.5 6.8H13V5H11.5V6.8H10V5H8.5V6.8H7V8.3H8.3C8.7 8.3 9 8.6 9 9V15C9 15.4 8.7 15.7 8.3 15.7H7V17.2H8.5V19H10V17.2H11.5V19H13V17.2H14.5C15.8 17.2 16.5 16.5 16.5 15.5V8.5Z" fill="#fff"/>
            <path d="M11.5 10H13.5C14 10 14.5 10.2 14.5 10.8C14.5 11.4 14 11.6 13.5 11.6H11.5V10Z" fill="#F7931A"/>
            <path d="M11.5 12.4H13.8C14.3 12.4 14.8 12.6 14.8 13.3C14.8 14 14.3 14.2 13.8 14.2H11.5V12.4Z" fill="#F7931A"/>
          </svg>
        </Box>
      ),
      'ETH': (
        <Box sx={{
          width: 40, 
          height: 40, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #627EEA 0%, #8FA4F3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(98, 126, 234, 0.4)',
          border: '2px solid #fff'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12.5 8.5L18 12L12 16L6 12L11.5 8.5L12 2Z" fill="#fff"/>
            <path d="M12 16.5L18 12.5L12 22L6 12.5L12 16.5Z" fill="#fff" opacity="0.8"/>
          </svg>
        </Box>
      )
    };

    return iconMap[asset] || (
      <Box sx={{
        width: 40, 
        height: 40, 
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${loan.color}40, ${loan.color}60)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: loan.color,
        fontSize: '1rem',
        fontWeight: 700,
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        {asset}
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 4,
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(6px)',
          border: `1px solid ${loan.color}40`,
          boxShadow: `0 15px 40px ${loan.color}15`,
          background: 'rgba(255, 255, 255, 0.04)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Loan Info */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getTokenIcon(loan.asset)}
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                    ${loan.amount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {loan.asset} Loan
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Health Score */}
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {React.cloneElement(getHealthIcon(loan.health), {
                  sx: { color: getHealthColor(loan.health), fontSize: 20 }
                })}
                <Typography variant="body2" sx={{ color: getHealthColor(loan.health), fontWeight: 600 }}>
                  {loan.health}%
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Health Score
              </Typography>
            </Box>

            {/* Interest Rate */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                {loan.interestRate}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                APR
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <Button
                variant="contained"
                onClick={() => onRepay(loan.id)}
                sx={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  minWidth: 100,
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
                  }
                }}
              >
                Repay
              </Button>
              <Button
                variant="outlined"
                onClick={() => onManage(loan)}
                sx={{
                  borderColor: loan.color,
                  color: loan.color,
                  minWidth: 100,
                  '&:hover': {
                    borderColor: loan.color,
                    bgcolor: `${loan.color}20`
                  }
                }}
              >
                Manage
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function LoansPage() {
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [explanationOpen, setExplanationOpen] = useState(false);

  // Stats data
  const [stats, setStats] = useState({
    totalBorrowed: 2450000,
    activeLoans: 847,
    averageInterest: 7.8,
    totalCollateral: 4250000
  });

  // Loan pools data - Dynamic with localStorage
  const [loanPools, setLoanPools] = useState([
    {
      id: 'xlm-pool',
      name: 'XLM Lending Pool',
      asset: 'XLM',
      interestRate: 6.5,
      maxLTV: 0.7,
      available: 850000,
      utilization: 73,
      color: '#667eea'
    },
    {
      id: 'usdc-pool',
      name: 'USDC Lending Pool',
      asset: 'USDC',
      interestRate: 8.2,
      maxLTV: 0.8,
      available: 1200000,
      utilization: 89,
      color: '#764ba2'
    },
    {
      id: 'btc-pool',
      name: 'BTC Lending Pool',
      asset: 'BTC',
      interestRate: 5.8,
      maxLTV: 0.6,
      available: 2800000,
      utilization: 65,
      color: '#f093fb'
    },
    {
      id: 'eth-pool',
      name: 'ETH Lending Pool',
      asset: 'ETH',
      interestRate: 7.1,
      maxLTV: 0.75,
      available: 1800000,
      utilization: 82,
      color: '#667eea'
    }
  ]);

  // Active loans data - Dynamic with localStorage
  const [activeLoans, setActiveLoans] = useState([]);

  useEffect(() => {
    loadLoanData();
  }, []);

  // localStorage functions
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  const updatePoolData = (loans) => {
    setLoanPools(prevPools => 
      prevPools.map(pool => {
        const poolLoans = loans.filter(loan => loan.asset === pool.asset);
        const totalBorrowed = poolLoans.reduce((sum, loan) => sum + loan.amount, 0);
        
        // Update available and utilization based on loans
        const updatedAvailable = Math.max(0, pool.available - totalBorrowed);
        const updatedUtilization = Math.min(100, 
          Math.round((totalBorrowed / (pool.available + totalBorrowed)) * 100)
        );
        
        return {
          ...pool,
          available: updatedAvailable,
          utilization: updatedUtilization
        };
      })
    );
  };

  const updateStatsData = (loans) => {
    const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const averageInterest = loans.length > 0 
      ? loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length 
      : 7.8;
    
    setStats(prevStats => ({
      ...prevStats,
      totalBorrowed: prevStats.totalBorrowed + totalBorrowed,
      activeLoans: loans.length,
      averageInterest: averageInterest
    }));
  };

  const loadLoanData = async () => {
    setLoading(true);
    try {
      // Check wallet connection
      const walletStatus = await walletService.getConnectionStatusWithBalance();
      setWalletConnected(walletStatus.isConnected);
      setWalletAddress(walletStatus.address || '');

      // Load data from localStorage
      const savedLoans = loadFromLocalStorage('swave-loans', []);
      const savedStats = loadFromLocalStorage('swave-loan-stats', {
        totalBorrowed: 2450000,
        activeLoans: 847,
        averageInterest: 7.8,
        totalCollateral: 4250000
      });

      // Update state with saved data
      setActiveLoans(savedLoans);
      setStats(savedStats);

      // Update pool data based on saved loans
      updatePoolData(savedLoans);

      // Simulate data loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Failed to load loan data:', error);
      setSnackbar({ open: true, message: 'Failed to load loan data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = (pool) => {
    setSelectedPool(pool);
    setBorrowDialogOpen(true);
  };

  const handleManage = (loan) => {
    setSelectedLoan(loan);
    setManageDialogOpen(true);
  };

  const handleExecuteBorrow = async () => {
    if (!walletConnected) {
      setSnackbar({ open: true, message: 'Please connect your wallet', severity: 'error' });
      return;
    }

    if (!borrowAmount || !collateralAmount) {
      setSnackbar({ open: true, message: 'Please enter all required amounts', severity: 'error' });
      return;
    }

    try {
      // Simulate borrow operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new loan
      const newLoan = {
        id: `loan-${Date.now()}`,
        asset: selectedPool.asset,
        amount: parseFloat(borrowAmount),
        collateralAmount: parseFloat(collateralAmount),
        interestRate: selectedPool.interestRate,
        health: Math.floor(Math.random() * 20) + 75, // Random health 75-95
        color: selectedPool.color,
        createdAt: new Date().toISOString(),
        poolId: selectedPool.id
      };

      // Update active loans
      const updatedLoans = [...activeLoans, newLoan];
      setActiveLoans(updatedLoans);

      // Save to localStorage
      saveToLocalStorage('swave-loans', updatedLoans);

      // Update pool data
      updatePoolData(updatedLoans);

      // Update stats
      updateStatsData(updatedLoans);

      // Save updated stats
      setStats(prevStats => {
        const newStats = {
          ...prevStats,
          totalBorrowed: prevStats.totalBorrowed + newLoan.amount,
          activeLoans: updatedLoans.length,
          totalCollateral: prevStats.totalCollateral + newLoan.collateralAmount
        };
        saveToLocalStorage('swave-loan-stats', newStats);
        return newStats;
      });
      
      setSnackbar({ open: true, message: 'Loan successfully created!', severity: 'success' });
      setBorrowDialogOpen(false);
      setBorrowAmount('');
      setCollateralAmount('');
      
    } catch (error) {
      console.error('Borrow operation failed:', error);
      setSnackbar({ open: true, message: 'Borrow operation failed', severity: 'error' });
    }
  };

  const handleRepayLoan = async (loanId) => {
    try {
      // Simulate repay operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find and remove the loan
      const loanToRemove = activeLoans.find(loan => loan.id === loanId);
      const updatedLoans = activeLoans.filter(loan => loan.id !== loanId);
      
      setActiveLoans(updatedLoans);
      
      // Save to localStorage
      saveToLocalStorage('swave-loans', updatedLoans);
      
      // Update pool data
      updatePoolData(updatedLoans);
      
      // Update stats
      if (loanToRemove) {
        setStats(prevStats => {
          const newStats = {
            ...prevStats,
            totalBorrowed: Math.max(0, prevStats.totalBorrowed - loanToRemove.amount),
            activeLoans: updatedLoans.length,
            totalCollateral: Math.max(0, prevStats.totalCollateral - loanToRemove.collateralAmount)
          };
          saveToLocalStorage('swave-loan-stats', newStats);
          return newStats;
        });
      }
      
      setSnackbar({ open: true, message: 'Loan successfully repaid!', severity: 'success' });
      
    } catch (error) {
      console.error('Repay operation failed:', error);
      setSnackbar({ open: true, message: 'Repay operation failed', severity: 'error' });
    }
  };

  return (
    <DarkBackgroundWithMeteors>
      <Header />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h2" sx={{ 
              color: '#fff', 
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Decentralized
              </motion.span>
              {' '}
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Lending
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
                Borrow against your crypto assets with competitive rates and transparent terms. 
                Access instant liquidity without selling your holdings.
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

          {/* Collapsible Explanation Section - In Hero */}
          <AnimatePresence>
            {explanationOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  px: 2,
                  mt: 4
                }}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    maxWidth: '1200px',
                    width: '100%'
                  }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                      <Typography variant="h4" sx={{ 
                        color: '#fff', 
                        mb: 4, 
                        fontWeight: 700,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.8rem', md: '2.2rem' }
                      }}>
                        How Decentralized Lending Works
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
                        Decentralized lending enables you to borrow funds by using your crypto assets as collateral. 
                        Our smart contracts manage the entire process transparently and securely.
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        gap: 4,
                        mb: 5
                      }}>
                        <Box sx={{ 
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          maxWidth: { xs: '100%', md: '300px' }
                        }}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
                          >
                            <Box sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 4,
                              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0.05) 100%)',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 3,
                              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)'
                            }}>
                              <SecurityIcon sx={{ fontSize: 40, color: '#667eea' }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
                              Provide Collateral
                            </Typography>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1rem', lineHeight: 1.7, flex: 1 }}>
                              Lock your crypto assets as collateral to secure your loan. Our smart contracts ensure your assets are safe and automatically managed with real-time monitoring.
                            </Typography>
                          </motion.div>
                        </Box>
                        
                        <Box sx={{ 
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          maxWidth: { xs: '100%', md: '300px' }
                        }}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
                          >
                            <Box sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 4,
                              background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.15) 0%, rgba(118, 75, 162, 0.05) 100%)',
                              border: '2px solid rgba(118, 75, 162, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 3,
                              boxShadow: '0 8px 32px rgba(118, 75, 162, 0.15)'
                            }}>
                              <MoneyIcon sx={{ fontSize: 40, color: '#764ba2' }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
                              Borrow Instantly
                            </Typography>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1rem', lineHeight: 1.7, flex: 1 }}>
                              Receive instant liquidity up to 80% of your collateral value. Competitive interest rates and flexible repayment terms without selling your holdings.
                            </Typography>
                          </motion.div>
                        </Box>
                        
                        <Box sx={{ 
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          maxWidth: { xs: '100%', md: '300px' }
                        }}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
                          >
                            <Box sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 4,
                              background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(240, 147, 251, 0.05) 100%)',
                              border: '2px solid rgba(240, 147, 251, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 3,
                              boxShadow: '0 8px 32px rgba(240, 147, 251, 0.15)'
                            }}>
                              <TimelineIcon sx={{ fontSize: 40, color: '#f093fb' }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
                              Manage Position
                            </Typography>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1rem', lineHeight: 1.7, flex: 1 }}>
                              Monitor your loan health, add collateral, or repay anytime. Real-time liquidation protection and automated risk management keeps you secure.
                            </Typography>
                          </motion.div>
                        </Box>
                      </Box>
                      
                      {/* Additional Benefits Section */}
                      <Box sx={{ 
                        pt: 4, 
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Typography variant="h5" sx={{ 
                          color: '#fff', 
                          mb: 4, 
                          fontWeight: 700,
                          textAlign: 'center'
                        }}>
                          Why Choose Swave Lending?
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'center',
                          alignItems: 'stretch',
                          gap: 3,
                          flexWrap: 'wrap'
                        }}>
                          <Box sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minWidth: { xs: '100%', sm: '200px' },
                            maxWidth: { xs: '100%', sm: '220px' }
                          }}>
                            <SpeedIcon sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                              Instant Liquidity
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Get funds immediately without waiting periods
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minWidth: { xs: '100%', sm: '200px' },
                            maxWidth: { xs: '100%', sm: '220px' }
                          }}>
                            <SecurityIcon sx={{ fontSize: 40, color: '#764ba2', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                              Secure & Audited
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Smart contracts audited by leading security firms
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minWidth: { xs: '100%', sm: '200px' },
                            maxWidth: { xs: '100%', sm: '220px' }
                          }}>
                            <TrendingUpIcon sx={{ fontSize: 40, color: '#f093fb', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                              Competitive Rates
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Best-in-class interest rates for crypto lending
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minWidth: { xs: '100%', sm: '200px' },
                            maxWidth: { xs: '100%', sm: '220px' }
                          }}>
                            <CheckCircleIcon sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                              No Credit Check
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Borrow based on collateral, not credit history
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Risk Warning */}
                      <Alert 
                        severity="warning" 
                        sx={{ 
                          mt: 4,
                          bgcolor: 'rgba(255, 152, 0, 0.05)',
                          color: 'rgba(255, 152, 0, 0.9)',
                          border: '1px solid rgba(255, 152, 0, 0.2)',
                          '& .MuiAlert-icon': {
                            color: 'rgba(255, 152, 0, 0.9)'
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Risk Warning: 
                        </Typography>
                        <Typography variant="body2">
                          Cryptocurrency lending involves liquidation risk. If your collateral value drops below the liquidation threshold, 
                          your collateral may be liquidated to repay the loan. Always maintain a healthy collateral ratio and monitor market conditions.
                        </Typography>
                      </Alert>
                    </CardContent>
                  </Card>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Stats Section - Perfect Flexbox Layout */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%'
          }}>
            <Box sx={{ 
              flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
              minWidth: { xs: '160px', md: '200px' },
              maxWidth: { xs: 'calc(50% - 12px)', md: '300px' }
            }}>
              <StatsCard
                icon={<MoneyIcon />}
                title="Total Borrowed"
                value={`$${stats.totalBorrowed.toLocaleString()}`}
                subtitle="Across all pools"
                color="#667eea"
                loading={loading}
                delay={0}
              />
            </Box>
            <Box sx={{ 
              flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
              minWidth: { xs: '160px', md: '200px' },
              maxWidth: { xs: 'calc(50% - 12px)', md: '300px' }
            }}>
              <StatsCard
                icon={<LoanIcon />}
                title="Active Loans"
                value={stats.activeLoans.toLocaleString()}
                subtitle="Currently active"
                color="#764ba2"
                loading={loading}
                delay={0.1}
              />
            </Box>
            <Box sx={{ 
              flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
              minWidth: { xs: '160px', md: '200px' },
              maxWidth: { xs: 'calc(50% - 12px)', md: '300px' }
            }}>
              <StatsCard
                icon={<SpeedIcon />}
                title="Avg Interest"
                value={`${stats.averageInterest}%`}
                subtitle="Weighted average"
                color="#f093fb"
                loading={loading}
                delay={0.2}
              />
            </Box>
            <Box sx={{ 
              flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
              minWidth: { xs: '160px', md: '200px' },
              maxWidth: { xs: 'calc(50% - 12px)', md: '300px' }
            }}>
              <StatsCard
                icon={<SecurityIcon />}
                title="Total Collateral"
                value={`$${stats.totalCollateral.toLocaleString()}`}
                subtitle="Locked in pools"
                color="#667eea"
                loading={loading}
                delay={0.3}
              />
            </Box>
          </Box>
        </Box>



        {/* Loan Pools Section */}
        <Box sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography variant="h4" sx={{ 
              color: '#fff', 
              fontWeight: 700, 
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <BankIcon sx={{ color: '#764ba2' }} />
              Available Lending Pools
            </Typography>
          </motion.div>

          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {loanPools.map((pool, index) => (
              <Grid item xs={12} sm={6} md={3} key={pool.id}>
                <LoanPoolCard 
                  pool={pool} 
                  onBorrow={handleBorrow}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Active Loans Section */}
        {activeLoans.length > 0 && (
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography variant="h4" sx={{ 
                color: '#fff', 
                fontWeight: 700, 
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <TimelineIcon sx={{ color: '#f093fb' }} />
                Your Active Loans
              </Typography>
            </motion.div>

            {activeLoans.map((loan, index) => (
              <ActiveLoanCard 
                key={loan.id}
                loan={loan}
                onManage={handleManage}
                onRepay={handleRepayLoan}
                index={index}
              />
            ))}
          </Box>
        )}

        {/* Borrow Dialog */}
        <Dialog
          open={borrowDialogOpen}
          onClose={() => setBorrowDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#fff', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Real Token Icon for Dialog */}
              {selectedPool && (
                <Box sx={{
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  background: selectedPool.asset === 'XLM' ? 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)' :
                              selectedPool.asset === 'USDC' ? 'linear-gradient(135deg, #2775CA 0%, #5A9FD4 100%)' :
                              selectedPool.asset === 'BTC' ? 'linear-gradient(135deg, #F7931A 0%, #FFB84D 100%)' :
                              selectedPool.asset === 'ETH' ? 'linear-gradient(135deg, #627EEA 0%, #8FA4F3 100%)' :
                              `linear-gradient(135deg, ${selectedPool.color}40, ${selectedPool.color}60)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  border: '2px solid #fff'
                }}>
                  {selectedPool.asset === 'XLM' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#fff"/>
                      <path d="M12 8L12.5 11.5L16 12L12.5 12.5L12 16L11.5 12.5L8 12L11.5 11.5L12 8Z" fill="#000"/>
                    </svg>
                  )}
                  {selectedPool.asset === 'USDC' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#fff"/>
                      <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" fill="none" stroke="#2775CA" strokeWidth="2"/>
                      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#2775CA" fontWeight="bold">$</text>
                    </svg>
                  )}
                  {selectedPool.asset === 'BTC' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 8.5C16.5 7.5 15.8 6.8 14.5 6.8H13V5H11.5V6.8H10V5H8.5V6.8H7V8.3H8.3C8.7 8.3 9 8.6 9 9V15C9 15.4 8.7 15.7 8.3 15.7H7V17.2H8.5V19H10V17.2H11.5V19H13V17.2H14.5C15.8 17.2 16.5 16.5 16.5 15.5V8.5Z" fill="#fff"/>
                      <path d="M11.5 10H13.5C14 10 14.5 10.2 14.5 10.8C14.5 11.4 14 11.6 13.5 11.6H11.5V10Z" fill="#F7931A"/>
                      <path d="M11.5 12.4H13.8C14.3 12.4 14.8 12.6 14.8 13.3C14.8 14 14.3 14.2 13.8 14.2H11.5V12.4Z" fill="#F7931A"/>
                    </svg>
                  )}
                  {selectedPool.asset === 'ETH' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L12.5 8.5L18 12L12 16L6 12L11.5 8.5L12 2Z" fill="#fff"/>
                      <path d="M12 16.5L18 12.5L12 22L6 12.5L12 16.5Z" fill="#fff" opacity="0.8"/>
                    </svg>
                  )}
                  {!['XLM', 'USDC', 'BTC', 'ETH'].includes(selectedPool.asset) && (
                    <Typography sx={{ color: selectedPool.color, fontSize: '1rem', fontWeight: 700 }}>
                      {selectedPool.asset}
                    </Typography>
                  )}
                </Box>
              )}
              <Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                  Borrow {selectedPool?.asset}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {selectedPool?.name}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setBorrowDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                label="Borrow Amount"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: selectedPool?.asset,
                  sx: { color: '#fff' }
                }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.6)' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />
              
              <TextField
                label="Collateral Amount"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: 'XLM',
                  sx: { color: '#fff' }
                }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.6)' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />

              {/* Loan Terms */}
              <Box sx={{ 
                p: 3, 
                background: 'rgba(255, 255, 255, 0.02)', 
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>
                  Loan Terms
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Interest Rate
                  </Typography>
                  <Typography variant="body2" sx={{ color: selectedPool?.color, fontWeight: 700, fontSize: '0.9rem' }}>
                    {selectedPool?.interestRate}% APR
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Max LTV
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                    {selectedPool ? (selectedPool.maxLTV * 100).toFixed(0) : 0}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Liquidation Threshold
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                    85%
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setBorrowDialogOpen(false)}
              sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleExecuteBorrow}
              disabled={!borrowAmount || !collateralAmount}
              sx={{
                background: selectedPool ? `linear-gradient(135deg, ${selectedPool.color}, ${selectedPool.color}80)` : '#333',
                '&:hover': {
                  background: selectedPool ? `linear-gradient(135deg, ${selectedPool.color}DD, ${selectedPool.color}BB)` : '#444'
                }
              }}
            >
              Confirm Borrow
            </Button>
          </DialogActions>
        </Dialog>

        {/* Manage Loan Dialog */}
        <Dialog
          open={manageDialogOpen}
          onClose={() => setManageDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              maxHeight: '90vh',
              width: '95%',
              maxWidth: '900px'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#fff', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Real Token Icon for Manage Dialog */}
              {selectedLoan && (
                <Box sx={{
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%',
                  background: selectedLoan.asset === 'XLM' ? 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)' :
                              selectedLoan.asset === 'USDC' ? 'linear-gradient(135deg, #2775CA 0%, #5A9FD4 100%)' :
                              selectedLoan.asset === 'BTC' ? 'linear-gradient(135deg, #F7931A 0%, #FFB84D 100%)' :
                              selectedLoan.asset === 'ETH' ? 'linear-gradient(135deg, #627EEA 0%, #8FA4F3 100%)' :
                              `linear-gradient(135deg, ${selectedLoan.color}40, ${selectedLoan.color}60)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  border: '2px solid #fff'
                }}>
                  {selectedLoan.asset === 'XLM' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#fff"/>
                      <path d="M12 8L12.5 11.5L16 12L12.5 12.5L12 16L11.5 12.5L8 12L11.5 11.5L12 8Z" fill="#000"/>
                    </svg>
                  )}
                  {selectedLoan.asset === 'USDC' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#fff"/>
                      <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" fill="none" stroke="#2775CA" strokeWidth="2"/>
                      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#2775CA" fontWeight="bold">$</text>
                    </svg>
                  )}
                  {selectedLoan.asset === 'BTC' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 8.5C16.5 7.5 15.8 6.8 14.5 6.8H13V5H11.5V6.8H10V5H8.5V6.8H7V8.3H8.3C8.7 8.3 9 8.6 9 9V15C9 15.4 8.7 15.7 8.3 15.7H7V17.2H8.5V19H10V17.2H11.5V19H13V17.2H14.5C15.8 17.2 16.5 16.5 16.5 15.5V8.5Z" fill="#fff"/>
                      <path d="M11.5 10H13.5C14 10 14.5 10.2 14.5 10.8C14.5 11.4 14 11.6 13.5 11.6H11.5V10Z" fill="#F7931A"/>
                      <path d="M11.5 12.4H13.8C14.3 12.4 14.8 12.6 14.8 13.3C14.8 14 14.3 14.2 13.8 14.2H11.5V12.4Z" fill="#F7931A"/>
                    </svg>
                  )}
                  {selectedLoan.asset === 'ETH' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L12.5 8.5L18 12L12 16L6 12L11.5 8.5L12 2Z" fill="#fff"/>
                      <path d="M12 16.5L18 12.5L12 22L6 12.5L12 16.5Z" fill="#fff" opacity="0.8"/>
                    </svg>
                  )}
                  {selectedLoan && !['XLM', 'USDC', 'BTC', 'ETH'].includes(selectedLoan.asset) && (
                    <Typography sx={{ color: selectedLoan.color, fontSize: '1.2rem', fontWeight: 700 }}>
                      {selectedLoan.asset}
                    </Typography>
                  )}
                </Box>
              )}
              <Box>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  Manage {selectedLoan?.asset} Loan
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Loan ID: {selectedLoan?.id}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setManageDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
                    <DialogContent sx={{ 
            p: 0, 
            maxHeight: '80vh', 
            overflowY: 'auto'
          }}>
            {selectedLoan && (
              <Box sx={{ 
                p: 4,
                width: '100%'
              }}>
                {/* Top Section - Loan Overview & Health */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  mb: 4,
                  width: '100%'
                }}>
                  {/* Loan Overview */}
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${selectedLoan.color}30`,
                    borderRadius: 3,
                    p: 3,
                    flex: 1,
                    height: 'fit-content'
                  }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700, textAlign: 'center' }}>
                      Loan Overview
                    </Typography>
                    
                    <Stack spacing={2.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                          Loan Amount
                        </Typography>
                        <Typography variant="h6" sx={{ color: selectedLoan.color, fontWeight: 700 }}>
                          ${selectedLoan.amount.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                          Collateral
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {selectedLoan.collateralAmount?.toLocaleString() || (selectedLoan.amount * 1.3).toLocaleString()} XLM
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                          Interest Rate
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {selectedLoan.interestRate}% APR
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                          LTV Ratio
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {((selectedLoan.amount / (selectedLoan.collateralAmount || selectedLoan.amount * 1.3)) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                          Created
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {selectedLoan.createdAt ? new Date(selectedLoan.createdAt).toLocaleDateString() : 'Recently'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>

                  {/* Health & Risk */}
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${selectedLoan.health >= 80 ? '#22c55e' : selectedLoan.health >= 60 ? '#f59e0b' : '#ef4444'}30`,
                    borderRadius: 3,
                    p: 3,
                    flex: 1,
                    height: 'fit-content'
                  }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700, textAlign: 'center' }}>
                      Health & Risk
                    </Typography>
                    
                    <Stack spacing={3} sx={{ alignItems: 'center' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 100, 
                          height: 100, 
                          borderRadius: '50%',
                          background: `conic-gradient(${selectedLoan.health >= 80 ? '#22c55e' : selectedLoan.health >= 60 ? '#f59e0b' : '#ef4444'} ${selectedLoan.health * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          position: 'relative'
                        }}>
                          <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="h4" sx={{ 
                              color: selectedLoan.health >= 80 ? '#22c55e' : selectedLoan.health >= 60 ? '#f59e0b' : '#ef4444',
                              fontWeight: 800,
                              fontSize: '1.8rem'
                            }}>
                              {selectedLoan.health}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h6" sx={{ 
                          color: selectedLoan.health >= 80 ? '#22c55e' : selectedLoan.health >= 60 ? '#f59e0b' : '#ef4444',
                          fontWeight: 700,
                          fontSize: '1.1rem'
                        }}>
                          {selectedLoan.health >= 80 ? 'Healthy' : selectedLoan.health >= 60 ? 'Warning' : 'At Risk'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                          Liquidation Price
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#ef4444', fontWeight: 700 }}>
                          ${(selectedLoan.amount * 0.85).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
                          Daily Interest
                        </Typography>
                        <Typography variant="body1" sx={{ color: selectedLoan.color, fontWeight: 600 }}>
                          ${((selectedLoan.amount * selectedLoan.interestRate / 100) / 365).toFixed(2)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Box>

                {/* Financial Details */}
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  p: 4,
                  mb: 4,
                  width: '100%'
                }}>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 700, textAlign: 'center' }}>
                    Financial Details
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 3,
                    textAlign: 'center'
                  }}>
                    <Box>
                      <Typography variant="h4" sx={{ color: selectedLoan.color, fontWeight: 800, mb: 1 }}>
                        ${selectedLoan.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
                        Outstanding
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 800, mb: 1 }}>
                        ${Math.floor(selectedLoan.amount * 0.05).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
                        Interest Paid
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 800, mb: 1 }}>
                        30 Days
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
                        Loan Duration
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 800, mb: 1 }}>
                        ${(selectedLoan.amount * 1.1).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
                        Total Repayment
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Action Buttons */}
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  p: 4,
                  width: '100%'
                }}>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 700, textAlign: 'center' }}>
                    Loan Actions
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2,
                    width: '100%'
                  }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setSnackbar({ 
                          open: true, 
                          message: 'Add Collateral feature coming soon!', 
                          severity: 'info' 
                        });
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: '#fff',
                        fontWeight: 700,
                        py: 1.5,
                        px: 3,
                        height: '50px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #16a34a, #15803d)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
                        }
                      }}
                    >
                      Add Collateral
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<RemoveIcon />}
                      onClick={() => {
                        setSnackbar({ 
                          open: true, 
                          message: 'Partial Repay feature coming soon!', 
                          severity: 'info' 
                        });
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#fff',
                        fontWeight: 700,
                        py: 1.5,
                        px: 3,
                        height: '50px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #d97706, #b45309)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
                        }
                      }}
                    >
                      Partial Repay
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<MoneyIcon />}
                      onClick={() => {
                        handleRepayLoan(selectedLoan.id);
                        setManageDialogOpen(false);
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: '#fff',
                        fontWeight: 700,
                        py: 1.5,
                        px: 3,
                        height: '50px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
                        }
                      }}
                    >
                      Full Repay
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AssessmentIcon />}
                      onClick={() => {
                        setSnackbar({ 
                          open: true, 
                          message: 'Transaction history feature coming soon!', 
                          severity: 'info' 
                        });
                      }}
                      sx={{
                        borderColor: selectedLoan.color,
                        color: selectedLoan.color,
                        fontWeight: 700,
                        py: 1.5,
                        px: 3,
                        height: '50px',
                        '&:hover': {
                          borderColor: selectedLoan.color,
                          bgcolor: `${selectedLoan.color}20`,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      View History
                    </Button>
                  </Box>
                </Card>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Button
              onClick={() => setManageDialogOpen(false)}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 600
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(118, 75, 162, 0.15) 100%)',
              color: '#fff',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              backdropFilter: 'blur(15px)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </DarkBackgroundWithMeteors>
  );
} 
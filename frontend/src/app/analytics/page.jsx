'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fade,
  Skeleton,
  Button,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as SwapIcon,
  AccountBalance as PoolIcon,
  Speed as VolumeIcon,
  Timeline as ChartIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Gavel as GavelIcon,
  FlashOn as FlashIcon,
  AutoAwesome as MagicIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  AccountBalanceWallet as WalletIcon,
  ShowChart as ShowChartIcon,
  History as HistoryIcon,
  TrendingFlat as TrendingFlatIcon,
  AccountBox as AccountBoxIcon,
  Wallet as WalletIconAlt,
  CreditCard as CreditCardIcon,
  LocalAtm as LocalAtmIcon,
  Psychology as PsychologyIcon,
  AccessTime as AccessTimeIcon,
  Favorite as FavoriteIcon,
  BarChart as BarChartIcon,
  InfoOutlined as InfoOutlinedIcon,
  MonetizationOn as MoneyIcon,
  Shield as ShieldIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';
import { SparklesCore } from '@/components/ui/sparkles';
import walletService from '../lib/walletService';
import contractService from '../lib/contractService';

// Tooltip descriptions for different sections
const tooltipDescriptions = {
  totalValue: "Total value of all your assets in USD, including portfolio positions and liquidity pools",
  gainLoss: "Total profit or loss from your DeFi activities, calculated from initial investment",
  assetAllocation: "Distribution of your assets across different tokens, showing portfolio diversification",
  performanceChart: "Portfolio value over time, showing growth trends and performance metrics",
  riskAnalysis: "Risk assessment based on volatility, concentration, and smart contract risks",
  tradingInsights: "AI-powered insights about your trading patterns and optimization opportunities",
  portfolioHealth: "Overall portfolio health score based on diversification, risk, and performance",
  marketComparison: "How your portfolio performs compared to market benchmarks and indices",
  liquidityPositions: "Your active liquidity pool positions with current value and rewards",
  liquidityPerformance: "Performance analytics for your liquidity mining activities",
  liquidityOpportunities: "New liquidity mining opportunities with potential APY and rewards",
  activityStats: "Summary of your transaction activity, success rates, and trading patterns",
  tradingPatterns: "Analysis of your trading behavior, peak hours, and preferred assets",
  gasAnalytics: "Gas fee analysis and optimization tips to reduce transaction costs",
  recentTransactions: "Your latest DeFi transactions across all protocols and activities"
};

// Interactive Chart Component
const InteractiveChart = ({ data, type = 'line', color = '#667eea', height = 180 }) => {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size with device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 25;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (type === 'line') {
      const maxValue = Math.max(...data.map(d => d.value || d));
      const minValue = Math.min(...data.map(d => d.value || d));
      const range = maxValue - minValue || 1;
      
      // Draw background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (i * chartHeight / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let i = 0; i <= 6; i++) {
        const x = padding + (i * chartWidth / 6);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }
      
      // Create gradient for area fill
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, color + '60');
      gradient.addColorStop(0.5, color + '30');
      gradient.addColorStop(1, color + '10');
      
      // Draw area fill first
      ctx.beginPath();
      const points = [];
      data.forEach((item, index) => {
        const value = item.value || item;
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        points.push({ x, y, value, index });
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      // Complete area path
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw main line with shadow
      ctx.shadowColor = color + '40';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw points with glow effect
      points.forEach((point, index) => {
        const isHovered = hoveredPoint === index;
        
        if (isHovered) {
          // Draw glow effect
          ctx.beginPath();
          ctx.arc(point.x, point.y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = color + '20';
          ctx.fill();
          
          // Draw vertical line
          ctx.beginPath();
          ctx.moveTo(point.x, padding);
          ctx.lineTo(point.x, height - padding);
          ctx.strokeStyle = color + '60';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, isHovered ? 6 : 4, 0, 2 * Math.PI);
        ctx.fillStyle = isHovered ? '#ffffff' : color;
        ctx.fill();
        
        if (isHovered) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // Store points for hover detection
      canvas.points = points;
    }
  }, [data, type, color, hoveredPoint]);
  
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.points) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find closest point
    let closestPoint = null;
    let minDistance = Infinity;
    
    canvas.points.forEach((point, index) => {
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
      if (distance < 20 && distance < minDistance) {
        minDistance = distance;
        closestPoint = index;
      }
    });
    
    if (closestPoint !== null) {
      setHoveredPoint(closestPoint);
      const point = canvas.points[closestPoint];
      setTooltip({
        show: true,
        x: e.clientX,
        y: e.clientY,
        data: {
          value: point.value,
          index: point.index,
          date: data[point.index]?.date || `Day ${point.index + 1}`
        }
      });
    } else {
      setHoveredPoint(null);
      setTooltip({ show: false, x: 0, y: 0, data: null });
    }
  };
  
  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setTooltip({ show: false, x: 0, y: 0, data: null });
  };
  
  return (
    <Box sx={{ position: 'relative', width: '100%', height: `${height}px` }}>
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          width: '100%', 
          height: `${height}px`,
          cursor: hoveredPoint !== null ? 'pointer' : 'crosshair',
          borderRadius: '8px'
        }}
      />
      
      {/* Enhanced Tooltip */}
      {tooltip.show && (
        <Box
          sx={{
            position: 'fixed',
            left: tooltip.x + 15,
            top: tooltip.y - 70,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.85))',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            zIndex: 10000,
            border: `1px solid ${color}40`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 8px 32px ${color}25, 0 4px 16px rgba(0, 0, 0, 0.4)`,
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ color: '#999', fontSize: '0.7rem', marginBottom: '4px' }}>
            {tooltip.data?.date}
          </div>
          <div style={{ color: color, fontWeight: 'bold', fontSize: '0.85rem' }}>
            {typeof tooltip.data?.value === 'number' ? 
              `${tooltip.data.value.toFixed(2)}%` : 
              tooltip.data?.value || '0'
            }
          </div>
          <div style={{ color: '#ccc', fontSize: '0.7rem', marginTop: '2px' }}>
            Performance
          </div>
        </Box>
      )}
    </Box>
  );
};

// Enhanced Dark Background
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
  );
};

// Wallet Connection Required Component
const WalletConnectionRequired = ({ onConnectWallet, loading }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      px: 2
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WalletIconAlt sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
        <Typography variant="h4" component="h2" sx={{ mb: 2, color: '#fff' }}>
          Connect Your Wallet
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#999', maxWidth: 400 }}>
          To view your personal analytics, portfolio performance, and transaction history, 
          please connect your wallet.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onConnectWallet}
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a67d8 0%, #6b46c1 100%)',
            }
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Connect Wallet'}
        </Button>
      </motion.div>
    </Box>
  );
};

// Data Service Hook
const useUserAnalytics = (walletAddress) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Fallback data for users with no transaction history
  const getFallbackData = (userAddress) => ({
    address: userAddress,
    portfolio: {
      totalValue: 12450,
      totalGainLoss: 1450,
      totalGainLossPercentage: 13.2,
      assets: [
        { symbol: 'XLM', amount: 45000, value: 5400, percentage: 43.4 },
        { symbol: 'USDC', amount: 3500, value: 3500, percentage: 28.1 },
        { symbol: 'AQUA', amount: 125000, value: 2250, percentage: 18.1 },
        { symbol: 'yXLM', amount: 8200, value: 1300, percentage: 10.4 }
      ]
    },
    liquidityPositions: [
      { 
        pool: 'XLM/USDC', 
        value: 4200, 
        apy: 12.4, 
        rewards: 245, 
        status: 'Active',
        tvl: 2450000,
        volume24h: 125000
      },
      { 
        pool: 'AQUA/XLM', 
        value: 2100, 
        apy: 18.7, 
        rewards: 156, 
        status: 'Active',
        tvl: 890000,
        volume24h: 78000
      }
    ],
    loanPositions: [
      { 
        id: 'loan_001',
        amount: 2500, 
        interestRate: 8.5, 
        status: 'Active', 
        daysRemaining: 23,
        nextPayment: 89.50,
        collateral: 'XLM',
        collateralValue: 3750
      }
    ],
    recentTransactions: [
      { type: 'swap', from: 'XLM', to: 'USDC', amount: 1000, timestamp: '2024-02-20T10:30:00Z', hash: 'abc123...def' },
      { type: 'liquidity_add', pool: 'XLM/USDC', amount: 500, timestamp: '2024-02-19T14:20:00Z', hash: 'def456...ghi' },
      { type: 'loan_repay', amount: 200, timestamp: '2024-02-18T09:15:00Z', hash: 'ghi789...jkl' },
      { type: 'swap', from: 'USDC', to: 'AQUA', amount: 800, timestamp: '2024-02-17T16:45:00Z', hash: 'jkl012...mno' },
      { type: 'liquidity_add', pool: 'AQUA/XLM', amount: 300, timestamp: '2024-02-16T11:30:00Z', hash: 'mno345...pqr' }
    ],
    performance: {
      totalReturn: 13.2,
      monthlyReturn: 2.8,
      weeklyReturn: 0.5,
      bestAsset: 'AQUA',
      worstAsset: 'yXLM',
      chartData: [
        { date: '2024-01-01', value: 11000 },
        { date: '2024-01-15', value: 11200 },
        { date: '2024-02-01', value: 12000 },
        { date: '2024-02-15', value: 12450 }
      ]
    },
    marketComparison: {
      portfolioReturn: 13.2,
      portfolioSharpe: 1.85,
      portfolioVolatility: 18.5,
      benchmarks: [
        {
          name: 'DeFi Index',
          return: 8.7,
          sharpe: 1.12,
          volatility: 24.2,
          color: '#4caf50'
        },
        {
          name: 'Stellar Average',
          return: 6.3,
          sharpe: 0.95,
          volatility: 21.8,
          color: '#ff9800'
        },
        {
          name: 'Market Leaders',
          return: 11.5,
          sharpe: 1.45,
          volatility: 19.7,
          color: '#2196f3'
        }
      ]
    }
  });

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/user-analytics?address=${walletAddress}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        
        const analytics = await response.json();
        
        // Check if user has real data from contracts
        const hasRealData = analytics && (
          analytics.creditScore || 
          analytics.collateralPositions || 
          analytics.loanHistory ||
          analytics.swapActivity
        );

        if (hasRealData) {
          console.log('User has real contract data, checking for transaction history...');
          
          // User has real contract data, but check if they have portfolio/transaction data
          const hasTransactionHistory = analytics.recentTransactions && analytics.recentTransactions.length > 0;
          const hasPortfolioData = analytics.portfolio && analytics.portfolio.assets && analytics.portfolio.assets.length > 0;
          const hasLiquidityPositions = analytics.liquidityPositions && analytics.liquidityPositions.length > 0;

          if (hasTransactionHistory && hasPortfolioData) {
            // User has complete data
            console.log('User has complete transaction history, using real data');
            setData(analytics);
          } else {
            // User has contract data but no transaction history - use fallback for missing parts
            console.log('User has limited transaction history, using fallback data for portfolio analytics');
            const fallbackData = getFallbackData(walletAddress);
            
            setData({
              ...fallbackData,
              // Keep real contract data if available
              ...(analytics.creditScore && { creditScore: analytics.creditScore }),
              ...(analytics.collateralPositions && { realCollateralPositions: analytics.collateralPositions }),
              ...(analytics.loanHistory && { realLoanHistory: analytics.loanHistory }),
              ...(analytics.swapActivity && { realSwapActivity: analytics.swapActivity }),
              // Use real data if available, otherwise fallback
              loanPositions: hasLiquidityPositions ? analytics.liquidityPositions : fallbackData.loanPositions,
            });
          }
        } else {
          // No real contract data - use complete fallback
          console.log('No real user data found, using fallback data');
          setData(getFallbackData(walletAddress));
        }
      } catch (err) {
        console.error('Error fetching user analytics:', err);
        setError(err.message);
        
        // Complete fallback on error
        console.log('Error occurred, using fallback data');
        setData(getFallbackData(walletAddress));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  return { loading, error, data };
};

// Portfolio Overview Component
const PortfolioOverview = ({ data, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box sx={{ mb: 6 }}>
                <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          width: '100%',
          flexWrap: { xs: 'wrap', lg: 'nowrap' }
        }}>
          {[...Array(4)].map((_, index) => (
            <Box
              key={index}
              sx={{ 
                flex: '1 1 auto',
                minWidth: { xs: '150px', sm: '180px', md: '200px' },
                maxWidth: { 
                  xs: 'calc(50% - 6px)', 
                  sm: 'calc(50% - 8px)', 
                  md: 'calc(25% - 12px)',
                  lg: 'none' 
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ width: '100%', height: '100%' }}
              >
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 2.5,
                  height: { xs: '110px', sm: '120px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CardContent sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <Stack alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
                      <Skeleton 
                        variant="circular" 
                        width={{ xs: 32, sm: 40 }} 
                        height={{ xs: 32, sm: 40 }} 
                        sx={{ mb: 0.5 }} 
                      />
                      <Skeleton variant="text" width="60px" height={12} />
                      <Skeleton variant="text" width="80px" height={20} />
                      <Skeleton variant="text" width="40px" height={10} />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  const portfolio = data?.portfolio || {};
  const gainLossColor = portfolio.totalGainLoss >= 0 ? '#4caf50' : '#f44336';
  const gainLossIcon = portfolio.totalGainLoss >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;

  const stats = [
    {
      title: 'Total Portfolio',
      value: `$${portfolio.totalValue?.toLocaleString() || '0'}`,
      icon: <WalletIcon />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      tooltip: 'Total value of all your assets in USD, including portfolio positions and liquidity pools'
    },
    {
      title: 'Total P&L',
      value: `$${portfolio.totalGainLoss?.toLocaleString() || '0'}`,
      subtitle: `${portfolio.totalGainLossPercentage?.toFixed(1) || '0'}%`,
      icon: gainLossIcon,
      color: gainLossColor,
      gradient: gainLossColor === '#4caf50' ? 
        'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' : 
        'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
      tooltip: 'Total profit or loss from your DeFi activities, calculated from initial investment'
    },
    {
      title: 'Liquidity Pools',
      value: `${data?.liquidityPositions?.length || 0}`,
      subtitle: 'Active Positions',
      icon: <PoolIcon />,
      color: '#ff9800',
      gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
      tooltip: 'Number of active liquidity pool positions providing yield and rewards'
    },
    {
      title: 'Active Loans',
      value: `${data?.loanPositions?.length || 0}`,
      subtitle: 'Outstanding',
      icon: <CreditCardIcon />,
      color: '#e91e63',
      gradient: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
      tooltip: 'Number of active loans with outstanding balances and interest payments'
    }
  ];

  return (
    <Box sx={{ mb: 6 }}>
            <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        width: '100%',
        flexWrap: { xs: 'wrap', lg: 'nowrap' }
      }}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{ 
              flex: '1 1 auto',
              minWidth: { xs: '150px', sm: '180px', md: '200px' },
              maxWidth: { 
                xs: 'calc(50% - 6px)', 
                sm: 'calc(50% - 8px)', 
                md: 'calc(25% - 12px)',
                lg: 'none' 
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              style={{ width: '100%', height: '100%' }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: 2.5,
                height: { xs: '110px', sm: '120px' },
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <CardContent sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Stack alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
                    <Avatar sx={{ 
                      background: stat.gradient,
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      boxShadow: '0 3px 12px rgba(0, 0, 0, 0.3)',
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                      {stat.icon}
                    </Avatar>
                    
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 0.5,
                        mb: 0.25
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: '#999',
                          fontWeight: 500,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          lineHeight: 1.2
                        }}>
                          {stat.title}
                        </Typography>
                        <Tooltip title={stat.tooltip} placement="top">
                          <InfoOutlinedIcon sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                            color: '#666', 
                            cursor: 'help',
                            '&:hover': { color: '#999' }
                          }} />
                        </Tooltip>
                      </Box>
                      <Typography variant="h6" sx={{ 
                        color: '#fff',
                        fontWeight: 700,
                        mb: 0.25,
                        lineHeight: 1.1,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        {stat.value}
                      </Typography>
                      {stat.subtitle && (
                        <Typography variant="body2" sx={{ 
                          color: stat.color,
                          fontWeight: 600,
                          fontSize: { xs: '0.625rem', sm: '0.7rem' },
                          lineHeight: 1.2
                        }}>
                          {stat.subtitle}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Asset Allocation Component
const AssetAllocation = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '520px',
        maxHeight: '520px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0, height: '64px' }}>
            <Skeleton variant="text" width="40%" height={30} />
          </Box>
          <Box sx={{ p: 2, flex: 1, height: 'calc(100% - 64px)' }}>
            {[...Array(4)].map((_, index) => (
              <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
                <Box>
                  <Skeleton variant="text" width="60px" height={20} />
                  <Skeleton variant="text" width="40px" height={16} />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  const assets = data?.portfolio?.assets || [];
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '540px',
        maxHeight: '540px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
              flexShrink: 0,
              height: '64px'
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>
                  <ShowChartIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    Asset Allocation
                  </Typography>
                  <Tooltip title={tooltipDescriptions.assetAllocation} placement="top">
                    <InfoOutlinedIcon sx={{ 
                      fontSize: '0.8rem', 
                      color: '#666', 
                      cursor: 'help',
                      '&:hover': { color: '#999' }
                    }} />
                  </Tooltip>
                </Box>
                <Typography variant="body2" sx={{ 
                  color: '#999',
                  ml: 'auto',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}>
                  Total: ${totalValue.toLocaleString()}
                </Typography>
              </Stack>
            </Box>
          </motion.div>

          <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box sx={{
                    p: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 1.5,
                    background: 'rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ 
                        bgcolor: `hsl(${index * 60}, 70%, 55%)`,
                        width: 32, 
                        height: 32,
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        {asset.symbol.slice(0, 2)}
                      </Avatar>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ 
                          color: '#fff',
                          fontWeight: 600,
                          mb: 0.25,
                          fontSize: '0.85rem'
                        }}>
                          {asset.symbol}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#999',
                          fontSize: '0.7rem'
                        }}>
                          {asset.amount.toLocaleString()} tokens
                        </Typography>
                        
                        {/* Progress Bar */}
                        <Box sx={{ mt: 0.75 }}>
                          <LinearProgress
                            variant="determinate"
                            value={asset.percentage}
                            sx={{
                              height: 3,
                              borderRadius: 1.5,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: `hsl(${index * 60}, 70%, 55%)`,
                                borderRadius: 1.5,
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'right', minWidth: '70px' }}>
                        <Typography variant="body1" sx={{ 
                          color: '#fff',
                          fontWeight: 700,
                          mb: 0.25,
                          fontSize: '0.8rem'
                        }}>
                          ${asset.value.toLocaleString()}
                        </Typography>
                        <Chip
                          label={`${asset.percentage.toFixed(1)}%`}
                          size="small"
                          sx={{
                            bgcolor: `hsl(${index * 60}, 70%, 55%)`,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: '20px'
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                </motion.div>
              ))}
            </Stack>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box sx={{
                p: 1.5,
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: 1.5
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" sx={{ 
                    color: '#667eea',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}>
                    Diversification Score
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#4caf50',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    8.5/10
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ 
                  color: '#999',
                  mt: 0.5,
                  fontSize: '0.7rem'
                }}>
                  Well diversified across {assets.length} different assets
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Performance Chart Component
const PerformanceChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '520px',
        maxHeight: '520px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0, height: '64px' }}>
            <Skeleton variant="text" width="40%" height={30} />
          </Box>
          <Box sx={{ p: 2, flex: 1, height: 'calc(100% - 64px)' }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={4} key={index}>
                  <Skeleton variant="text" width="60%" height={16} />
                  <Skeleton variant="text" width="80%" height={28} />
                </Grid>
              ))}
            </Grid>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const performance = data?.performance || {};
  const chartData = performance.chartData || [];

  const performanceMetrics = [
    {
      label: 'Total Return',
      value: performance.totalReturn?.toFixed(1) || '0',
      color: '#4caf50',
      icon: <TrendingUpIcon />
    },
    {
      label: 'Monthly',
      value: performance.monthlyReturn?.toFixed(1) || '0',
      color: '#2196f3',
      icon: <ChartIcon />
    },
    {
      label: 'Weekly',
      value: performance.weeklyReturn?.toFixed(1) || '0',
      color: '#ff9800',
      icon: <TrendingUpIcon />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '540px',
        maxHeight: '540px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
              flexShrink: 0,
              height: '64px'
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}>
                  <ShowChartIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    Portfolio Performance
                  </Typography>
                  <Tooltip title={tooltipDescriptions.performanceChart} placement="top">
                    <InfoOutlinedIcon sx={{ 
                      fontSize: '0.8rem', 
                      color: '#666', 
                      cursor: 'help',
                      '&:hover': { color: '#999' }
                    }} />
                  </Tooltip>
                </Box>
                <Chip 
                  label="Last 30 Days"
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    color: '#4caf50',
                    fontWeight: 600,
                    ml: 'auto',
                    fontSize: '0.7rem',
                    height: '24px'
                  }}
                />
              </Stack>
            </Box>
          </motion.div>

          <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
            {/* Main Content - Flexbox Layout */}
            <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
              
              {/* Left Section - Performance Metrics */}
              <Box sx={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {performanceMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box sx={{
                      p: 1.5,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 1.5,
                      background: 'rgba(255, 255, 255, 0.02)',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        transform: 'translateX(4px)',
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                      }
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ 
                          bgcolor: metric.color,
                          width: 32,
                          height: 32
                        }}>
                          {React.cloneElement(metric.icon, { sx: { fontSize: '1rem' } })}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ 
                            color: '#999',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            lineHeight: 1.2
                          }}>
                            {metric.label}
                          </Typography>
                          <Typography variant="h6" sx={{ 
                            color: metric.color,
                            fontWeight: 700,
                            fontSize: '1.1rem'
                          }}>
                            {metric.value}%
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </motion.div>
                ))}
                
                {/* Performance Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Box sx={{ mt: 2 }}>
                    <Stack spacing={1.5}>
                      <Box sx={{
                        p: 1.5,
                        background: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        borderRadius: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(76, 175, 80, 0.15)',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.7rem' }}>
                          Best Performer
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff', fontSize: '0.9rem' }}>
                          {performance.bestAsset || 'AQUA'}
                        </Typography>
                      </Box>
                      <Box sx={{
                        p: 1.5,
                        background: 'rgba(255, 152, 0, 0.1)',
                        border: '1px solid rgba(255, 152, 0, 0.2)',
                        borderRadius: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(255, 152, 0, 0.15)',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600, fontSize: '0.7rem' }}>
                          Needs Attention
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff', fontSize: '0.9rem' }}>
                          {performance.worstAsset || 'yXLM'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </motion.div>
              </Box>

              {/* Right Section - Interactive Chart */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ height: '100%' }}
                >
                  <Box sx={{
                    p: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 1.5,
                    background: 'rgba(255, 255, 255, 0.02)',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: '#999',
                      mb: 2,
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      Portfolio Value Over Time
                    </Typography>
                    
                    <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
                      <InteractiveChart 
                        data={chartData} 
                        color="#4caf50" 
                        height={280}
                      />
                      
                      {/* Chart Stats Overlay */}
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0, 0, 0, 0.8)',
                        borderRadius: 1,
                        p: 1,
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: '#4caf50',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          mb: 0.5
                        }}>
                          Total Gain
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          color: '#fff',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}>
                          +${(chartData[chartData.length - 1]?.value - chartData[0]?.value || 0).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      {/* Chart Hint */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: 1,
                        p: 0.75,
                        opacity: 0.7
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: '#999',
                          fontSize: '0.65rem',
                          fontStyle: 'italic'
                        }}>
                          Hover over chart for details
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Risk Analysis Component
const RiskAnalysis = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '380px',
        maxHeight: '380px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant="text" width="60%" height={24} sx={{ flexShrink: 0 }} />
          <Stack spacing={2} sx={{ mt: 2, flex: 1 }}>
            {[...Array(3)].map((_, i) => (
              <Box key={i}>
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const riskMetrics = [
    { 
      name: 'Volatility Risk', 
      score: 7.2, 
      status: 'Moderate',
      description: 'Based on 30-day price volatility',
      color: '#ff9800'
    },
    { 
      name: 'Concentration Risk', 
      score: 8.5, 
      status: 'Good',
      description: 'Well diversified across assets',
      color: '#4caf50'
    },
    { 
      name: 'Liquidity Risk', 
      score: 6.8, 
      status: 'Moderate',
      description: 'Most assets are highly liquid',
      color: '#ff9800'
    },
    { 
      name: 'Smart Contract Risk', 
      score: 9.1, 
      status: 'Excellent',
      description: 'Using audited protocols',
      color: '#4caf50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '380px',
        maxHeight: '380px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#f44336', width: 32, height: 32 }}>
              <SecurityIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                Risk Analysis
              </Typography>
              <Tooltip title={tooltipDescriptions.riskAnalysis} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.8rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
          </Stack>

          <Stack spacing={2} sx={{ flex: 1, overflow: 'auto' }}>
            {riskMetrics.map((metric, index) => (
              <Box key={index}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                    {metric.name}
                  </Typography>
                  <Chip 
                    label={metric.status}
                    size="small"
                    sx={{
                      bgcolor: metric.color,
                      color: '#fff',
                      fontSize: '0.65rem',
                      height: '20px'
                    }}
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: '#999', fontSize: '0.7rem', mb: 1 }}>
                  {metric.description}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={metric.score * 10}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Trading Insights Component
const TradingInsights = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '380px',
        maxHeight: '380px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant="text" width="60%" height={24} sx={{ flexShrink: 0 }} />
          <Stack spacing={1.5} sx={{ mt: 2, flex: 1 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="text" width="90%" height={16} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const insights = [
    {
      type: 'opportunity',
      title: 'Liquidity Mining',
      description: 'Consider XLM/USDC pool for 15.2% APY',
      icon: <TrendingUpIcon />,
      color: '#4caf50'
    },
    {
      type: 'warning',
      title: 'High Concentration',
      description: '43% in XLM - consider diversification',
      icon: <WarningIcon />,
      color: '#ff9800'
    },
    {
      type: 'info',
      title: 'Best Trading Time',
      description: 'Optimal volume: 14:00-16:00 UTC',
      icon: <AccessTimeIcon />,
      color: '#2196f3'
    },
    {
      type: 'success',
      title: 'Performance',
      description: 'Outperforming market by +5.2%',
      icon: <CheckCircleIcon />,
      color: '#4caf50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '380px',
        maxHeight: '380px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#2196f3', width: 32, height: 32 }}>
              <PsychologyIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                Trading Insights
              </Typography>
              <Tooltip title={tooltipDescriptions.tradingInsights} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.8rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
          </Stack>

          <Stack spacing={1.5} sx={{ flex: 1, overflow: 'auto' }}>
            {insights.map((insight, index) => (
              <Box key={index} sx={{
                p: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 1.5,
                background: 'rgba(255, 255, 255, 0.02)',
              }}>
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Avatar sx={{ 
                    bgcolor: insight.color, 
                    width: 24, 
                    height: 24,
                    mt: 0.25
                  }}>
                    {React.cloneElement(insight.icon, { sx: { fontSize: '0.8rem' } })}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      color: '#fff', 
                      fontWeight: 600, 
                      fontSize: '0.75rem',
                      mb: 0.25
                    }}>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#999', 
                      fontSize: '0.65rem',
                      lineHeight: 1.3
                    }}>
                      {insight.description}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Portfolio Health Component
const PortfolioHealth = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '380px',
        maxHeight: '380px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant="text" width="60%" height={24} sx={{ flexShrink: 0 }} />
          <Box sx={{ mt: 2, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="50%" height={20} sx={{ mx: 'auto' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const healthScore = 87;
  const healthMetrics = [
    { name: 'Diversification', value: 92, color: '#4caf50' },
    { name: 'Risk Balance', value: 78, color: '#ff9800' },
    { name: 'Liquidity', value: 95, color: '#4caf50' },
    { name: 'Performance', value: 84, color: '#4caf50' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '380px',
        maxHeight: '380px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}>
              <FavoriteIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                Portfolio Health
              </Typography>
              <Tooltip title={tooltipDescriptions.portfolioHealth} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.8rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
          </Stack>

          <Box sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
              <CircularProgress
                variant="determinate"
                value={healthScore}
                size={60}
                thickness={4}
                sx={{
                  color: healthScore >= 80 ? '#4caf50' : healthScore >= 60 ? '#ff9800' : '#f44336',
                }}
              />
              <Box sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#fff', 
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  {healthScore}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.8rem' }}>
              Excellent Health
            </Typography>
          </Box>

          <Stack spacing={1} sx={{ flex: 1, overflow: 'auto' }}>
            {healthMetrics.map((metric, index) => (
              <Box key={index}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.25 }}>
                  <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.7rem' }}>
                    {metric.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: metric.color, fontSize: '0.7rem', fontWeight: 600 }}>
                    {metric.value}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Market Comparison Component  
const MarketComparison = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={3} key={i}>
                <Skeleton variant="text" width="80%" height={16} />
                <Skeleton variant="text" width="60%" height={20} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Use real user data or fallback data for market comparison
  const marketComparisonData = data?.marketComparison || {
    portfolioReturn: 13.2,
    portfolioSharpe: 1.85,
    portfolioVolatility: 18.5,
    benchmarks: [
      { name: 'DeFi Index', return: 8.7, sharpe: 1.12, volatility: 24.2, color: '#4caf50' },
      { name: 'Stellar Average', return: 6.3, sharpe: 0.95, volatility: 21.8, color: '#ff9800' },
      { name: 'Market Leaders', return: 11.5, sharpe: 1.45, volatility: 19.7, color: '#2196f3' }
    ]
  };

  // Use actual portfolio performance if available
  const portfolioReturn = data?.portfolio?.totalGainLossPercentage || data?.performance?.totalReturn || marketComparisonData.portfolioReturn;
  
  const marketData = [
    {
      name: 'Your Portfolio',
      return: portfolioReturn,
      sharpe: marketComparisonData.portfolioSharpe,
      volatility: marketComparisonData.portfolioVolatility,
      color: '#667eea'
    },
    ...marketComparisonData.benchmarks
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '280px',
        maxHeight: '280px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#9c27b0', width: 32, height: 32 }}>
              <BarChartIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                Market Comparison
              </Typography>
              <Tooltip title={tooltipDescriptions.marketComparison} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.8rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
            <Chip 
              label="30 Days"
              size="small"
              sx={{ 
                bgcolor: 'rgba(156, 39, 176, 0.2)',
                color: '#9c27b0',
                ml: 'auto',
                fontSize: '0.7rem',
                height: '24px'
              }}
            />
          </Stack>

          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            flex: 1,
            alignItems: 'stretch',
            minHeight: 0
          }}>
            {marketData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{ flex: '1 1 0', minWidth: 0 }}
              >
                <Box sx={{
                  p: 1.5,
                  border: index === 0 ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 1.5,
                  background: index === 0 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: index === 0 ? 'rgba(102, 126, 234, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateY(-2px)',
                    border: '1px solid rgba(102, 126, 234, 0.4)'
                  }
                }}>
                  <Typography variant="body2" sx={{ 
                    color: item.color, 
                    fontWeight: 700, 
                    fontSize: '0.8rem',
                    mb: 1.5,
                    flexShrink: 0
                  }}>
                    {item.name}
                  </Typography>
                  
                  <Stack spacing={1} sx={{ flex: 1, justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#999', fontSize: '0.65rem', mb: 0.25 }}>
                        Return
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: item.return >= 0 ? '#4caf50' : '#f44336', 
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}>
                        {item.return > 0 ? '+' : ''}{item.return}%
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" sx={{ color: '#999', fontSize: '0.65rem', mb: 0.25 }}>
                        Sharpe
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: '#fff', 
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}>
                        {item.sharpe}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" sx={{ color: '#999', fontSize: '0.65rem', mb: 0.25 }}>
                        Volatility
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: '#fff', 
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}>
                        {item.volatility}%
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Liquidity Analytics Container with Dynamic Height Matching
const LiquidityAnalyticsContainer = ({ data, loading }) => {
  const opportunitiesRef = useRef(null);
  const performanceRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('auto');

  useEffect(() => {
    if (!opportunitiesRef.current || !performanceRef.current) return;

    const updateHeights = () => {
      const opportunitiesHeight = opportunitiesRef.current?.offsetHeight || 0;
      const performanceHeight = performanceRef.current?.offsetHeight || 0;
      const newMaxHeight = Math.max(opportunitiesHeight, performanceHeight, 380);
      setMaxHeight(newMaxHeight);
    };

    // Initial measurement
    setTimeout(updateHeights, 100);

    // Create ResizeObserver to watch for changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    if (opportunitiesRef.current) {
      resizeObserver.observe(opportunitiesRef.current);
    }
    if (performanceRef.current) {
      resizeObserver.observe(performanceRef.current);
    }

    // Window resize listener
    const handleResize = () => {
      setTimeout(updateHeights, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, loading]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', lg: 'row' },
      gap: 2.5,
      width: '100%'
    }}>
      {/* Liquidity Performance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ 
          flex: '1 1 auto',
          width: '100%',
          height: maxHeight,
          minWidth: '300px'
        }}
      >
        <div ref={performanceRef} style={{ height: '100%' }}>
          <LiquidityPerformance 
            data={data} 
            loading={loading}
          />
        </div>
      </motion.div>

      {/* Top Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ 
          flex: '1 1 auto',
          width: '100%',
          height: maxHeight,
          minWidth: '300px'
        }}
      >
        <div ref={opportunitiesRef} style={{ height: '100%' }}>
          <LiquidityOpportunities 
            data={data} 
            loading={loading}
          />
        </div>
      </motion.div>
    </Box>
  );
};

// Liquidity Performance Component
const LiquidityPerformance = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="rectangular" width="100%" height={150} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const performanceData = [
    { label: 'Total APY', value: 12.8, change: +2.3, color: '#4caf50' },
    { label: 'Fees Earned', value: 145.2, change: +15.8, color: '#2196f3' },
    { label: 'Impermanent Loss', value: -2.1, change: -0.5, color: '#ff9800' },
    { label: 'Net Return', value: 143.1, change: +15.3, color: '#4caf50' }
  ];

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      day: i + 1,
      value: 12.8 + Math.sin(i * 0.3) * 2.5 + (Math.random() - 0.5) * 1.2,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#4caf50', width: 28, height: 28 }}>
              <TrendingUpIcon sx={{ fontSize: '0.9rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                Liquidity Performance
              </Typography>
              <Tooltip title={tooltipDescriptions.liquidityPerformance} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.7rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
          </Stack>

          <Grid container spacing={1.5} sx={{ mb: 1.5, flexShrink: 0 }}>
            {performanceData.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Box sx={{
                  p: 1.25,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 1.5,
                  background: 'rgba(255, 255, 255, 0.02)',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" sx={{ color: '#999', fontSize: '0.65rem', mb: 0.25 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: item.color, 
                    fontWeight: 700, 
                    fontSize: '0.8rem',
                    mb: 0.2
                  }}>
                    {item.value > 0 && item.label !== 'Impermanent Loss' ? '+' : ''}
                    {item.value}
                    {item.label.includes('APY') ? '%' : item.label.includes('Loss') ? '%' : ' XLM'}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: item.change >= 0 ? '#4caf50' : '#f44336',
                    fontSize: '0.6rem',
                    fontWeight: 600
                  }}>
                    {item.change >= 0 ? '+' : ''}{item.change}
                    {item.label.includes('APY') || item.label.includes('Loss') ? '%' : ' XLM'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ flex: 1, minHeight: '140px', display: 'flex', alignItems: 'center' }}>
            <InteractiveChart data={chartData} color="#4caf50" height={140} />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Liquidity Opportunities Component
const LiquidityOpportunities = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={60} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const opportunities = [
    {
      pair: 'XLM/USDC',
      apy: 15.2,
      tvl: 1250000,
      volume24h: 89500,
      risk: 'Low',
      color: '#4caf50'
    },
    {
      pair: 'AQUA/XLM',
      apy: 22.8,
      tvl: 680000,
      volume24h: 45200,
      risk: 'Medium',
      color: '#ff9800'
    },
    {
      pair: 'yXLM/USDC',
      apy: 18.5,
      tvl: 890000,
      volume24h: 52300,
      risk: 'Low',
      color: '#4caf50'
    },
    {
      pair: 'BTC/XLM',
      apy: 12.7,
      tvl: 2100000,
      volume24h: 125000,
      risk: 'Medium',
      color: '#ff9800'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#ff9800', width: 28, height: 28 }}>
              <FlashIcon sx={{ fontSize: '0.9rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                Top Opportunities
              </Typography>
              <Tooltip title={tooltipDescriptions.liquidityOpportunities} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.7rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
          </Stack>

          <Stack spacing={1.25} sx={{ flex: 1, overflow: 'auto' }}>
            {opportunities.map((opportunity, index) => (
              <Box key={index} sx={{
                p: 1.25,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 1.5,
                background: 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <Stack direction="row" alignItems="center" spacing={1.25}>
                  <Avatar sx={{ bgcolor: opportunity.color, width: 26, height: 26 }}>
                    <PoolIcon sx={{ fontSize: '0.75rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      color: '#fff', 
                      fontWeight: 600, 
                      fontSize: '0.75rem'
                    }}>
                      {opportunity.pair}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#999', 
                      fontSize: '0.6rem'
                    }}>
                      TVL: ${(opportunity.tvl / 1000000).toFixed(1)}M
                    </Typography>
                  </Box>
                  <Stack alignItems="center" spacing={0.2}>
                    <Typography variant="body2" sx={{ 
                      color: '#4caf50', 
                      fontWeight: 700, 
                      fontSize: '0.75rem'
                    }}>
                      {opportunity.apy}%
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#999', 
                      fontSize: '0.55rem'
                    }}>
                      APY
                    </Typography>
                  </Stack>
                  <Chip 
                    label={opportunity.risk}
                    size="small"
                    sx={{
                      bgcolor: opportunity.color,
                      color: '#fff',
                      fontSize: '0.55rem',
                      height: '18px'
                    }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Liquidity Positions Component
const LiquidityPositions = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ color: '#fff', fontSize: '0.9rem' }}>
              Liquidity Positions
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 1.25, fontSize: '0.7rem' }}>Pool</TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 1.25, fontSize: '0.7rem' }}>Value</TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 1.25, fontSize: '0.7rem' }}>APY</TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 1.25, fontSize: '0.7rem' }}>Rewards</TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 1.25, fontSize: '0.7rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Skeleton variant="circular" width={28} height={28} />
                        <Box>
                          <Skeleton variant="text" width="70px" height={14} />
                          <Skeleton variant="text" width="50px" height={10} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <Skeleton variant="text" width="50px" height={14} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <Skeleton variant="text" width="35px" height={14} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <Skeleton variant="text" width="40px" height={14} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <Skeleton variant="rounded" width="50px" height={20} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }

  const positions = data?.liquidityPositions || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        overflow: 'hidden',
        height: 'auto',
        minHeight: '200px'
      }}>
        <CardContent sx={{ p: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={{ 
              p: 1.5, 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: '#667eea', width: 28, height: 28 }}>
                  <PoolIcon sx={{ fontSize: '0.9rem' }} />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                    Liquidity Positions
                  </Typography>
                  <Tooltip title={tooltipDescriptions.liquidityPositions} placement="top">
                    <InfoOutlinedIcon sx={{ 
                      fontSize: '0.7rem', 
                      color: '#666', 
                      cursor: 'help',
                      '&:hover': { color: '#999' }
                    }} />
                  </Tooltip>
                </Box>
                <Chip 
                  label={`${positions.length} Active`}
                  size="small"
                  sx={{ 
                    bgcolor: '#4caf50',
                    color: '#fff',
                    fontWeight: 600,
                    ml: 'auto',
                    fontSize: '0.65rem',
                    height: '22px'
                  }}
                />
              </Stack>
            </Box>
          </motion.div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    color: '#999', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    Pool
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#999', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    Position Value
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#999', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    APY
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#999', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    Rewards
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#999', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((position, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    component={TableRow}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer'
                      },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ 
                      py: 1.5, 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)' 
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Avatar sx={{ 
                          bgcolor: `hsl(${index * 60}, 70%, 50%)`, 
                          width: 28, 
                          height: 28,
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {position.pool.split('/').map(token => token[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ 
                            color: '#fff',
                            fontWeight: 600,
                            mb: 0.2,
                            fontSize: '0.8rem'
                          }}>
                            {position.pool}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: '#999', 
                            fontSize: '0.6rem' 
                          }}>
                            TVL: ${position.tvl?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ 
                      py: 1.5, 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)' 
                    }}>
                      <Typography variant="body1" sx={{ 
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}>
                        ${position.value?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ 
                      py: 1.5, 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)' 
                    }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 12 }} />
                        <Typography variant="body1" sx={{ 
                          color: '#4caf50',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          {position.apy?.toFixed(1) || '0'}%
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ 
                      py: 1.5, 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)' 
                    }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <MoneyIcon sx={{ color: '#ff9800', fontSize: 12 }} />
                        <Typography variant="body1" sx={{ 
                          color: '#ff9800',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}>
                          ${position.rewards?.toLocaleString() || '0'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ 
                      py: 1.5, 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)' 
                    }}>
                      <Chip 
                        label={position.status} 
                        size="small"
                        icon={position.status === 'Active' ? <CheckCircleIcon sx={{ fontSize: '10px' }} /> : undefined}
                        sx={{ 
                          bgcolor: position.status === 'Active' ? '#4caf50' : '#757575',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.6rem',
                          height: '20px',
                          '& .MuiChip-icon': {
                            color: '#fff'
                          }
                        }}
                      />
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};



// Activity Stats Component
const ActivityStats = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Stack spacing={2} sx={{ mt: 2 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="text" width="80%" height={20} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Use real data if available, otherwise fallback to mock data
  const activityData = data?.activity || {};
  const recentTransactions = data?.recentTransactions || [];
  
  const stats = [
    {
      label: 'Total Transactions',
      value: recentTransactions.length || activityData.totalTransactions || 247,
      color: '#667eea',
      icon: <HistoryIcon />
    },
    {
      label: 'Success Rate',
      value: activityData.successRate || '99.8%',
      color: '#4caf50',
      icon: <CheckCircleIcon />
    },
    {
      label: 'Last Activity',
      value: activityData.lastActivity || '2 hours ago',
      color: '#ff9800',
      icon: <AccessTimeIcon />
    },
    {
      label: 'Avg Gas Fee',
      value: activityData.avgGasFee || '0.001 XLM',
      color: '#2196f3',
      icon: <LocalAtmIcon />
    }
  ];

  return (
    <Card sx={{ 
      background: 'rgba(255, 255, 255, 0.05)', 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      height: '100%'
    }}>
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5, flexShrink: 0 }}>
          <Avatar sx={{ bgcolor: '#667eea', width: 28, height: 28 }}>
            <AssessmentIcon sx={{ fontSize: '0.9rem' }} />
          </Avatar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
              Activity Stats
            </Typography>
            <Tooltip title={tooltipDescriptions.activityStats} placement="top">
              <InfoOutlinedIcon sx={{ 
                fontSize: '0.7rem', 
                color: '#666', 
                cursor: 'help',
                '&:hover': { color: '#999' }
              }} />
            </Tooltip>
          </Box>
        </Stack>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          flex: 1,
          flexWrap: 'wrap',
          alignItems: 'stretch'
        }}>
          {stats.map((stat, index) => (
            <Box 
              key={index}
              sx={{
                flex: '1 1 calc(25% - 12px)',
                minWidth: '140px',
                p: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 1.5,
                background: 'rgba(255, 255, 255, 0.02)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 0.5 }}>
                <Avatar sx={{ bgcolor: stat.color, width: 20, height: 20 }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: '0.7rem' } })}
                </Avatar>
              </Stack>
              <Typography variant="body2" sx={{ color: '#999', fontSize: '0.65rem', mb: 0.25 }}>
                {stat.label}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: stat.color, 
                fontWeight: 700, 
                fontSize: '0.8rem'
              }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Trading Patterns Component
const TradingPatterns = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  // Use real trading patterns data if available
  const tradingData = data?.tradingPatterns || {};
  const activityMetrics = data?.activity || {};
  
  const patterns = tradingData.hourlyVolume || [
    { time: '00:00', volume: 5, value: 5 },
    { time: '04:00', volume: 8, value: 8 },
    { time: '08:00', volume: 25, value: 25 },
    { time: '12:00', volume: 45, value: 45 },
    { time: '16:00', volume: 85, value: 85 },
    { time: '20:00', volume: 35, value: 35 },
  ];

  const tradingInsights = tradingData.insights || [
    {
      pattern: 'Peak Hours',
      description: activityMetrics.peakHours || '14:00 - 18:00 UTC',
      percentage: activityMetrics.peakHourVolume || 68,
      color: '#4caf50'
    },
    {
      pattern: 'Preferred Assets',
      description: activityMetrics.preferredAssets || 'XLM, USDC, AQUA',
      percentage: activityMetrics.assetConcentration || 75,
      color: '#2196f3'
    },
    {
      pattern: 'Trade Size',
      description: activityMetrics.avgTradeSize || 'Medium ($100-1000)',
      percentage: activityMetrics.tradeSizeDistribution || 58,
      color: '#ff9800'
    },
    {
      pattern: 'Frequency',
      description: activityMetrics.tradingFrequency || 'Daily Trader',
      percentage: activityMetrics.frequencyScore || 82,
      color: '#9c27b0'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#9c27b0', width: 28, height: 28 }}>
              <ShowChartIcon sx={{ fontSize: '0.9rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                Trading Patterns
              </Typography>
              <Tooltip title={tooltipDescriptions.tradingPatterns} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.7rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
          </Stack>

          <Box sx={{ height: 120, mb: 2, flexShrink: 0 }}>
            <InteractiveChart data={patterns} color="#9c27b0" height={120} />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1.25, 
            flex: 1, 
            overflow: 'auto' 
          }}>
            {tradingInsights.map((insight, index) => (
              <Box 
                key={index}
                sx={{
                  p: 1.25,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 1.5,
                  background: 'rgba(255, 255, 255, 0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${insight.color}40`,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}>
                    {insight.pattern}
                  </Typography>
                  <Typography variant="body2" sx={{ color: insight.color, fontSize: '0.65rem', fontWeight: 600 }}>
                    {insight.percentage}%
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#999', fontSize: '0.65rem', mb: 0.75 }}>
                  {insight.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={insight.percentage}
                    sx={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: insight.color,
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: insight.color,
                    opacity: 0.8
                  }} />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Gas Analytics Component
const GasAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Stack spacing={2} sx={{ mt: 2 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="text" width="80%" height={20} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Use real gas analytics data if available
  const gasData = data?.gasAnalytics || {};
  const gasMetrics = gasData.metrics || [
    {
      label: 'Average Gas Fee',
      value: gasData.avgGasFee || '0.001 XLM',
      change: gasData.avgGasFeeChange || -5.2,
      color: '#4caf50'
    },
    {
      label: 'Total Gas Spent',
      value: gasData.totalGasSpent || '0.245 XLM',
      change: gasData.totalGasChange || +12.8,
      color: '#2196f3'
    },
    {
      label: 'Gas Efficiency',
      value: gasData.gasEfficiency || '94.2%',
      change: gasData.efficiencyChange || +2.1,
      color: '#4caf50'
    },
    {
      label: 'Peak Gas Time',
      value: gasData.peakGasTime || '16:00 UTC',
      change: 0,
      color: '#ff9800'
    }
  ];

  const optimizationTips = gasData.optimizationTips || [
    {
      title: 'Optimal Time',
      description: gasData.optimalTimeDesc || 'Trade during 02:00-06:00 UTC for 20% lower fees',
      icon: <AccessTimeIcon />,
      color: '#4caf50',
      savings: '20%'
    },
    {
      title: 'Batch Operations',
      description: gasData.batchOpsDesc || 'Combine multiple actions to save up to 15% gas',
      icon: <FlashIcon />,
      color: '#2196f3',
      savings: '15%'
    },
    {
      title: 'Network Activity',
      description: gasData.networkDesc || 'Monitor network congestion for better timing',
      icon: <TrendingUpIcon />,
      color: '#ff9800',
      savings: '10%'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2, flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: '#ff5722', width: 28, height: 28 }}>
              <LocalAtmIcon sx={{ fontSize: '0.9rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                Gas Analytics
              </Typography>
              <Tooltip title={tooltipDescriptions.gasAnalytics} placement="top">
                <InfoOutlinedIcon sx={{ 
                  fontSize: '0.7rem', 
                  color: '#666', 
                  cursor: 'help',
                  '&:hover': { color: '#999' }
                }} />
              </Tooltip>
            </Box>
          </Stack>

          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            mb: 2, 
            flexShrink: 0,
            flexWrap: 'wrap'
          }}>
            {gasMetrics.map((metric, index) => (
              <Box 
                key={index}
                sx={{
                  flex: '1 1 calc(50% - 6px)',
                  minWidth: '120px',
                  p: 1.25,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 1.5,
                  background: 'rgba(255, 255, 255, 0.02)',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${metric.color}40`,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: '#999', fontSize: '0.6rem', mb: 0.25 }}>
                  {metric.label}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: metric.color, 
                  fontWeight: 700, 
                  fontSize: '0.75rem',
                  mb: 0.2
                }}>
                  {metric.value}
                </Typography>
                {metric.change !== 0 && (
                  <Typography variant="body2" sx={{ 
                    color: metric.change >= 0 ? '#4caf50' : '#f44336',
                    fontSize: '0.55rem',
                    fontWeight: 600
                  }}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.7rem', mb: 1.25, fontWeight: 600, flexShrink: 0 }}>
            Optimization Tips
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1, 
            flex: 1, 
            overflow: 'auto' 
          }}>
            {optimizationTips.map((tip, index) => (
              <Box 
                key={index} 
                sx={{
                  p: 1.25,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 1.5,
                  background: 'rgba(255, 255, 255, 0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${tip.color}40`,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Avatar sx={{ bgcolor: tip.color, width: 20, height: 20, mt: 0.25 }}>
                    {React.cloneElement(tip.icon, { sx: { fontSize: '0.7rem' } })}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.25 }}>
                      <Typography variant="body2" sx={{ 
                        color: '#fff', 
                        fontWeight: 600, 
                        fontSize: '0.65rem'
                      }}>
                        {tip.title}
                      </Typography>
                      {tip.savings && (
                        <Chip
                          label={`-${tip.savings}`}
                          size="small"
                          sx={{
                            bgcolor: tip.color + '20',
                            color: tip.color,
                            fontSize: '0.55rem',
                            height: '16px',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ 
                      color: '#999', 
                      fontSize: '0.6rem',
                      lineHeight: 1.3
                    }}>
                      {tip.description}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Recent Transactions Component
const RecentTransactions = ({ data, loading, onViewAllTransactions }) => {
  if (loading) {
    return (
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: '100%'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Skeleton variant="text" width="40%" height={30} />
          </Box>
          <Box sx={{ p: 3 }}>
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                p: 2,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 2
              }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
                <Skeleton variant="text" width="80px" height={20} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  const transactions = data?.recentTransactions || [];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'swap':
        return <SwapIcon />;
      case 'liquidity_add':
        return <PoolIcon />;
      case 'loan_repay':
        return <LocalAtmIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'swap':
        return '#2196f3';
      case 'liquidity_add':
        return '#4caf50';
      case 'loan_repay':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const getTransactionLabel = (tx) => {
    switch (tx.type) {
      case 'swap':
        return `Swap ${tx.from} → ${tx.to}`;
      case 'liquidity_add':
        return `Add Liquidity to ${tx.pool}`;
      case 'loan_repay':
        return 'Loan Repayment';
      default:
        return 'Transaction';
    }
  };

  const getTransactionStatus = (tx) => {
    return 'Completed'; // All transactions are completed for now
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        height: 'auto',
        minHeight: '300px',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: '#2196f3', width: 28, height: 28 }}>
                  <HistoryIcon sx={{ fontSize: '0.9rem' }} />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                    Recent Activity
                  </Typography>
                  <Tooltip title={tooltipDescriptions.recentTransactions} placement="top">
                    <InfoOutlinedIcon sx={{ 
                      fontSize: '0.7rem', 
                      color: '#666', 
                      cursor: 'help',
                      '&:hover': { color: '#999' }
                    }} />
                  </Tooltip>
                </Box>
                <Chip 
                  label={`${transactions.length} Transactions`}
                  size="small"
                  sx={{ 
                    bgcolor: '#2196f3',
                    color: '#fff',
                    fontWeight: 600,
                    ml: 'auto',
                    fontSize: '0.65rem',
                    height: '22px'
                  }}
                />
              </Stack>
            </Box>
          </motion.div>

          <Box sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              {transactions.map((tx, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box sx={{
                    p: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 1.5,
                    background: 'rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-1px)',
                      cursor: 'pointer'
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ 
                        bgcolor: getTransactionColor(tx.type),
                        width: 36,
                        height: 36
                      }}>
                        {React.cloneElement(getTransactionIcon(tx.type), { sx: { fontSize: '1rem' } })}
                      </Avatar>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ 
                          color: '#fff',
                          fontWeight: 600,
                          mb: 0.25,
                          fontSize: '0.85rem'
                        }}>
                          {getTransactionLabel(tx)}
                        </Typography>
                        
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Typography variant="body2" sx={{ 
                            color: '#999',
                            fontSize: '0.7rem'
                          }}>
                            {new Date(tx.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Typography>
                          
                          <Chip
                            label={getTransactionStatus(tx)}
                            size="small"
                            icon={<CheckCircleIcon />}
                            sx={{
                              bgcolor: '#4caf50',
                              color: '#fff',
                              fontSize: '0.65rem',
                              height: 18,
                              '& .MuiChip-icon': {
                                color: '#fff',
                                fontSize: 12
                              }
                            }}
                          />
                          
                          {tx.hash && (
                            <Typography variant="body2" sx={{ 
                              color: '#667eea',
                              fontSize: '0.65rem',
                              fontFamily: 'monospace'
                            }}>
                              {tx.hash}
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ 
                          color: '#fff',
                          fontWeight: 700,
                          mb: 0.25,
                          fontSize: '0.9rem'
                        }}>
                          ${tx.amount?.toLocaleString() || '0'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: getTransactionColor(tx.type),
                          fontSize: '0.65rem',
                          textTransform: 'uppercase',
                          fontWeight: 600
                        }}>
                          {tx.type.replace('_', ' ')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </motion.div>
              ))}
            </Stack>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={onViewAllTransactions}
                  sx={{
                    color: '#667eea',
                    borderColor: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      background: 'rgba(102, 126, 234, 0.1)',
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    fontSize: '0.8rem',
                    height: '36px'
                  }}
                >
                  View All Transactions
                </Button>
              </Box>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Activity Container with Better Layout
const ActivityContainer = ({ data, loading, onViewAllTransactions }) => {
  const analyticsRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  useEffect(() => {
    if (!analyticsRef.current) return;

    const updateHeight = () => {
      const height = analyticsRef.current?.offsetHeight || 380;
      setContainerHeight(height);
    };

    // Initial measurement
    setTimeout(updateHeight, 100);

    // ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver(updateHeight);
    if (analyticsRef.current) {
      resizeObserver.observe(analyticsRef.current);
    }

    const handleResize = () => {
      setTimeout(updateHeight, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, loading]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2.5,
      width: '100%'
    }}>
      {/* Recent Transactions - Full width at top */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ 
          width: '100%',
          minHeight: '300px'
        }}
      >
        <RecentTransactions 
          data={data} 
          loading={loading}
          onViewAllTransactions={onViewAllTransactions}
        />
      </motion.div>

      {/* Activity Stats - Full width secondary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ 
          width: '100%',
          height: '200px'
        }}
      >
        <ActivityStats 
          data={data} 
          loading={loading}
        />
      </motion.div>

      {/* Analytics Row - Trading Patterns & Gas Analytics */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 2.5,
        width: '100%'
      }}>
        {/* Trading Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ 
            flex: '1 1 auto',
            width: '100%',
            height: containerHeight,
            minWidth: '300px'
          }}
        >
          <TradingPatterns 
            data={data} 
            loading={loading}
          />
        </motion.div>

        {/* Gas Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ 
            flex: '1 1 auto',
            width: '100%',
            height: containerHeight,
            minWidth: '300px'
          }}
        >
          <div ref={analyticsRef} style={{ height: '100%' }}>
            <GasAnalytics 
              data={data} 
              loading={loading}
            />
          </div>
        </motion.div>
      </Box>
    </Box>
  );
};

// Advanced Analytics Component with Complete Flexbox Layout
const AdvancedAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3,
        width: '100%'
      }}>
        {/* Loading Cards Row 1 */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          width: '100%'
        }}>
          {[...Array(2)].map((_, index) => (
            <Box key={index} sx={{ flex: 1, minWidth: 0 }}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                height: 350
              }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="rectangular" width="100%" height={120} sx={{ my: 2 }} />
                  <Skeleton variant="text" width="40%" height={24} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        
        {/* Loading Cards Row 2 */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          width: '100%'
        }}>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ flex: 1, minWidth: 0 }}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                height: 300
              }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="rectangular" width="100%" height={100} sx={{ my: 2 }} />
                  <Skeleton variant="text" width="40%" height={24} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  const creditScore = data?.creditScore?.current || 742;
  const creditBreakdown = data?.creditScoreBreakdown || {
    walletAge: 18, txCount: 16, assetDiversity: 14, swapVolume: 19, behavioral: 15
  };
  const riskLevel = data?.riskLevel?.level || 'Moderate';
  const userTier = data?.userTier?.tier || 'Gold';
  const tokenPrices = data?.tokenPrices || [
    { asset: 'XLM', price: 12000000, timestamp: Date.now() },
    { asset: 'USDC', price: 100000000, timestamp: Date.now() },
    { asset: 'BTC', price: 4350000000000, timestamp: Date.now() },
    { asset: 'ETH', price: 260000000000, timestamp: Date.now() }
  ];
  const collateralPosition = data?.collateralPosition || {
    totalValue: 7500, assets: ['XLM', 'USDC'], healthFactor: 1.65
  };
  const storageStats = data?.storageStats || {
    totalSize: 1024, usedSize: 450, efficiency: 89
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      width: '100%'
    }}>
      {/* First Row - Credit Score & Token Prices */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        width: '100%'
      }}>
        {/* Credit Score Analysis */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              height: 350,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#667eea', display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                  Credit Score Analysis
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h3" sx={{ color: creditScore >= 700 ? '#4caf50' : creditScore >= 600 ? '#ff9800' : '#f44336', fontWeight: 'bold' }}>
                    {creditScore}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    {creditScore >= 700 ? 'Excellent' : creditScore >= 600 ? 'Good' : 'Fair'} Credit Score
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
                    Score Breakdown:
                  </Typography>
                  {Object.entries(creditBreakdown).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#999', minWidth: 100, fontSize: '0.75rem' }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(value / 20) * 100}
                        sx={{ flex: 1, mx: 1.5, height: 5, borderRadius: 3 }}
                      />
                      <Typography variant="body2" sx={{ color: '#667eea', minWidth: 25, fontSize: '0.75rem' }}>
                        {value}/20
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Token Prices & Oracle Data */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              height: 350,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#667eea', display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon sx={{ mr: 1 }} />
                  Live Token Prices
                </Typography>
                
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  {(Array.isArray(tokenPrices) ? tokenPrices : []).map((token, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.05)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 28, height: 28, mr: 1.5, bgcolor: '#667eea', fontSize: '0.8rem' }}>
                          {token?.asset?.charAt(0) || 'T'}
                        </Avatar>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                          {token?.asset || 'Unknown'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.85rem' }}>
                          ${((token?.price || 0) / 10000000).toFixed(4)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999', fontSize: '0.7rem' }}>
                          {new Date(token?.timestamp || Date.now()).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

      {/* Second Row - Risk Assessment, User Tier & Fees, Storage Stats */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        width: '100%'
      }}>
        {/* Risk Assessment */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              height: 300,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#667eea', display: 'flex', alignItems: 'center' }}>
                  <ShieldIcon sx={{ mr: 1 }} />
                  Risk Assessment
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Chip 
                    label={riskLevel}
                    color={riskLevel === 'Low' ? 'success' : riskLevel === 'Moderate' ? 'warning' : 'error'}
                    sx={{ fontSize: '0.9rem', py: 0.5, px: 1.5 }}
                  />
                </Box>

                <Box sx={{ mb: 2, flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#fff', mb: 1.5, fontSize: '0.85rem' }}>
                    Collateral Health Factor:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((collateralPosition.healthFactor || 1.0) * 50, 100)}
                      sx={{ flex: 1, mr: 1.5, height: 6, borderRadius: 3 }}
                      color={collateralPosition.healthFactor >= 1.5 ? 'success' : 'warning'}
                    />
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                      {(collateralPosition.healthFactor || 1.0).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#999', mt: 1, fontSize: '0.75rem' }}>
                    {data?.isLiquidationRequired ? 'Warning: Liquidation Risk' : 'Safe collateral ratio'}
                  </Typography>
                </Box>

                <Alert 
                  severity={collateralPosition.healthFactor >= 1.5 ? 'success' : 'warning'} 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', mt: 'auto' }}
                >
                  {collateralPosition.healthFactor >= 1.5 
                    ? 'Your positions are well-collateralized' 
                    : 'Consider adding more collateral'}
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* User Tier & Fee Structure */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              height: 300,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#667eea', display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ mr: 1 }} />
                  User Tier & Fees
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Chip 
                    label={`${userTier} Tier`}
                    color={userTier === 'Gold' ? 'warning' : userTier === 'Silver' ? 'default' : 'secondary'}
                    sx={{ fontSize: '0.9rem', py: 0.5, px: 1.5 }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 2, 
                  flex: 1 
                }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    borderRadius: 2, 
                    background: 'rgba(255, 255, 255, 0.05)',
                    flex: 1 
                  }}>
                    <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      0.25%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                      Swap Fee
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    borderRadius: 2, 
                    background: 'rgba(255, 255, 255, 0.05)',
                    flex: 1 
                  }}>
                    <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      7.5%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                      Loan APR
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', fontSize: '0.75rem', mt: 'auto' }}>
                  Higher tiers get better rates and exclusive features
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Storage & System Stats */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              height: 300,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#667eea', display: 'flex', alignItems: 'center' }}>
                  <StorageIcon sx={{ mr: 1 }} />
                  System Statistics
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 2,
                  flex: 1 
                }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    borderRadius: 2, 
                    background: 'rgba(255, 255, 255, 0.05)',
                    flex: 1 
                  }}>
                    <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {storageStats.efficiency}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                      Efficiency
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    borderRadius: 2, 
                    background: 'rgba(255, 255, 255, 0.05)',
                    flex: 1 
                  }}>
                    <Typography variant="h5" sx={{ color: '#9c27b0', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {Math.round((storageStats.usedSize / storageStats.totalSize) * 100)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                      Storage Used
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="body2" sx={{ color: '#fff', mb: 1, fontSize: '0.8rem' }}>
                    Storage Usage: {storageStats.usedSize}MB / {storageStats.totalSize}MB
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(storageStats.usedSize / storageStats.totalSize) * 100}
                    sx={{ height: 5, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

// Main Analytics Page Component
export default function AnalyticsPage() {
  const [walletStatus, setWalletStatus] = useState({
    isConnected: false,
    wallet: null,
    address: null,
    balance: null
  });
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  // Get user analytics data
  const { loading: analyticsLoading, error: analyticsError, data: analyticsData } = useUserAnalytics(
    walletStatus.address
  );

  // Load wallet status
  useEffect(() => {
    const loadWalletStatus = async () => {
      try {
        const status = await walletService.getConnectionStatusWithBalance();
        setWalletStatus(status);
      } catch (error) {
        console.log('Error loading wallet status:', error);
        setWalletStatus({
          isConnected: false,
          wallet: null,
          address: null,
          balance: null
        });
      } finally {
        setLoading(false);
      }
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
      } else if (event.type === 'disconnected') {
        setWalletStatus({
          isConnected: false,
          wallet: null,
          address: null,
          balance: null
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleConnectWallet = async () => {
    try {
      await walletService.connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTransactionDialogClose = () => {
    setTransactionDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden',
      overflowY: 'auto',
      scrollBehavior: 'smooth'
    }}>
      <EnhancedDarkBackground />
      
      {/* Sparkles Effect */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <SparklesCore
          id="analytics-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.0}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#667eea"
        />
      </Box>

      <Header />

      <Container maxWidth="xl" sx={{ 
        py: 4, 
        pt: 12,
        overflowX: 'hidden',
        width: '100%'
      }}>
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold'
              }}
            >
              Swave Analytics
            </Typography>
            <Typography variant="h6" sx={{ color: '#999', maxWidth: 600, mx: 'auto' }}>
              Personal DeFi insights & portfolio performance analysis
            </Typography>
          </Box>
        </motion.div>

        {/* Wallet Connection Check */}
        {!walletStatus.isConnected ? (
          <WalletConnectionRequired 
            onConnectWallet={handleConnectWallet}
            loading={loading}
          />
        ) : (
          <>
            {/* Portfolio Overview */}
            <Box sx={{ mb: 4 }}>
              <PortfolioOverview 
                data={analyticsData} 
                loading={analyticsLoading}
              />
            </Box>

            {/* Content Tabs */}
            <Box sx={{ mb: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1.5, sm: 2, md: 2.5 },
                  width: '100%',
                  flexWrap: { xs: 'wrap', lg: 'nowrap' },
                  mb: 2
                }}>
                  {['Portfolio', 'Liquidity', 'Activity', 'Advanced'].map((tab, index) => (
                    <Box
                      key={index}
                      sx={{ 
                        flex: '1 1 auto',
                        minWidth: { xs: '150px', sm: '180px', md: '200px' },
                        maxWidth: { 
                          xs: 'calc(50% - 6px)', 
                          sm: 'calc(50% - 8px)', 
                          md: 'calc(33.333% - 12px)',
                          lg: 'none' 
                        }
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                        style={{ width: '100%', height: '100%' }}
                      >
                                                 <Box
                           onClick={() => setTabValue(index)}
                           sx={{ 
                             background: tabValue === index ? 
                               'rgba(102, 126, 234, 0.1)' : 
                               'rgba(255, 255, 255, 0.03)', 
                             border: tabValue === index ? 
                               '1px solid rgba(102, 126, 234, 0.3)' : 
                               '1px solid rgba(255, 255, 255, 0.08)',
                             backdropFilter: 'blur(20px)',
                             borderRadius: 2,
                             height: { xs: '38px', sm: '42px' },
                             cursor: 'pointer',
                             transition: 'all 0.3s ease',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             '&:hover': {
                               background: tabValue === index ? 
                                 'rgba(102, 126, 234, 0.15)' : 
                                 'rgba(255, 255, 255, 0.06)',
                               border: '1px solid rgba(102, 126, 234, 0.2)',
                               transform: 'translateY(-1px)'
                             }
                           }}
                         >
                           <Stack direction="row" alignItems="center" spacing={0.75}>
                             <Box sx={{ 
                               color: tabValue === index ? '#667eea' : '#999',
                               display: 'flex',
                               alignItems: 'center',
                               fontSize: { xs: '0.9rem', sm: '1rem' }
                             }}>
                               {index === 0 && <ShowChartIcon fontSize="inherit" />}
                               {index === 1 && <PoolIcon fontSize="inherit" />}
                               {index === 2 && <HistoryIcon fontSize="inherit" />}
                               {index === 3 && <AssessmentIcon fontSize="inherit" />}
                             </Box>
                             <Typography sx={{ 
                               color: tabValue === index ? '#667eea' : '#999',
                               fontWeight: tabValue === index ? 600 : 500,
                               fontSize: { xs: '0.75rem', sm: '0.8rem' },
                               textTransform: 'none',
                               lineHeight: 1.2
                             }}>
                               {tab}
                             </Typography>
                           </Stack>
                         </Box>
                      </motion.div>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Box>

            {/* Tab Content */}
            <Box sx={{ minHeight: '400px', pt: 2 }}>
              <AnimatePresence mode="wait">
                {tabValue === 0 && (
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Box>
                      {/* First Row - Performance Chart & Asset Allocation */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2.5, 
                        flexWrap: 'wrap',
                        mb: 4
                      }}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          style={{ 
                            flex: '2 1 calc(66.666% - 10px)', 
                            minWidth: '400px',
                            height: '520px'
                          }}
                        >
                          <PerformanceChart 
                            data={analyticsData} 
                            loading={analyticsLoading}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          style={{ 
                            flex: '1 1 calc(33.333% - 10px)', 
                            minWidth: '300px',
                            height: '520px'
                          }}
                        >
                          <AssetAllocation 
                            data={analyticsData} 
                            loading={analyticsLoading}
                          />
                        </motion.div>
                      </Box>

                      {/* Second Row - Risk Analysis, Trading Insights & Portfolio Health */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2.5, 
                        flexWrap: 'wrap',
                        mb: 2
                      }}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          style={{ 
                            flex: '1 1 calc(33.333% - 17px)', 
                            minWidth: '300px',
                            height: '380px'
                          }}
                        >
                          <RiskAnalysis 
                            data={analyticsData} 
                            loading={analyticsLoading}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          style={{ 
                            flex: '1 1 calc(33.333% - 17px)', 
                            minWidth: '300px',
                            height: '380px'
                          }}
                        >
                          <TradingInsights 
                            data={analyticsData} 
                            loading={analyticsLoading}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          style={{ 
                            flex: '1 1 calc(33.333% - 17px)', 
                            minWidth: '300px',
                            height: '380px'
                          }}
                        >
                          <PortfolioHealth 
                            data={analyticsData} 
                            loading={analyticsLoading}
                          />
                        </motion.div>
                      </Box>

                      {/* Third Row - Market Comparison */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        style={{ 
                          width: '100%',
                          height: '280px'
                        }}
                      >
                        <MarketComparison 
                          data={analyticsData} 
                          loading={analyticsLoading}
                        />
                      </motion.div>
                    </Box>
                  </motion.div>
                )}

                {tabValue === 1 && (
                  <motion.div
                    key="liquidity"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2.5,
                      width: '100%'
                    }}>
                      {/* Liquidity Positions - Auto height, full width */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ 
                          width: '100%',
                          minHeight: '200px'
                        }}
                      >
                        <LiquidityPositions 
                          data={analyticsData} 
                          loading={analyticsLoading}
                        />
                      </motion.div>

                      {/* Liquidity Analytics - Responsive layout */}
                      <LiquidityAnalyticsContainer 
                        data={analyticsData} 
                        loading={analyticsLoading}
                      />
                    </Box>
                  </motion.div>
                )}

                {tabValue === 2 && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2.5,
                      width: '100%'
                    }}>
                      {/* Activity Stats Only */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ 
                          width: '100%',
                          height: '200px'
                        }}
                      >
                        <ActivityStats 
                          data={analyticsData} 
                          loading={analyticsLoading}
                        />
                      </motion.div>
                    </Box>
                  </motion.div>
                )}

                {tabValue === 3 && (
                  <motion.div
                    key="advanced"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <AdvancedAnalytics 
                      data={analyticsData} 
                      loading={analyticsLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </>
        )}
      </Container>

      {/* Transaction Dialog */}
      <Dialog
        open={transactionDialogOpen}
        onClose={handleTransactionDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#667eea',
          fontSize: '1.25rem',
          fontWeight: 700,
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2
        }}>
          All Transactions
        </DialogTitle>
        <DialogContent sx={{ px: 0, py: 0, maxHeight: '70vh', overflow: 'auto' }}>
          {analyticsLoading ? (
            <Box sx={{ p: 3 }}>
              {[...Array(6)].map((_, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2,
                  p: 2
                }}>
                  <Skeleton variant="circular" width={44} height={44} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                  <Skeleton variant="text" width="80px" height={20} />
                </Box>
              ))}
            </Box>
          ) : (
            <>
              {/* Transaction Stats Header */}
                             <Box sx={{ 
                 p: 3, 
                 borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                 background: 'rgba(255, 255, 255, 0.02)'
               }}>
                 <Box sx={{ 
                   display: 'flex', 
                   justifyContent: 'space-between', 
                   alignItems: 'center',
                   gap: 2,
                   flexWrap: 'wrap'
                 }}>
                   <Box sx={{ 
                     flex: 1, 
                     textAlign: 'center',
                     minWidth: '120px'
                   }}>
                     <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                       {analyticsData?.recentTransactions?.length || 0}
                     </Typography>
                     <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                       Total Transactions
                     </Typography>
                   </Box>
                   
                   <Box sx={{ 
                     flex: 1, 
                     textAlign: 'center',
                     minWidth: '120px'
                   }}>
                     <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 700 }}>
                       {analyticsData?.activity?.successRate || '99.8%'}
                     </Typography>
                     <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                       Success Rate
                     </Typography>
                   </Box>
                   
                   <Box sx={{ 
                     flex: 1, 
                     textAlign: 'center',
                     minWidth: '120px'
                   }}>
                     <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 700 }}>
                       ${analyticsData?.activity?.totalVolume?.toLocaleString() || '45,230'}
                     </Typography>
                     <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                       Total Volume
                     </Typography>
                   </Box>
                   
                   <Box sx={{ 
                     flex: 1, 
                     textAlign: 'center',
                     minWidth: '120px'
                   }}>
                     <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 700 }}>
                       {analyticsData?.activity?.avgGasFee || '0.001 XLM'}
                     </Typography>
                     <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                       Avg Gas Fee
                     </Typography>
                   </Box>
                 </Box>
               </Box>

              {/* Transaction List */}
              <Box sx={{ p: 3 }}>
                {analyticsData?.recentTransactions?.length > 0 ? (
                  <Stack spacing={2}>
                    {analyticsData.recentTransactions.map((tx, index) => {
                      const getTransactionIcon = (type) => {
                        switch (type) {
                          case 'swap': return <SwapIcon />;
                          case 'liquidity_add': return <PoolIcon />;
                          case 'loan_repay': return <LocalAtmIcon />;
                          default: return <HistoryIcon />;
                        }
                      };
                      
                      const getTransactionColor = (type) => {
                        switch (type) {
                          case 'swap': return '#2196f3';
                          case 'liquidity_add': return '#4caf50';
                          case 'loan_repay': return '#ff9800';
                          default: return '#757575';
                        }
                      };
                      
                      const getTransactionLabel = (tx) => {
                        switch (tx.type) {
                          case 'swap': return `Swap ${tx.from} → ${tx.to}`;
                          case 'liquidity_add': return `Add Liquidity to ${tx.pool}`;
                          case 'loan_repay': return 'Loan Repayment';
                          default: return 'Transaction';
                        }
                      };

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Box sx={{
                            p: 2.5,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.02)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transform: 'translateY(-1px)',
                              cursor: 'pointer'
                            }
                          }}>
                            <Stack direction="row" alignItems="center" spacing={2.5}>
                              <Avatar sx={{ 
                                bgcolor: getTransactionColor(tx.type),
                                width: 44,
                                height: 44
                              }}>
                                {React.cloneElement(getTransactionIcon(tx.type), { sx: { fontSize: '1.25rem' } })}
                              </Avatar>
                              
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body1" sx={{ 
                                  color: '#fff',
                                  fontWeight: 600,
                                  mb: 0.5,
                                  fontSize: '0.95rem'
                                }}>
                                  {getTransactionLabel(tx)}
                                </Typography>
                                
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="body2" sx={{ 
                                    color: '#999',
                                    fontSize: '0.8rem'
                                  }}>
                                    {new Date(tx.timestamp).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Typography>
                                  
                                  <Chip
                                    label="Completed"
                                    size="small"
                                    icon={<CheckCircleIcon />}
                                    sx={{
                                      bgcolor: '#4caf50',
                                      color: '#fff',
                                      fontSize: '0.7rem',
                                      height: 20,
                                      '& .MuiChip-icon': {
                                        color: '#fff',
                                        fontSize: 14
                                      }
                                    }}
                                  />
                                </Stack>
                              </Box>

                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body1" sx={{ 
                                  color: '#fff',
                                  fontWeight: 600,
                                  mb: 0.25,
                                  fontSize: '0.9rem'
                                }}>
                                  {tx.amount ? `${tx.amount} ${tx.from || 'XLM'}` : '--'}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: getTransactionColor(tx.type),
                                  fontSize: '0.75rem',
                                  textTransform: 'uppercase',
                                  fontWeight: 600
                                }}>
                                  {tx.type.replace('_', ' ')}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)', 
                      width: 64, 
                      height: 64, 
                      mx: 'auto', 
                      mb: 2 
                    }}>
                      <HistoryIcon sx={{ fontSize: '2rem', color: '#666' }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>
                      No Transactions Yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Start trading to see your transaction history here
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleTransactionDialogClose}
            variant="outlined"
            sx={{
              color: '#667eea',
              borderColor: '#667eea',
              '&:hover': {
                borderColor: '#667eea',
                background: 'rgba(102, 126, 234, 0.1)',
              },
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
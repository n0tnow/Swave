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
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  LinearProgress
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
  TrendingDown as TrendingDownIcon,
  Route as RouteIcon,
  CreditScore as CreditIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import GlowingGridDemo from './components/GlowingGridDemo';
import StarBorderButton from './components/StarBorderButton';
import DataService from './lib/dataService';
import Header from './components/Header';

// Fixed Dark Background - No hydration issues
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
          opacity: 0.8,
        }}
      >
        <ThreadsWrapper />
      </Box>
    </>
  );
};

// Separate wrapper to avoid hydration issues
const ThreadsWrapper = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Threads
      amplitude={0.8}
      distance={0.2}
      enableMouseInteraction={true}
      color={[0.4, 0.49, 0.91]}
      sx={{ width: '100%', height: '100%' }}
    />
  );
};

// Demo Features Component
const DemoFeatures = ({ walletConnected }) => {
  const [demoDialogs, setDemoDialogs] = useState({
    swapRoute: false,
    creditScore: false,
    collateral: false
  });
  const [demoData, setDemoData] = useState({
    swapRoute: null,
    creditScore: null,
    collateralStatus: null
  });
  const [loading, setLoading] = useState({
    swapRoute: false,
    creditScore: false,
    collateral: false
  });

  const openDemo = (type) => {
    setDemoDialogs(prev => ({ ...prev, [type]: true }));
  };

  const closeDemo = (type) => {
    setDemoDialogs(prev => ({ ...prev, [type]: false }));
  };

  // Demo: Optimal Swap Route
  const demonstrateSwapRoute = async () => {
    setLoading(prev => ({ ...prev, swapRoute: true }));
    
    // Simulate route calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRoute = {
      path: ['XLM', 'EURT', 'USDC'],
      inputAmount: '1000',
      outputAmount: '95.47',
      priceImpact: '0.12%',
      fees: '0.75 XLM',
      slippage: '0.08%',
      estimatedTime: '~15 seconds',
      gasEstimate: '0.001 XLM',
      steps: [
        { from: 'XLM', to: 'EURT', amount: '1000', pool: 'XLM/EURT Pool', fee: '0.3%' },
        { from: 'EURT', to: 'USDC', amount: '95.47', pool: 'EURT/USDC Pool', fee: '0.25%' }
      ]
    };
    
    setDemoData(prev => ({ ...prev, swapRoute: mockRoute }));
    setLoading(prev => ({ ...prev, swapRoute: false }));
  };

  // Demo: Credit Score Assessment
  const demonstrateCreditScore = async () => {
    setLoading(prev => ({ ...prev, creditScore: true }));
    
    // Simulate credit score calculation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockCreditData = {
      score: 78,
      grade: 'A-',
      status: 'APPROVED',
      maxLoanAmount: '50,000 XLM',
      interestRate: '4.5%',
      factors: {
        walletAge: { score: 85, description: '2+ years active' },
        transactionHistory: { score: 92, description: '500+ transactions' },
        assetDiversity: { score: 76, description: '8 different assets' },
        defiActivity: { score: 68, description: 'Regular DeFi usage' }
      },
      recommendation: 'Eligible for instant unsecured loans up to 50,000 XLM'
    };
    
    setDemoData(prev => ({ ...prev, creditScore: mockCreditData }));
    setLoading(prev => ({ ...prev, creditScore: false }));
  };

  // Demo: Collateral Management
  const demonstrateCollateral = async () => {
    setLoading(prev => ({ ...prev, collateral: true }));
    
    // Simulate collateral operations
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const mockCollateralData = {
      locked: [
        { asset: 'XLM', amount: '15,000', value: '$1,425', ltv: '65%', status: 'Healthy' },
        { asset: 'USDC', amount: '5,000', value: '$5,000', ltv: '72%', status: 'Healthy' }
      ],
      available: [
        { asset: 'BTC', amount: '0.25', value: '$12,500', potential: 'Can secure 75% loan' },
        { asset: 'ETH', amount: '8.5', value: '$21,250', potential: 'Can secure 80% loan' }
      ],
      totalLocked: '$6,425',
      totalAvailable: '$33,750',
      healthFactor: 1.85,
      liquidationPrice: '$0.067'
    };
    
    setDemoData(prev => ({ ...prev, collateralStatus: mockCollateralData }));
    setLoading(prev => ({ ...prev, collateral: false }));
  };

  return (
    <>
      {/* Demo Feature Cards */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 6,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold'
          }}
        >
          🌊 Live Demo Features
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Optimal Swap Route Demo */}
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '300px' }}>
            <Card
              sx={{
                background: 'rgba(102, 126, 234, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: 3,
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <RouteIcon sx={{ color: '#667eea', mr: 1, fontSize: { xs: 24, md: 28 } }} />
                    <Typography variant="h6" color="white" fontWeight="bold" fontSize={{ xs: '1rem', md: '1.25rem' }}>
                      Optimal Swap Routes
                    </Typography>
                  </Box>
                  <Typography 
                    color="rgba(255,255,255,0.8)" 
                    mb={3} 
                    fontSize={{ xs: '0.8rem', md: '0.875rem' }}
                    sx={{ 
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    Advanced routing finds the best path through multiple liquidity pools (XLM → EURT → USDC)
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    openDemo('swapRoute');
                    demonstrateSwapRoute();
                  }}
                  disabled={!walletConnected}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontSize: { xs: '0.7rem', md: '0.875rem' },
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)'
                    }
                  }}
                >
                  {walletConnected ? 'Try Swap Routing' : 'Connect Wallet First'}
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Credit Score Demo */}
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '300px' }}>
            <Card
              sx={{
                background: 'rgba(118, 75, 162, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(118, 75, 162, 0.2)',
                borderRadius: 3,
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(118, 75, 162, 0.3)'
                }
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CreditIcon sx={{ color: '#764ba2', mr: 1, fontSize: { xs: 24, md: 28 } }} />
                    <Typography variant="h6" color="white" fontWeight="bold" fontSize={{ xs: '1rem', md: '1.25rem' }}>
                      Credit Score Analysis
                    </Typography>
                  </Box>
                  <Typography 
                    color="rgba(255,255,255,0.8)" 
                    mb={3} 
                    fontSize={{ xs: '0.8rem', md: '0.875rem' }}
                    sx={{ 
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    AI-powered credit scoring. Score 70+ gets instant loan approval without collateral
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    openDemo('creditScore');
                    demonstrateCreditScore();
                  }}
                  disabled={!walletConnected}
                  sx={{
                    borderColor: '#764ba2',
                    color: '#764ba2',
                    fontSize: { xs: '0.7rem', md: '0.875rem' },
                    '&:hover': {
                      borderColor: '#764ba2',
                      backgroundColor: 'rgba(118, 75, 162, 0.1)'
                    }
                  }}
                >
                  {walletConnected ? 'Check My Score' : 'Connect Wallet First'}
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Collateral Management Demo */}
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '300px' }}>
            <Card
              sx={{
                background: 'rgba(240, 147, 251, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(240, 147, 251, 0.2)',
                borderRadius: 3,
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(240, 147, 251, 0.3)'
                }
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LockIcon sx={{ color: '#f093fb', mr: 1, fontSize: { xs: 24, md: 28 } }} />
                    <Typography variant="h6" color="white" fontWeight="bold" fontSize={{ xs: '1rem', md: '1.25rem' }}>
                      Smart Collateral
                    </Typography>
                  </Box>
                  <Typography 
                    color="rgba(255,255,255,0.8)" 
                    mb={3} 
                    fontSize={{ xs: '0.8rem', md: '0.875rem' }}
                    sx={{ 
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    Automated collateral locking/unlocking with real-time liquidation protection
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    openDemo('collateral');
                    demonstrateCollateral();
                  }}
                  disabled={!walletConnected}
                  sx={{
                    borderColor: '#f093fb',
                    color: '#f093fb',
                    fontSize: { xs: '0.7rem', md: '0.875rem' },
                    '&:hover': {
                      borderColor: '#f093fb',
                      backgroundColor: 'rgba(240, 147, 251, 0.1)'
                    }
                  }}
                >
                  {walletConnected ? 'Manage Collateral' : 'Connect Wallet First'}
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Swap Route Demo Dialog */}
      <Dialog
        open={demoDialogs.swapRoute}
        onClose={() => closeDemo('swapRoute')}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(102, 126, 234, 0.2)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white', 
          borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center">
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <RouteIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                Optimal Swap Route Analysis
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                AI-powered route optimization for best prices
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => closeDemo('swapRoute')} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {loading.swapRoute ? (
            <Box textAlign="center" py={4}>
              <CircularProgress sx={{ color: '#667eea', mb: 2 }} />
              <Typography color="white">Analyzing optimal routes...</Typography>
              <LinearProgress 
                sx={{ 
                  mt: 2, 
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#667eea' }
                }} 
              />
            </Box>
          ) : demoData.swapRoute && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
                    <Typography variant="h6" color="white" mb={2}>Route Path</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      {demoData.swapRoute.path.map((token, index) => (
                        <React.Fragment key={token}>
                          <Chip 
                            label={token} 
                            sx={{ 
                              backgroundColor: '#667eea', 
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                          {index < demoData.swapRoute.path.length - 1 && (
                            <SwapIcon sx={{ color: '#667eea' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
                    <Typography variant="h6" color="white" mb={2}>Trade Summary</Typography>
                    <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography color="rgba(255,255,255,0.8)">Input:</Typography>
                        <Typography color="white" fontWeight="bold">
                          {demoData.swapRoute.inputAmount} XLM
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography color="rgba(255,255,255,0.8)">Output:</Typography>
                        <Typography color="white" fontWeight="bold">
                          {demoData.swapRoute.outputAmount} USDC
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography color="rgba(255,255,255,0.8)">Price Impact:</Typography>
                        <Typography color="#4caf50" fontWeight="bold">
                          {demoData.swapRoute.priceImpact}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography color="rgba(255,255,255,0.8)">Total Fees:</Typography>
                        <Typography color="white">{demoData.swapRoute.fees}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="h6" color="white" mt={3} mb={2}>Route Steps</Typography>
              {demoData.swapRoute.steps.map((step, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="white">
                      Step {index + 1}: {step.from} → {step.to}
                    </Typography>
                    <Chip 
                      label={`Fee: ${step.fee}`} 
                      size="small"
                      sx={{ backgroundColor: 'rgba(102, 126, 234, 0.3)', color: 'white' }}
                    />
                  </Box>
                  <Typography color="rgba(255,255,255,0.6)" variant="body2" mt={1}>
                    Via {step.pool} • Amount: {step.amount}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid rgba(102, 126, 234, 0.2)', 
          p: 3,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button 
            onClick={() => closeDemo('swapRoute')} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600,
              px: 3
            }}
          >
            Close
          </Button>
          {demoData.swapRoute && (
            <>
              <Button 
                variant="outlined"
                startIcon={<SwapIcon />}
                component={Link}
                href="/swap"
                sx={{ 
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Go to Swap Page
              </Button>
              <Button 
                variant="contained"
                startIcon={<LaunchIcon />}
                component={Link}
                href="/analytics"
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }
                }}
              >
                View Analytics
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Credit Score Demo Dialog */}
      <Dialog
        open={demoDialogs.creditScore}
        onClose={() => closeDemo('creditScore')}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(118, 75, 162, 0.3)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(118, 75, 162, 0.2)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white', 
          borderBottom: '1px solid rgba(118, 75, 162, 0.2)',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center">
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #764ba2, #667eea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <CreditIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                Credit Score Analysis
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                AI-powered creditworthiness assessment
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => closeDemo('creditScore')} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {loading.creditScore ? (
            <Box textAlign="center" py={4}>
              <CircularProgress sx={{ color: '#764ba2', mb: 2 }} />
              <Typography color="white">Analyzing wallet history...</Typography>
              <Typography color="rgba(255,255,255,0.6)" variant="body2" mt={1}>
                Checking transaction patterns, asset diversity, DeFi activity...
              </Typography>
              <LinearProgress 
                sx={{ 
                  mt: 2, 
                  backgroundColor: 'rgba(118, 75, 162, 0.2)',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#764ba2' }
                }} 
              />
            </Box>
          ) : demoData.creditScore && (
            <Box>
              {/* Credit Score Display */}
              <Box textAlign="center" mb={4}>
                <Typography variant="h2" color="white" fontWeight="bold">
                  {demoData.creditScore.score}
                </Typography>
                <Typography variant="h5" color="#764ba2" fontWeight="bold">
                  Grade {demoData.creditScore.grade}
                </Typography>
                <Chip 
                  icon={<CheckIcon />}
                  label={demoData.creditScore.status}
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#4caf50', 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>

              {/* Loan Eligibility */}
              <Paper sx={{ p: 3, mb: 3, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                <Typography variant="h6" color="white" mb={2}>
                  ✅ Loan Eligibility
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="rgba(255,255,255,0.8)">Max Loan Amount:</Typography>
                    <Typography color="white" variant="h6" fontWeight="bold">
                      {demoData.creditScore.maxLoanAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="rgba(255,255,255,0.8)">Interest Rate:</Typography>
                    <Typography color="white" variant="h6" fontWeight="bold">
                      {demoData.creditScore.interestRate}
                    </Typography>
                  </Grid>
                </Grid>
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    '& .MuiAlert-icon': { color: '#4caf50' }
                  }}
                >
                  {demoData.creditScore.recommendation}
                </Alert>
              </Paper>

              {/* Score Breakdown */}
              <Typography variant="h6" color="white" mb={2}>Score Factors</Typography>
              {Object.entries(demoData.creditScore.factors).map(([key, factor]) => (
                <Paper 
                  key={key}
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    background: 'rgba(118, 75, 162, 0.05)',
                    border: '1px solid rgba(118, 75, 162, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography color="white" textTransform="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Chip 
                      label={factor.score}
                      sx={{ 
                        backgroundColor: factor.score >= 80 ? '#4caf50' : factor.score >= 60 ? '#ff9800' : '#f44336',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={factor.score} 
                    sx={{ 
                      mb: 1,
                      backgroundColor: 'rgba(118, 75, 162, 0.2)',
                      '& .MuiLinearProgress-bar': { 
                        backgroundColor: factor.score >= 80 ? '#4caf50' : factor.score >= 60 ? '#ff9800' : '#f44336'
                      }
                    }} 
                  />
                  <Typography color="rgba(255,255,255,0.6)" variant="body2">
                    {factor.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid rgba(118, 75, 162, 0.2)', 
          p: 3,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button 
            onClick={() => closeDemo('creditScore')} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600,
              px: 3
            }}
          >
            Close
          </Button>
          {demoData.creditScore && (
            <>
              <Button 
                variant="outlined"
                startIcon={<BalanceIcon />}
                component={Link}
                href="/loans"
                sx={{ 
                  borderColor: '#764ba2',
                  color: '#764ba2',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Apply for Loan
              </Button>
              <Button 
                variant="contained"
                startIcon={<LaunchIcon />}
                component={Link}
                href="/analytics"
                sx={{ 
                  background: 'linear-gradient(135deg, #764ba2, #667eea)',
                  color: 'white',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #6a4190, #5a6fd8)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(118, 75, 162, 0.3)'
                  }
                }}
              >
                View Full Analysis
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Collateral Management Demo Dialog */}
      <Dialog
        open={demoDialogs.collateral}
        onClose={() => closeDemo('collateral')}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(240, 147, 251, 0.3)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(240, 147, 251, 0.2)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white', 
          borderBottom: '1px solid rgba(240, 147, 251, 0.2)',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center">
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <LockIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                Smart Collateral Management
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Automated collateral optimization and protection
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => closeDemo('collateral')} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {loading.collateral ? (
            <Box textAlign="center" py={4}>
              <CircularProgress sx={{ color: '#f093fb', mb: 2 }} />
              <Typography color="white">Loading collateral positions...</Typography>
              <LinearProgress 
                sx={{ 
                  mt: 2, 
                  backgroundColor: 'rgba(240, 147, 251, 0.2)',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#f093fb' }
                }} 
              />
            </Box>
          ) : demoData.collateralStatus && (
            <Box>
              {/* Portfolio Overview */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, background: 'rgba(240, 147, 251, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography color="rgba(255,255,255,0.8)">Total Locked</Typography>
                    <Typography variant="h5" color="white" fontWeight="bold">
                      {demoData.collateralStatus.totalLocked}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, background: 'rgba(240, 147, 251, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography color="rgba(255,255,255,0.8)">Available</Typography>
                    <Typography variant="h5" color="white" fontWeight="bold">
                      {demoData.collateralStatus.totalAvailable}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography color="rgba(255,255,255,0.8)">Health Factor</Typography>
                    <Typography variant="h5" color="#4caf50" fontWeight="bold">
                      {demoData.collateralStatus.healthFactor}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, background: 'rgba(255, 152, 0, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography color="rgba(255,255,255,0.8)">Liquidation Price</Typography>
                    <Typography variant="h6" color="#ff9800" fontWeight="bold">
                      {demoData.collateralStatus.liquidationPrice}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Locked Collateral */}
              <Typography variant="h6" color="white" mb={2}>
                🔒 Locked Collateral
              </Typography>
              {demoData.collateralStatus.locked.map((item, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    background: 'rgba(240, 147, 251, 0.05)',
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box display="flex" alignItems="center">
                        <LockIcon sx={{ color: '#f093fb', mr: 1 }} />
                        <Box>
                          <Typography color="white" fontWeight="bold">{item.asset}</Typography>
                          <Typography color="rgba(255,255,255,0.6)" variant="body2">
                            {item.amount}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography color="white" fontWeight="bold">{item.value}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Chip 
                        label={`LTV: ${item.ltv}`}
                        sx={{ backgroundColor: 'rgba(76, 175, 80, 0.3)', color: '#4caf50' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Chip 
                        label={item.status}
                        sx={{ backgroundColor: 'rgba(76, 175, 80, 0.3)', color: '#4caf50' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        size="small"
                        startIcon={<UnlockIcon />}
                        sx={{ color: '#f093fb' }}
                      >
                        Unlock
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              {/* Available Assets */}
              <Typography variant="h6" color="white" mt={3} mb={2}>
                💰 Available for Collateral
              </Typography>
              {demoData.collateralStatus.available.map((item, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    background: 'rgba(76, 175, 80, 0.05)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box display="flex" alignItems="center">
                        <BalanceIcon sx={{ color: '#4caf50', mr: 1 }} />
                        <Box>
                          <Typography color="white" fontWeight="bold">{item.asset}</Typography>
                          <Typography color="rgba(255,255,255,0.6)" variant="body2">
                            {item.amount}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography color="white" fontWeight="bold">{item.value}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography color="rgba(255,255,255,0.8)" variant="body2">
                        {item.potential}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<LockIcon />}
                        sx={{ 
                          borderColor: '#4caf50',
                          color: '#4caf50',
                          '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                        }}
                      >
                        Lock as Collateral
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid rgba(240, 147, 251, 0.2)', 
          p: 3,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button 
            onClick={() => closeDemo('collateral')} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600,
              px: 3
            }}
          >
            Close
          </Button>
          {demoData.collateralStatus && (
            <>
              <Button 
                variant="outlined"
                startIcon={<LockIcon />}
                component={Link}
                href="/loans"
                sx={{ 
                  borderColor: '#f093fb',
                  color: '#f093fb',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Manage Loans
              </Button>
              <Button 
                variant="outlined"
                startIcon={<SecurityIcon />}
                component={Link}
                href="/multisig-management"
                sx={{ 
                  borderColor: '#f093fb',
                  color: '#f093fb',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Multisig Security
              </Button>
              <Button 
                variant="contained"
                startIcon={<LaunchIcon />}
                component={Link}
                href="/analytics"
                sx={{ 
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  color: 'white',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #e085f0, #e94e61)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)'
                  }
                }}
              >
                Portfolio Analytics
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
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
    // Get initial status and fetch balance if connected
    const loadWalletStatus = async () => {
      try {
        const status = await walletService.getConnectionStatusWithBalance();
        setWalletStatus(status);
      } catch (error) {
        console.log('ℹ️ Error loading wallet status:', error);
        setWalletStatus({
          isConnected: false,
          wallet: null,
          address: null,
          balance: null
        });
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      // Fallback data ready immediately
      const fallbackStats = {
        totalVolume: '$2.4B',
        totalUsers: '125K+',
        totalTransactions: '890K+',
        activePools: 200,
        avgAPY: '12.5%',
        stellarPrice: 0.12,
        stellarChange: 2.5
      };
      
      const fallbackCrypto = {
        stellar: { price: 0.12, change24h: 2.5, volume24h: 45000000, marketCap: 3200000000 },
        bitcoin: { price: 43000, change24h: 1.2 },
        ethereum: { price: 2600, change24h: 0.8 }
      };

      try {
        // Use Promise.allSettled for better error handling
        const [platformResult, cryptoResult] = await Promise.allSettled([
          DataService.getPlatformStats(),
          DataService.getCryptoData()
        ]);
        
        // Use successful results or fallback data
        setStats(platformResult.status === 'fulfilled' ? platformResult.value : fallbackStats);
        setCryptoData(cryptoResult.status === 'fulfilled' ? cryptoResult.value : fallbackCrypto);
        
        // Log any rejections without breaking the UI
        if (platformResult.status === 'rejected') {
          console.log('ℹ️ Platform stats error:', platformResult.reason?.name);
        }
        if (cryptoResult.status === 'rejected') {
          console.log('ℹ️ Crypto data error:', cryptoResult.reason?.name);
        }
        
      } catch (error) {
        // This should rarely happen with allSettled, but just in case
        console.log('ℹ️ Unexpected stats error:', error.name);
        setError(error);
        setStats(fallbackStats);
        setCryptoData(fallbackCrypto);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Update every 3 minutes (reduced frequency)
    const interval = setInterval(fetchData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  // Show error notification if there was an issue but continue with fallback data
  if (error) {
    console.warn('Using fallback data due to API error:', error);
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
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    // Check initial wallet status
    const status = walletService.getConnectionStatus();
    setWalletConnected(status.isConnected);

    // Listen for wallet connection changes
    const unsubscribe = walletService.onConnectionChange((event) => {
      setWalletConnected(event.type === 'connected');
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <EnhancedDarkBackground />
      
      {/* Header Navigation */}
      <Header transparent={true} />
      
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

      {/* Section 2: Demo Features */}
      <DemoFeatures walletConnected={walletConnected} />

      {/* Section 3: Features - Full Screen */}
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

      {/* Section 4: Stats - Full Screen */}
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
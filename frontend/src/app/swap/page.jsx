'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  CircularProgress,
  Avatar,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Paper
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  AccountBalanceWallet as WalletIcon,
  MonetizationOn as MonetizationOnIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  Gavel as GavelIcon,
  TrendingUp as TrendingUpIcon,
  Route as RouteIcon,
  Speed as SpeedIcon,
  AttachMoney as AttachMoneyIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import Header from '../components/Header';
import { PulseBeams } from '@/components/ui/PulseBeams';
import { swapRouter } from '../lib/swapRouter';
import stellarTestnetService from '../lib/stellarTestnetService';

// Enhanced Dark Background Component
const EnhancedDarkBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -2,
      paddingTop: '80px', // Header spacing
      background: `
        radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
        #000000
      `,
    }}
  />
);

const SwapPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userData, setUserData] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [swapRouter, setSwapRouter] = useState(null);

  // Swap state
  const [fromToken, setFromToken] = useState({ symbol: 'XLM', icon: '🌟', balance: 1000 });
  const [toToken, setToToken] = useState({ symbol: 'USDC', icon: '💵', balance: 500 });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  
  // Route optimization state
  const [optimalRoutes, setOptimalRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);
  const [stellarAccount, setStellarAccount] = useState(null);

  // Available tokens with BNB added
  const tokens = [
    { symbol: 'XLM', icon: '🌟', balance: 1000 },
    { symbol: 'USDC', icon: '💵', balance: 500 },
    { symbol: 'BTC', icon: '₿', balance: 0.5 },
    { symbol: 'ETH', icon: '⟠', balance: 2 },
    { symbol: 'BNB', icon: '🔶', balance: 5 }
  ];

  // Load real account data from Stellar testnet
  const loadRealAccountData = async (publicKey) => {
    try {
      console.log('📊 Loading real account data from Stellar testnet...');
      
      const balances = await stellarTestnetService.getAccountBalance(publicKey);
      setRealTimeData(prev => ({ ...prev, balances }));
      
      // Get 24h stats for XLM/USDC
      const stats = await stellarTestnetService.get24hStats(
        stellarTestnetService.assets.XLM,
        stellarTestnetService.assets.USDC
      );
      setRealTimeData(prev => ({ ...prev, stats }));
      
      console.log('✅ Real account data loaded:', { balances, stats });
      
    } catch (error) {
      console.error('❌ Error loading real account data:', error);
      setNotification({
        open: true,
        message: 'Could not load real account data',
        severity: 'warning'
      });
    }
  };

  // Initialize SwapRouter on component mount
  useEffect(() => {
    setIsClient(true);
    const router = swapRouter;
    setSwapRouter(router);
    
    // Simulate wallet connection check
    setIsConnected(false);
    setUserData({
      creditScore: 85,
      portfolioValue: 25000,
      feeTier: 'Gold'
    });

    // Start real-time price monitoring
    const cleanup = stellarTestnetService.startPriceMonitoring((priceUpdate) => {
      setRealTimeData(prev => ({
        ...prev,
        currentPrice: priceUpdate
      }));
    });

    return cleanup;
  }, []);

  // Calculate optimal routes when tokens or amount changes
  useEffect(() => {
    if (swapRouter && fromAmount && parseFloat(fromAmount) > 0 && fromToken.symbol !== toToken.symbol) {
      calculateOptimalRoutes();
    } else {
      setOptimalRoutes([]);
      setSelectedRoute(null);
      setToAmount('');
    }
  }, [fromAmount, fromToken.symbol, toToken.symbol, swapRouter]);

  const calculateOptimalRoutes = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    setRouteLoading(true);
    try {
      const amount = parseFloat(fromAmount);
      
      // Use real Stellar testnet data
      const realRoute = await stellarTestnetService.calculateOptimalRoute(
        fromToken.symbol,
        toToken.symbol,
        amount
      );
      
      setOptimalRoutes([realRoute]);
      setSelectedRoute(realRoute);
      setToAmount(realRoute.totalAmountOut.toFixed(6));
      
      console.log('✅ Real route calculated:', realRoute);
      
    } catch (error) {
      console.error('❌ Real route calculation error:', error);
      
      // Fallback to mock router
      try {
        const amount = parseFloat(fromAmount) * 10000000; // Convert to stroops for mock
        const routes = swapRouter.findMultipleRoutes(fromToken.symbol, toToken.symbol, amount, 3);
        
        if (routes.length > 0) {
          const bestRoute = routes[0];
          setOptimalRoutes(routes);
          setSelectedRoute(bestRoute);
          setToAmount((bestRoute.outputAmount / 10000000).toFixed(6));
          
          setNotification({ 
            open: true, 
            message: 'Using simulated data - connect wallet for real testnet data', 
            severity: 'warning' 
          });
        }
      } catch (fallbackError) {
        setNotification({ 
          open: true, 
          message: 'Error calculating route', 
          severity: 'error' 
        });
      }
    } finally {
      setRouteLoading(false);
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
  };

  const executeSwap = async () => {
    if (!isConnected) {
      setNotification({ open: true, message: 'Please connect your wallet first', severity: 'warning' });
      return;
    }

    if (!selectedRoute || !fromAmount || parseFloat(fromAmount) <= 0) {
      setNotification({ open: true, message: 'Please select a valid route', severity: 'error' });
      return;
    }

    setSwapLoading(true);
    try {
      if (selectedRoute.source === 'stellar_dex' && stellarAccount) {
        // Execute real swap on Stellar testnet
        console.log('🚀 Executing real Stellar testnet swap...');
        
        // Validate swap before execution
        const validation = await stellarTestnetService.validateSwap(selectedRoute, stellarAccount.publicKey);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        // Execute real swap (requires user's keypair)
        // Note: In production, this would use the wallet service to get user's keypair
        const result = await stellarTestnetService.executeSwap(
          selectedRoute,
          stellarAccount, // This would be the user's keypair from wallet
          null
        );
        
        setNotification({
          open: true,
          message: `Real swap executed! TX: ${result.hash.slice(0, 8)}... Received ${result.amountOut.toFixed(6)} ${toToken.symbol}`, 
          severity: 'success'
        });
        
        // Refresh account balance
        if (stellarAccount) {
          loadRealAccountData(stellarAccount.publicKey);
        }
        
      } else {
        // Simulate swap execution for mock data
        await new Promise(resolve => setTimeout(resolve, selectedRoute.steps?.length * 1000 || 2000));
        
        setNotification({
          open: true,
          message: `Simulated swap completed! Received ${toAmount} ${toToken.symbol}`, 
          severity: 'info'
        });
      }
      
      setFromAmount('');
      setToAmount('');
      setOptimalRoutes([]);
      setSelectedRoute(null);
      
    } catch (error) {
      console.error('❌ Swap execution failed:', error);
      setNotification({ 
        open: true, 
        message: `Swap failed: ${error.message}`, 
        severity: 'error' 
      });
    } finally {
      setSwapLoading(false);
    }
  };

  const connectWallet = () => {
    setIsConnected(true);
    setUserAddress('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    setNotification({ open: true, message: 'Wallet connected successfully!', severity: 'success' });
  };

  const setMaxAmount = () => {
    setFromAmount(fromToken.balance.toString());
  };

  // Tab Navigation Component
  const TabNavigation = () => (
    <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            height: 3
          }
        }}
      >
        <Tab 
          icon={<SwapIcon />} 
          label="Swap" 
          sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }}
        />
        <Tab 
          icon={<AssessmentIcon />} 
          label="Analytics" 
          sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }}
        />
        <Tab 
          icon={<GavelIcon />} 
          label="Lending" 
          sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }}
        />
        <Tab 
          icon={<MonetizationOnIcon />} 
          label="Liquidity" 
          sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' } }}
        />
      </Tabs>
    </Box>
  );

  // Enhanced User Dashboard
  const UserDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={{ 
        background: 'rgba(255,255,255,0.05)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        mb: 4
      }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.main' }}>
                  <WalletIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="white">
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    {isConnected ? `${userAddress.slice(0, 8)}...` : 'Connect Wallet'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box textAlign="center">
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <PulseBeams />
                  <Typography variant="h4" color="white" sx={{ position: 'relative', zIndex: 1 }}>
                    {userData?.creditScore || 0}
                  </Typography>
                </Box>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  Credit Score
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box textAlign="center">
                <Typography variant="h6" color="white">
                  ${userData?.portfolioValue?.toLocaleString() || 0}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  Portfolio Value
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box textAlign="center">
                <Chip 
                  label={userData?.feeTier || 'Standard'} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
                <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block">
                  Fee Tier
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Stack spacing={1}>
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  Liquidity: $12,450
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  Active Loans: 2
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Enhanced Swap Interface with Route Optimization
  const SwapInterface = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={8}>
        <Card sx={{ 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          p: 3
        }}>
          <Stack spacing={3}>
            <Typography variant="h5" color="white" gutterBottom>
              Optimal Swap Router
            </Typography>
            
            {/* From Token */}
            <Box sx={{ 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: 2, 
              p: 3,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  From
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Balance: {fromToken.balance}
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={fromToken.symbol}
                    onChange={(e) => {
                      const token = tokens.find(t => t.symbol === e.target.value);
                      setFromToken(token);
                    }}
                    sx={{ 
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    {tokens.map((token) => (
                      <MenuItem key={token.symbol} value={token.symbol}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{token.icon}</span>
                          <span>{token.symbol}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  type="number"
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': { color: 'white', fontSize: '1.5rem' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                  }}
                />
                
                <Button 
                  onClick={setMaxAmount}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': { borderColor: 'white' }
                  }}
                >
                  MAX
                </Button>
              </Stack>
            </Box>

            {/* Swap Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <IconButton 
                onClick={handleSwapTokens}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': { transform: 'rotate(180deg)' },
                  transition: 'transform 0.3s ease'
                }}
              >
                <SwapIcon />
              </IconButton>
            </Box>

            {/* To Token */}
            <Box sx={{ 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: 2, 
              p: 3,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  To
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Balance: {toToken.balance}
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={toToken.symbol}
                    onChange={(e) => {
                      const token = tokens.find(t => t.symbol === e.target.value);
                      setToToken(token);
                    }}
                    sx={{ 
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    {tokens.map((token) => (
                      <MenuItem key={token.symbol} value={token.symbol}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{token.icon}</span>
                          <span>{token.symbol}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  value={routeLoading ? 'Calculating...' : toAmount}
                  placeholder="0.0"
                  disabled
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': { color: 'white', fontSize: '1.5rem' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                  }}
                />
              </Stack>
            </Box>

            {/* Route Information */}
            {selectedRoute && (
              <Box sx={{ 
                background: 'rgba(102, 126, 234, 0.1)', 
                borderRadius: 2, 
                p: 3,
                border: '1px solid rgba(102, 126, 234, 0.3)'
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="white">
                    Optimal Route Found
                  </Typography>
                  <Chip 
                    label={`${selectedRoute.steps.length} Hops`}
                    size="small"
                    sx={{ bgcolor: 'rgba(102, 126, 234, 0.3)', color: 'white' }}
                  />
                </Stack>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Route Path
                    </Typography>
                    <Typography variant="body1" color="white">
                      {selectedRoute.path.join(' → ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Total Fees
                    </Typography>
                    <Typography variant="body1" color="white">
                      ${(selectedRoute.totalFee / 10000000 * 0.12).toFixed(4)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Price Impact
                    </Typography>
                    <Typography variant="body1" color="white">
                      {selectedRoute.slippage?.toFixed(2) || 0}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      Efficiency
                    </Typography>
                    <Typography variant="body1" color="white">
                      {selectedRoute.efficiency?.toFixed(1) || 0}%
                    </Typography>
                  </Grid>
                </Grid>
                
                <Button
                  onClick={() => setShowRouteDetails(true)}
                  variant="outlined"
                  size="small"
                  startIcon={<RouteIcon />}
                  sx={{ 
                    mt: 2,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  View Route Details
                </Button>
              </Box>
            )}

            {/* Alternative Routes */}
            {optimalRoutes.length > 1 && (
              <Box>
                <Typography variant="h6" color="white" mb={2}>
                  Alternative Routes
                </Typography>
                <Stack spacing={1}>
                  {optimalRoutes.slice(1).map((route, index) => (
                    <Paper
                      key={index}
                      sx={{
                        background: 'rgba(255,255,255,0.03)',
                        p: 2,
                        cursor: 'pointer',
                        border: selectedRoute === route ? '1px solid #667eea' : '1px solid rgba(255,255,255,0.1)',
                        '&:hover': { background: 'rgba(255,255,255,0.08)' }
                      }}
                      onClick={() => {
                        setSelectedRoute(route);
                        setToAmount((route.outputAmount / 10000000).toFixed(6));
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="white">
                          {route.path.join(' → ')} ({route.steps.length} hops)
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            {route.efficiency?.toFixed(1)}% efficient
                          </Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            {(route.outputAmount / 10000000).toFixed(6)} {toToken.symbol}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                onClick={executeSwap}
                disabled={!selectedRoute || swapLoading || !isConnected}
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {swapLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Execute ${selectedRoute?.steps.length || 0}-Hop Swap`
                )}
              </Button>
              
              <IconButton
                onClick={() => setShowSettings(true)}
                sx={{ 
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Card>
      </Grid>

      {/* Market Analytics Sidebar */}
      <Grid item xs={12} lg={4}>
        <SwapAnalytics />
      </Grid>
    </Grid>
  );

  // Route Details Dialog
  const RouteDetailsDialog = () => (
    <Dialog
      open={showRouteDetails}
      onClose={() => setShowRouteDetails(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ color: 'white' }}>
        Route Execution Details
      </DialogTitle>
      <DialogContent>
        {selectedRoute && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" color="white" mb={2}>
                Swap Path: {selectedRoute.path.join(' → ')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Input
                  </Typography>
                  <Typography variant="h6" color="white">
                    {(parseFloat(fromAmount) || 0).toFixed(6)} {fromToken.symbol}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Total Output
                  </Typography>
                  <Typography variant="h6" color="white">
                    {(selectedRoute.outputAmount / 10000000).toFixed(6)} {toToken.symbol}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <Box>
              <Typography variant="h6" color="white" mb={2}>
                Step-by-Step Breakdown
              </Typography>
              <List>
                {selectedRoute.steps.map((step, index) => (
                  <ListItem key={index} sx={{ background: 'rgba(255,255,255,0.03)', mb: 1, borderRadius: 1 }}>
                    <ListItemIcon>
                      <Chip 
                        label={index + 1} 
                        size="small" 
                        sx={{ bgcolor: 'primary.main', color: 'white' }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography color="white">
                          {step.from} → {step.to}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} mt={1}>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Input: {(step.inputAmount / 10000000).toFixed(6)}
                          </Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Output: {(step.outputAmount / 10000000).toFixed(6)}
                          </Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Fee: {(step.fee / 10000000).toFixed(6)}
                          </Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                            Impact: {step.priceImpact?.toFixed(2)}%
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowRouteDetails(false)} sx={{ color: 'white' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Rest of the components remain the same...
  const AnalyticsInterface = () => (
    <Grid container spacing={4}>
      {/* Analytics content */}
    </Grid>
  );

  const LendingInterface = () => (
    <Grid container spacing={4}>
      {/* Lending content */}
    </Grid>
  );

  const LiquidityInterface = () => (
    <Grid container spacing={4}>
      {/* Liquidity content */}
    </Grid>
  );

  const SwapAnalytics = () => (
    <Card sx={{ 
      background: 'rgba(255,255,255,0.05)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      height: 'fit-content'
    }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" color="white">
            Market Analytics
          </Typography>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <RefreshIcon />
          </IconButton>
        </Stack>

        <Stack spacing={3}>
          {!isClient ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.5)' }} />
            </Box>
          ) : (
            tokens.slice(0, 4).map((token, index) => (
            <Box key={token.symbol}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>{token.icon}</span>
                  <Typography variant="body1" color="white">
                    {token.symbol}
                  </Typography>
                </Stack>
                <Stack alignItems="flex-end">
                  <Typography variant="body1" color="white">
                    ${swapRouter?.getTokenPrice(token.symbol)?.toFixed(4) || '0.0000'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={index % 2 === 0 ? '#4caf50' : '#f44336'}
                  >
                    {index % 2 === 0 ? '+' : '-'}{((index + 1) * 2.5).toFixed(2)}%
                  </Typography>
                </Stack>
              </Stack>
              {index < 3 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />}
            </Box>
          )))}
        </Stack>

        <Box mt={4}>
          <Typography variant="h6" color="white" mb={2}>
            Liquidity Pools
          </Typography>
          <Stack spacing={2}>
            {['XLM-USDC', 'BTC-ETH', 'XLM-BTC'].map((pool) => (
              <Box 
                key={pool}
                sx={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: 1, 
                  p: 2 
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="white">
                    {pool}
                  </Typography>
                  <Stack alignItems="flex-end">
                    <Typography variant="body2" color="white">
                      ${realTimeData?.stats?.volume24h ? 
                        realTimeData.stats.volume24h.toLocaleString() : 
                        (pool === 'XLM-USDC' ? '1,250,000' : pool === 'BTC-ETH' ? '2,800,000' : '750,000')
                      }
                    </Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.7)">
                      TVL
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <SwapInterface />;
      case 1:
        return <AnalyticsInterface />;
      case 2:
        return <LendingInterface />;
      case 3:
        return <LiquidityInterface />;
      default:
        return <SwapInterface />;
    }
  };

  return (
    <>
      <EnhancedDarkBackground />
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <UserDashboard />
        <TabNavigation />
        {renderTabContent()}
      </Container>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        PaperProps={{
          sx: {
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Swap Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ minWidth: 300 }}>
            <Box>
              <Typography variant="body2" color="rgba(255,255,255,0.7)" mb={2}>
                Slippage Tolerance: {slippage}%
              </Typography>
              <Slider
                value={slippage}
                onChange={(_, value) => setSlippage(value)}
                min={0.1}
                max={5}
                step={0.1}
                sx={{ color: 'primary.main' }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Route Details Dialog */}
      <RouteDetailsDialog />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SwapPage; 
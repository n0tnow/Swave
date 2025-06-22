'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  SwapVert as SwapIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingIcon,
  Speed as SpeedIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import walletService from '../lib/walletService';
import swapRouter from '../lib/swapRouter';

const SwapInterface = () => {
  // State management
  const [walletConnection, setWalletConnection] = useState({
    isConnected: false,
    address: null,
    balance: null,
    wallet: null
  });

  const [swapState, setSwapState] = useState({
    fromToken: 'XLM',
    toToken: 'USDC',
    fromAmount: '',
    toAmount: '',
    isLoading: false,
    error: null,
    route: null,
    slippage: 5, // 5%
    algorithm: 'auto' // auto, dijkstra, astar
  });

  const [routingData, setRoutingData] = useState({
    availableRoutes: [],
    selectedRoute: null,
    metrics: null,
    fees: null
  });

  const [tabValue, setTabValue] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Available tokens
  const tokens = [
    { code: 'XLM', name: 'Stellar Lumens', icon: '⭐', price: 0.12 },
    { code: 'USDC', name: 'USD Coin', icon: '💵', price: 1.00 },
    { code: 'BTC', name: 'Bitcoin', icon: '₿', price: 45000 },
    { code: 'ETH', name: 'Ethereum', icon: '♦️', price: 3000 },
    { code: 'ADA', name: 'Cardano', icon: '🟣', price: 0.35 },
    { code: 'DOT', name: 'Polkadot', icon: '⚫', price: 8.50 }
  ];

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await swapRouter.initialize();
        console.log('🚀 Services initialized');
      } catch (error) {
        console.error('❌ Service initialization failed:', error);
        setSwapState(prev => ({ ...prev, error: 'Failed to initialize services' }));
      }
    };

    initializeServices();

    // Listen for wallet connection changes
    const unsubscribe = walletService.onConnectionChange((event) => {
      if (event.type === 'connected') {
        setWalletConnection({
          isConnected: true,
          address: event.address,
          wallet: event.wallet,
          balance: null // Will be loaded separately
        });
        loadBalance();
      } else if (event.type === 'disconnected') {
        setWalletConnection({
          isConnected: false,
          address: null,
          balance: null,
          wallet: null
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user balance
  const loadBalance = useCallback(async () => {
    if (!walletConnection.isConnected) return;

    try {
      const balance = await walletService.getBalance();
      setWalletConnection(prev => ({ ...prev, balance }));
    } catch (error) {
      console.error('❌ Failed to load balance:', error);
    }
  }, [walletConnection.isConnected]);

  // Connect wallet
  const connectWallet = async () => {
    try {
      setSwapState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const connection = await walletService.connectWallet();
      console.log('✅ Wallet connected:', connection);
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      setSwapState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to connect wallet'
      }));
    } finally {
      setSwapState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Calculate swap route
  const calculateRoute = useCallback(async () => {
    if (!swapState.fromAmount || parseFloat(swapState.fromAmount) <= 0) {
      setRoutingData({
        availableRoutes: [],
        selectedRoute: null,
        metrics: null,
        fees: null
      });
      return;
    }

    try {
      const amount = parseFloat(swapState.fromAmount);
      const route = await swapRouter.findBestRoute(
        swapState.fromToken,
        swapState.toToken,
        amount,
        swapState.algorithm
      );

      setRoutingData({
        availableRoutes: [route],
        selectedRoute: route,
        metrics: swapRouter.getMetrics(),
        fees: route.fees
      });

      // Update estimated output
      setSwapState(prev => ({
        ...prev,
        toAmount: route.estimatedOutput.toFixed(6),
        route
      }));

    } catch (error) {
      console.error('❌ Route calculation failed:', error);
      setSwapState(prev => ({ ...prev, error: error.message }));
    }
  }, [swapState.fromAmount, swapState.fromToken, swapState.toToken, swapState.algorithm]);

  // Execute swap
  const executeSwap = async () => {
    if (!walletConnection.isConnected) {
      setSwapState(prev => ({ ...prev, error: 'Please connect your wallet first' }));
      return;
    }

    if (!routingData.selectedRoute) {
      setSwapState(prev => ({ ...prev, error: 'No route available for this swap' }));
      return;
    }

    try {
      setSwapState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check balance
      const hasBalance = await walletService.checkBalance(
        parseFloat(swapState.fromAmount),
        swapState.fromToken
      );

      if (!hasBalance) {
        throw new Error(`Insufficient ${swapState.fromToken} balance`);
      }

      // Execute swap
      const transaction = await swapRouter.executeSwap(
        routingData.selectedRoute,
        walletConnection.address,
        walletService
      );

      console.log('✅ Swap executed successfully:', transaction);
      
      // Refresh balance
      await loadBalance();

    } catch (error) {
      console.error('❌ Swap execution failed:', error);
      setSwapState(prev => ({ ...prev, error: error.message }));
    } finally {
      setSwapState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Swap tokens
  const swapTokens = () => {
    setSwapState(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }));
  };

  // Update amounts with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(calculateRoute, 500);
    return () => clearTimeout(timeoutId);
  }, [calculateRoute]);

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🌊 SWAVE DEX
        </Typography>
      </motion.div>

      {/* Wallet Connection */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            {!walletConnection.isConnected ? (
              <Box textAlign="center">
                <WalletIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                <Typography variant="h6" color="white" gutterBottom>
                  Connect Your Wallet
                </Typography>
                <Button
                  variant="contained"
                  onClick={connectWallet}
                  disabled={swapState.isLoading}
                  sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)' }}
                  startIcon={swapState.isLoading ? <CircularProgress size={20} /> : <WalletIcon />}
                >
                  {swapState.isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </Box>
            ) : (
              <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Badge badgeContent={walletConnection.wallet?.name} color="secondary">
                      <WalletIcon sx={{ color: 'white', mr: 1 }} />
                    </Badge>
                    <Typography variant="h6" color="white">
                      Connected
                    </Typography>
                  </Box>
                  <IconButton onClick={() => walletService.disconnect()} sx={{ color: 'white' }}>
                    <RefreshIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="rgba(255,255,255,0.8)" gutterBottom>
                  {walletConnection.address?.slice(0, 8)}...{walletConnection.address?.slice(-8)}
                </Typography>
                
                {walletConnection.balance && (
                  <Typography variant="h6" color="white">
                    {walletConnection.balance.xlm.toFixed(4)} XLM
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Swap Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
              <Tab label="Swap" />
              <Tab label="Route Analysis" />
              <Tab label="Settings" />
            </Tabs>

            {tabValue === 0 && (
              <Box>
                {/* From Token */}
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>From</InputLabel>
                      <Select
                        value={swapState.fromToken}
                        onChange={(e) => setSwapState(prev => ({ ...prev, fromToken: e.target.value }))}
                        label="From"
                      >
                        {tokens.map(token => (
                          <MenuItem key={token.code} value={token.code}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span>{token.icon}</span>
                              <span>{token.code}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      label="Amount"
                      value={swapState.fromAmount}
                      onChange={(e) => setSwapState(prev => ({ ...prev, fromAmount: e.target.value }))}
                      type="number"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Swap Button */}
                <Box textAlign="center" my={2}>
                  <IconButton
                    onClick={swapTokens}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <SwapIcon />
                  </IconButton>
                </Box>

                {/* To Token */}
                <Box sx={{ mb: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>To</InputLabel>
                      <Select
                        value={swapState.toToken}
                        onChange={(e) => setSwapState(prev => ({ ...prev, toToken: e.target.value }))}
                        label="To"
                      >
                        {tokens.map(token => (
                          <MenuItem key={token.code} value={token.code}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span>{token.icon}</span>
                              <span>{token.code}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      label="You'll receive"
                      value={swapState.toAmount}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                </Box>

                {/* Route Preview */}
                {routingData.selectedRoute && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Best Route ({routingData.selectedRoute.algorithm})
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {routingData.selectedRoute.path.map((step, index) => (
                        <React.Fragment key={index}>
                          <Chip label={step.from} size="small" />
                          <Typography variant="body2">→</Typography>
                          {index === routingData.selectedRoute.path.length - 1 && (
                            <Chip label={step.to} size="small" />
                          )}
                        </React.Fragment>
                      ))}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Fee: {routingData.fees?.totalFees.toFixed(6)} {swapState.fromToken}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time: {routingData.selectedRoute.executionTime.toFixed(2)}ms
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Execute Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={executeSwap}
                  disabled={
                    !walletConnection.isConnected ||
                    swapState.isLoading ||
                    !routingData.selectedRoute ||
                    !swapState.fromAmount
                  }
                  sx={{ mt: 2, py: 1.5 }}
                  startIcon={swapState.isLoading ? <CircularProgress size={20} /> : <SwapIcon />}
                >
                  {swapState.isLoading ? 'Executing Swap...' : 'Execute Swap'}
                </Button>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>Route Analysis</Typography>
                
                {routingData.metrics && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Performance Metrics</Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Chip 
                        icon={<TrendingIcon />}
                        label={`${routingData.metrics.totalTokens} Tokens`}
                        variant="outlined"
                      />
                      <Chip 
                        icon={<SpeedIcon />}
                        label={`${routingData.metrics.totalPools} Pools`}
                        variant="outlined"
                      />
                      <Chip 
                        icon={<InfoIcon />}
                        label={`${routingData.metrics.cacheSize} Cached Prices`}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                )}

                {routingData.fees && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Fee Breakdown</Typography>
                    <List dense>
                      {routingData.fees.breakdown.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`Step ${item.step}: ${item.pool}`}
                            secondary={`Fee: ${item.fee.toFixed(6)} (${(item.feeRate * 100).toFixed(2)}%)`}
                          />
                        </ListItem>
                      ))}
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Network Fee"
                          secondary={`${routingData.fees.networkFee} XLM`}
                        />
                      </ListItem>
                    </List>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Settings</Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Routing Algorithm</InputLabel>
                  <Select
                    value={swapState.algorithm}
                    onChange={(e) => setSwapState(prev => ({ ...prev, algorithm: e.target.value }))}
                    label="Routing Algorithm"
                  >
                    <MenuItem value="auto">Auto (Best Route)</MenuItem>
                    <MenuItem value="dijkstra">Dijkstra Algorithm</MenuItem>
                    <MenuItem value="astar">A* Algorithm</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Slippage Tolerance: {swapState.slippage}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={swapState.slippage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box display="flex" gap={1} mt={1}>
                    {[1, 3, 5, 10].map(value => (
                      <Button
                        key={value}
                        size="small"
                        variant={swapState.slippage === value ? 'contained' : 'outlined'}
                        onClick={() => setSwapState(prev => ({ ...prev, slippage: value }))}
                      >
                        {value}%
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {swapState.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="error" 
              onClose={() => setSwapState(prev => ({ ...prev, error: null }))}
              sx={{ mb: 2 }}
            >
              {swapState.error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SwapInterface; 
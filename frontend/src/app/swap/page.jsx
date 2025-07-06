'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Grid,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Collapse,
  Fade
} from '@mui/material';
import {
  SwapVert as SwapIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as WalletIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  LocalAtm as LocalAtmIcon,
  Security as SecurityIcon,
  Insights as InsightsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Pool as PoolIcon,
  CompareArrows as CompareArrowsIcon,
  ExpandMore as ExpandMoreIcon,
  Route as RouteIcon,
  FlashOn as FlashOnIcon,
  ShieldOutlined as ShieldIcon,
  TrendingFlat as TrendingFlatIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import BackgroundPaths from '../components/BackgroundPaths';
import walletService from '../lib/walletService';
import { TokenService } from '../lib/tokenService';
import { EnhancedSwapRouter } from '../lib/swapRouter';

// Initialize services
const tokenService = new TokenService();
const swapRouter = new EnhancedSwapRouter();

// LocalStorage helpers
const STORAGE_KEYS = {
  WALLET_BALANCES: 'swave_wallet_balances',
  RECENT_TRANSACTIONS: 'swave_recent_transactions',
  USER_PREFERENCES: 'swave_user_preferences'
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

// Enhanced Token selector component
const TokenSelector = React.memo(({ open, onClose, onSelect, selectedToken, tokens, balances }) => {
  const filteredTokens = useMemo(() => {
    return tokens.filter(token => token.symbol !== selectedToken?.symbol);
  }, [tokens, selectedToken]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          color: '#fff'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#fff', 
        textAlign: 'center', 
        fontWeight: 700,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        Select Token
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List>
          {filteredTokens.map((token) => (
            <ListItem
              key={token.symbol}
              onClick={() => onSelect(token)}
              sx={{
                cursor: 'pointer',
                py: 2,
                px: 3,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  transform: 'translateX(4px)'
                },
                transition: 'all 0.3s ease',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  width: 40,
                  height: 40,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#fff'
                }}>
                  {token.symbol[0]}
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ flex: 1, ml: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography component="span" sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    {token.symbol}
                  </Typography>
                  <Typography component="span" sx={{ color: '#22c55e', fontWeight: 600, fontSize: '0.9rem' }}>
                    ${token.price?.toFixed(4) || '0.0000'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography component="span" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
                    {token.name}
                  </Typography>
                  <Typography component="span" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                    {(balances[token.symbol] || 0).toLocaleString()} {token.symbol}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
});

// Enhanced Wallet Balance Display
const WalletBalanceDisplay = React.memo(({ balances, selectedToken, isLoading }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        const status = await walletService.getConnectionStatusWithBalance();
        setWalletConnected(status.isConnected);
        setWalletAddress(status.address || '');
        setWalletBalance(status.balance || null);
      } catch (error) {
        console.error('Error checking wallet status:', error);
      }
    };

    checkWalletStatus();
    
    // Real-time wallet updates
    const unsubscribe = walletService.onConnectionChange(async (event) => {
      setWalletConnected(event.type === 'connected');
      setWalletAddress(event.address || '');
      
      if (event.type === 'connected') {
        try {
          const status = await walletService.getConnectionStatusWithBalance();
          setWalletBalance(status.balance || null);
        } catch (error) {
          console.error('Error getting wallet balance:', error);
        }
      } else {
        setWalletBalance(null);
      }
    });

    return unsubscribe;
  }, []);

    if (!walletConnected || !selectedToken) return null;

  // Use real wallet balance or fallback to stored balance
  const realBalance = walletBalance && selectedToken.symbol === 'XLM' ? walletBalance.xlm : null;
  const balance = realBalance || balances[selectedToken.symbol] || 0;
  const formattedAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: 2,
        mb: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WalletIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.2rem' }} />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
              {formattedAddress}
            </Typography>
            {realBalance && (
              <Chip 
                label="Live"
                size="small"
                sx={{
                  bgcolor: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            {isLoading ? (
              <CircularProgress size={16} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
            ) : (
              <>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                  {balance.toLocaleString()} {selectedToken.symbol}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                  ≈ ${(balance * (selectedToken.price || 0)).toFixed(2)}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
});

// Optimal Route Display Component
const OptimalRoute = React.memo(({ routeInfo, fromToken, toToken, expanded, onToggle }) => {
  if (!routeInfo) return null;

  const routeSteps = routeInfo.path || [fromToken?.symbol, toToken?.symbol];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        maxWidth: 600,
        width: '100%'
    }}>
        <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ 
              color: '#fff', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}>
              <RouteIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              Optimal Route
        </Typography>
            <IconButton 
              onClick={onToggle}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {expanded ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
      </Box>

          {/* Route Path Visualization - Centered */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {routeSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <Chip
                    label={step}
                    avatar={<Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', width: 24, height: 24, color: '#fff' }}>{step[0]}</Avatar>}
        sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 600
                    }}
                  />
                  {index < routeSteps.length - 1 && (
                    <KeyboardArrowRightIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  )}
                </React.Fragment>
              ))}
            </Stack>
          </Box>

          <Collapse in={expanded}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                justifyContent: 'center'
              }}>
                <Box sx={{ 
                  flex: '1 1 calc(50% - 8px)', 
                  minWidth: '120px',
                  textAlign: 'center', 
                  p: 2, 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.02)' 
                }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', mb: 1 }}>
                    Network Fee
                  </Typography>
                  <Typography sx={{ color: '#22c55e', fontWeight: 600 }}>
                    {routeInfo.networkFee} XLM
                  </Typography>
                </Box>
                <Box sx={{ 
                  flex: '1 1 calc(50% - 8px)', 
                  minWidth: '120px',
                  textAlign: 'center', 
                  p: 2, 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.02)' 
                }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', mb: 1 }}>
                    Price Impact
                  </Typography>
                  <Typography sx={{ 
                    color: parseFloat(routeInfo.priceImpact) > 5 ? '#f59e0b' : '#22c55e', 
                    fontWeight: 600 
                  }}>
                    {routeInfo.priceImpact}%
                  </Typography>
                </Box>
                <Box sx={{ 
                  flex: '1 1 calc(50% - 8px)', 
                  minWidth: '120px',
                  textAlign: 'center', 
                  p: 2, 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.02)' 
                }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', mb: 1 }}>
                    Slippage
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                    {routeInfo.slippageTolerance}%
                  </Typography>
                </Box>
                <Box sx={{ 
                  flex: '1 1 calc(50% - 8px)', 
                  minWidth: '120px',
                  textAlign: 'center', 
                  p: 2, 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.02)' 
                }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', mb: 1 }}>
                    Total Fee
                  </Typography>
                  <Typography sx={{ color: '#f59e0b', fontWeight: 600 }}>
                    ${routeInfo.totalFee}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
});

// Enhanced Animated Swap Button
const AnimatedSwapButton = React.memo(({ 
  loading, 
  disabled, 
  onClick, 
  fromToken, 
  toToken, 
  fromAmount 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Button
        fullWidth
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          py: 3,
          fontSize: '1.2rem',
          fontWeight: 600,
          background: disabled 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: disabled 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
            transform: disabled ? 'none' : 'translateY(-2px)',
            boxShadow: disabled ? 'none' : '0 8px 25px rgba(255, 255, 255, 0.1)'
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          },
          transition: 'all 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.6s ease'
          },
          '&:hover::before': {
            left: '100%'
          }
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <CircularProgress size={24} sx={{ color: 'inherit' }} />
              <Typography sx={{ fontSize: '1rem' }}>
                Processing Swap...
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <SwapIcon sx={{ 
                fontSize: '1.3rem',
                transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} />
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
                {fromToken && toToken && fromAmount ? 
                  `Swap ${fromToken.symbol} to ${toToken.symbol}` : 
                  'Start Swap'
                }
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
});

// Swap Interface Component
const SwapInterface = React.memo(({ 
  tokens, 
  balances, 
  selectedFromToken, 
  selectedToToken, 
  fromAmount, 
  toAmount, 
  onFromTokenSelect, 
  onToTokenSelect, 
  onFromAmountChange, 
  onSwap, 
  onTokenSwitch, 
  loading, 
  routeInfo,
  balanceLoading,
  swapSuccess
}) => {
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [selectorType, setSelectorType] = useState('from');
  const [routeExpanded, setRouteExpanded] = useState(false);

  const handleTokenSelect = (token) => {
    if (selectorType === 'from') {
      onFromTokenSelect(token);
    } else {
      onToTokenSelect(token);
    }
    setShowTokenSelector(false);
  };

  const openTokenSelector = (type) => {
    setSelectorType(type);
    setShowTokenSelector(true);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 4,
        p: 4,
        position: 'relative',
        overflow: 'visible'
      }}>
        {/* Yeşil başarı animasyonu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: swapSuccess ? 1 : 0,
            scale: swapSuccess ? 1.02 : 0.8
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: -12,
            left: -12,
            right: -12,
            bottom: -12,
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.15) 40%, rgba(34, 197, 94, 0.05) 70%, transparent 90%)',
            borderRadius: 24,
            zIndex: -1,
            pointerEvents: 'none',
            filter: 'blur(4px)'
          }}
        />
        
        {/* İkinci katman yeşil efekt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: swapSuccess ? 0.8 : 0,
            scale: swapSuccess ? 1.01 : 0.9
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          style={{
            position: 'absolute',
            top: -6,
            left: -6,
            right: -6,
            bottom: -6,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)',
            borderRadius: 16,
            zIndex: -1,
            pointerEvents: 'none',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}
        />

        {/* Wallet Balance Display */}
        <WalletBalanceDisplay 
          balances={balances} 
          selectedToken={selectedFromToken} 
          isLoading={balanceLoading}
        />

        {/* From Token Input */}
          <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '0.9rem' }}>
            From
              </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 3,
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)'
          }}>
            <Button
              variant="outlined"
              onClick={() => openTokenSelector('from')}
              sx={{
                minWidth: 140,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                '&:hover': { 
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                  {selectedFromToken?.symbol?.[0] || 'T'}
                </Avatar>
                <Typography>{selectedFromToken?.symbol || 'Token'}</Typography>
                <KeyboardArrowDownIcon />
            </Box>
            </Button>
            <TextField
              value={fromAmount}
              onChange={(e) => onFromAmountChange(e.target.value)}
              placeholder="0.0"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#fff',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  '& input': {
                    textAlign: 'right',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.3)',
                      opacity: 1
                    }
                  }
                }
              }}
              sx={{ flex: 1 }}
            />
          </Box>
          {selectedFromToken && (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, fontSize: '0.8rem' }}>
              Balance: {(balances[selectedFromToken.symbol] || 0).toLocaleString()} {selectedFromToken.symbol}
            </Typography>
          )}
          </Box>

          {/* Swap Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <IconButton
            onClick={onTokenSwitch}
              sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
                '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transform: 'rotate(180deg)'
                },
              transition: 'all 0.3s ease'
              }}
            >
              <SwapIcon />
            </IconButton>
          </Box>

        {/* To Token Input */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '0.9rem' }}>
            To
              </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 3,
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)'
          }}>
            <Button
              variant="outlined"
              onClick={() => openTokenSelector('to')}
              sx={{
                minWidth: 140,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                  {selectedToToken?.symbol?.[0] || 'T'}
                </Avatar>
                <Typography>{selectedToToken?.symbol || 'Token'}</Typography>
                <KeyboardArrowDownIcon />
                </Box>
            </Button>
            <TextField
              value={toAmount}
              placeholder="0.0"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                readOnly: true,
                sx: {
                  color: '#fff',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  '& input': {
                    textAlign: 'right',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.3)',
                      opacity: 1
                    }
                  }
                }
              }}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>

        {/* Animated Swap Button */}
        <AnimatedSwapButton
          loading={loading}
          disabled={loading || !selectedFromToken || !selectedToToken || !fromAmount}
          onClick={onSwap}
          fromToken={selectedFromToken}
          toToken={selectedToToken}
          fromAmount={fromAmount}
        />

      <TokenSelector
          open={showTokenSelector}
          onClose={() => setShowTokenSelector(false)}
        onSelect={handleTokenSelect}
          selectedToken={selectorType === 'from' ? selectedFromToken : selectedToToken}
          tokens={tokens}
          balances={balances}
        />
      </Card>

      {/* Optimal Route Display */}
      <OptimalRoute
        routeInfo={routeInfo}
        fromToken={selectedFromToken}
        toToken={selectedToToken}
        expanded={routeExpanded}
        onToggle={() => setRouteExpanded(!routeExpanded)}
      />
    </Box>
  );
});

// Transaction History Component
const TransactionHistory = React.memo(({ transactions }) => {
  const [localTransactions, setLocalTransactions] = useState([]);

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = loadFromStorage(STORAGE_KEYS.RECENT_TRANSACTIONS, []);
    setLocalTransactions(savedTransactions);
  }, [transactions]);

  const displayTransactions = localTransactions.length > 0 ? localTransactions : transactions;

    return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h4" sx={{ 
            color: '#fff', 
            mb: 4, 
            fontWeight: 700,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <HistoryIcon />
            Recent Transactions
            {displayTransactions.length > 0 && (
              <Chip 
                label={displayTransactions.length} 
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontWeight: 600
                }}
              />
            )}
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.005)',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 4
          }}>
            <CardContent sx={{ p: 0 }}>
              {displayTransactions.length > 0 ? (
                <List>
                  {displayTransactions.map((tx, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ListItem sx={{ py: 3, px: 4, borderBottom: index < displayTransactions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            bgcolor: tx.type === 'swap' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: tx.type === 'swap' ? '#22c55e' : '#ef4444'
                          }}>
                            {tx.type === 'swap' ? <CompareArrowsIcon /> : <TrendingDownIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                            {tx.fromAmount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
        </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                            {tx.timestamp} • Fee: ${tx.fee}
                  </Typography>
                        </Box>
                        <Chip
                          label={tx.status}
                          size="small"
                          sx={{
                            bgcolor: tx.status === 'Success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: tx.status === 'Success' ? '#22c55e' : '#ef4444',
                            fontWeight: 600
                          }}
              />
            </ListItem>
                    </motion.div>
          ))}
        </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <HistoryIcon sx={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
                    No transactions yet
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem', mt: 1 }}>
                    Make your first swap to see transaction history
                  </Typography>
                </Box>
              )}
      </CardContent>
    </Card>
        </motion.div>
      </Container>
    </Box>
  );
});

// Main SwapPage Component
export default function SwapPage() {
  const [tokens, setTokens] = useState([]);
  const [balances, setBalances] = useState({});
  const [selectedFromToken, setSelectedFromToken] = useState(null);
  const [selectedToToken, setSelectedToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [swapSuccess, setSwapSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBalances = loadFromStorage(STORAGE_KEYS.WALLET_BALANCES, {});
    const savedTransactions = loadFromStorage(STORAGE_KEYS.RECENT_TRANSACTIONS, []);
    
    if (Object.keys(savedBalances).length > 0) {
      setBalances(savedBalances);
    }
    
    if (savedTransactions.length > 0) {
      setTransactions(savedTransactions);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setBalanceLoading(true);
        const tokenList = await tokenService.getTokenList();
        setTokens(tokenList);

        // Set default tokens
        const xlm = tokenList.find(t => t.symbol === 'XLM');
        const usdc = tokenList.find(t => t.symbol === 'USDC');
        if (xlm && usdc) {
          setSelectedFromToken(xlm);
          setSelectedToToken(usdc);
        }

        // Load wallet balances
        const walletStatus = await walletService.getConnectionStatusWithBalance();
        if (walletStatus.isConnected && walletStatus.balance) {
          const newBalances = {
            XLM: walletStatus.balance.xlm || 1500.5,
            USDC: 250.0,
            AQUA: 50000.0,
            yXLM: 100.0,
            SHX: 75.5
          };
          setBalances(newBalances);
          saveToStorage(STORAGE_KEYS.WALLET_BALANCES, newBalances);
        } else {
          // Mock balances if wallet not connected
          const mockBalances = {
            XLM: 1500.5,
            USDC: 250.0,
            AQUA: 50000.0,
            yXLM: 100.0,
            SHX: 75.5
          };
          setBalances(mockBalances);
          saveToStorage(STORAGE_KEYS.WALLET_BALANCES, mockBalances);
        }

        // Load default transactions if none exist
        if (transactions.length === 0) {
          const mockTransactions = [
            {
              type: 'swap',
              fromToken: 'XLM',
              toToken: 'USDC',
              fromAmount: '1,000',
              toAmount: '95.00',
              fee: '0.30',
              timestamp: '2 minutes ago',
              status: 'Success'
            },
            {
              type: 'swap',
              fromToken: 'USDC',
              toToken: 'AQUA',
              fromAmount: '50.00',
              toAmount: '15,625',
              fee: '0.15',
              timestamp: '15 minutes ago',
              status: 'Success'
            },
            {
              type: 'swap',
              fromToken: 'AQUA',
              toToken: 'XLM',
              fromAmount: '10,000',
              toAmount: '32.00',
              fee: '0.20',
              timestamp: '1 hour ago',
              status: 'Success'
            }
          ];
          setTransactions(mockTransactions);
          saveToStorage(STORAGE_KEYS.RECENT_TRANSACTIONS, mockTransactions);
        }

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setBalanceLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate route when amount changes
  useEffect(() => {
    const calculateRoute = async () => {
      if (!selectedFromToken || !selectedToToken || !fromAmount || parseFloat(fromAmount) <= 0) {
        setToAmount('');
        setRouteInfo(null);
        return;
      }

      try {
        setLoading(true);
        
        // Simulate route calculation with multi-hop
        const amount = parseFloat(fromAmount);
        const fromPrice = selectedFromToken.price || 0;
        const toPrice = selectedToToken.price || 1;
        
        const baseAmount = (amount * fromPrice) / toPrice;
        const priceImpact = Math.min(amount / 10000, 5); // Max 5% price impact
        const slippageTolerance = 0.5; // 0.5%
        const networkFee = 0.00001; // 0.00001 XLM
        const swapFee = amount * 0.003; // 0.3% swap fee
        
        const finalAmount = baseAmount * (1 - priceImpact / 100 - slippageTolerance / 100);
        const totalFeeUSD = (networkFee * (selectedFromToken.price || 0.095)) + (swapFee * (selectedFromToken.price || 0.095));
        
        // Create multi-hop route based on tokens
        let routePath = [selectedFromToken.symbol];
        
        // Add intermediate tokens for common routes
        if (selectedFromToken.symbol === 'XLM' && selectedToToken.symbol === 'AQUA') {
          routePath.push('USDC', 'AQUA');
        } else if (selectedFromToken.symbol === 'AQUA' && selectedToToken.symbol === 'XLM') {
          routePath.push('USDC', 'XLM');
        } else if (selectedFromToken.symbol !== 'USDC' && selectedToToken.symbol !== 'USDC') {
          routePath.push('USDC');
        }
        
        routePath.push(selectedToToken.symbol);
        
        // Remove duplicates
        routePath = [...new Set(routePath)];
        
        setToAmount(finalAmount.toFixed(6));
        setRouteInfo({
          networkFee: networkFee.toFixed(5),
          priceImpact: priceImpact.toFixed(2),
          slippageTolerance: slippageTolerance.toFixed(1),
          totalFee: totalFeeUSD.toFixed(4),
          path: routePath
        });

      } catch (error) {
        console.error('Error calculating route:', error);
        setToAmount('');
        setRouteInfo(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(calculateRoute, 500);
    return () => clearTimeout(debounceTimer);
  }, [selectedFromToken, selectedToToken, fromAmount]);

  const handleSwap = async () => {
    if (!selectedFromToken || !selectedToToken || !fromAmount) {
      setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate swap execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update balances
      const swapAmount = parseFloat(fromAmount);
      const receiveAmount = parseFloat(toAmount);
      
      const newBalances = {
        ...balances,
        [selectedFromToken.symbol]: (balances[selectedFromToken.symbol] || 0) - swapAmount,
        [selectedToToken.symbol]: (balances[selectedToToken.symbol] || 0) + receiveAmount
      };
      
      setBalances(newBalances);
      saveToStorage(STORAGE_KEYS.WALLET_BALANCES, newBalances);
      
      // Add new transaction
      const newTransaction = {
        type: 'swap',
        fromToken: selectedFromToken.symbol,
        toToken: selectedToToken.symbol,
        fromAmount: fromAmount,
        toAmount: toAmount,
        fee: routeInfo?.totalFee || '0.00',
        timestamp: 'Just now',
        status: 'Success'
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      saveToStorage(STORAGE_KEYS.RECENT_TRANSACTIONS, updatedTransactions);
      
      // Trigger success animations
      setSwapSuccess(true);
      setTimeout(() => setSwapSuccess(false), 3000);
      
      setSnackbar({ open: true, message: 'Swap completed successfully!', severity: 'success' });
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      setRouteInfo(null);
      
    } catch (error) {
      console.error('Swap error:', error);
      setSnackbar({ open: true, message: 'Swap failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSwitch = () => {
    setSelectedFromToken(selectedToToken);
    setSelectedToToken(selectedFromToken);
    setFromAmount('');
    setToAmount('');
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Header />
        
      <BackgroundPaths title="Swap Tokens Instantly">
        <Box sx={{ width: '100%', pt: 12 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
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
                    Swap
                  </motion.span>
                  {' '}
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    tokens
                  </motion.span>
                  {' '}
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    instantly
                  </motion.span>
              </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  mb: 6,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}>
                  Trade cryptocurrencies with optimal routing and minimal fees on the Stellar network
              </Typography>
          </motion.div>
            </motion.div>
          </Box>

            {/* Swap Interface */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Container maxWidth="md">
              <SwapInterface
                tokens={tokens}
                balances={balances}
                selectedFromToken={selectedFromToken}
                selectedToToken={selectedToToken}
                fromAmount={fromAmount}
                toAmount={toAmount}
                onFromTokenSelect={setSelectedFromToken}
                onToTokenSelect={setSelectedToToken}
                onFromAmountChange={setFromAmount}
                onSwap={handleSwap}
                onTokenSwitch={handleTokenSwitch}
                loading={loading}
                routeInfo={routeInfo}
                balanceLoading={balanceLoading}
                swapSuccess={swapSuccess}
              />
            </Container>
            </motion.div>
        </Box>
      </BackgroundPaths>

      {/* Success Icon */}
      <AnimatePresence>
        {swapSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: -100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: '20%',
              right: '5%',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(34, 197, 94, 0.9)',
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction History */}
      <TransactionHistory transactions={transactions} />

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

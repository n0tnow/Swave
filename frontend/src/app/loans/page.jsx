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
  Stack,
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
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
  AlertTitle,
  Slider
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
  BarChart as BarChartIcon,
  MonetizationOn as MoneyIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import walletService from '../lib/walletService';
import contractService from '../lib/contractService';

// Enhanced Dark Background Component
const EnhancedDarkBackground = () => {
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
      zIndex: -2
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        animation: 'float 7s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-25px) scale(1.1)' }
        }
      }} />
      <Box sx={{
        position: 'absolute',
        top: '50%',
        right: '10%',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        animation: 'float 9s ease-in-out infinite reverse',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '25%',
        left: '25%',
        width: '220px',
        height: '220px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        animation: 'float 11s ease-in-out infinite',
      }} />
    </Box>
  );
};

// Loan Statistics Component - Fixed Flexbox Design
const LoanStats = ({ stats, loading }) => {
  const statsData = [
    { 
      label: 'Total Borrowed', 
      value: `$${stats?.totalBorrowed?.toLocaleString() || '1.2M'}`, 
      icon: <MoneyIcon />,
      color: '#f43f5e',
      bgColor: 'rgba(244, 63, 94, 0.1)'
    },
    { 
      label: 'Active Loans', 
      value: stats?.activeLoans || '324', 
      icon: <LoanIcon />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    { 
      label: 'Avg Interest', 
      value: `${stats?.averageInterest || '8.5'}%`, 
      icon: <SpeedIcon />,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    { 
      label: 'Total Collateral', 
      value: `$${stats?.totalCollateral?.toLocaleString() || '2.1M'}`, 
      icon: <SecurityIcon />,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)'
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 3, 
      mb: 4,
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }}>
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          style={{ 
            flex: '1 1 calc(25% - 18px)', 
            minWidth: '200px',
            maxWidth: '100%'
          }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }
          }}>
            <CardContent sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              width: '100%'
            }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                flexShrink: 0
              }}>
                {loading ? (
                  <CircularProgress size={24} sx={{ color: stat.color }} />
                ) : (
                  stat.icon
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h5" sx={{ 
                  color: '#fff', 
                  fontWeight: 800,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {loading ? <Skeleton width="80%" /> : stat.value}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {loading ? <Skeleton width="60%" /> : stat.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

// Loan Offer Card Component - Fixed Flexbox Layout
const LoanOfferCard = ({ offer, onBorrow, index }) => {
  const [walletConnected, setWalletConnected] = useState(false);

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const status = await walletService.getConnectionStatus();
        setWalletConnected(status.connected);
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };
    checkWalletConnection();
  }, []);

  const getHealthColor = (ltv) => {
    if (ltv >= 70) return '#22c55e';
    if (ltv >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthLabel = (ltv) => {
    if (ltv >= 70) return 'Low Risk';
    if (ltv >= 50) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ 
        flex: '1 1 calc(50% - 12px)', 
        minWidth: '350px',
        maxWidth: '100%'
      }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }}>
        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Offer Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                bgcolor: offer.color, 
                width: 40, 
                height: 40,
                fontSize: '1.1rem'
              }}>
                <BankIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ 
                  color: '#fff', 
                  fontWeight: 700
                }}>
                  {offer.lender}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  {offer.term}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={getHealthLabel(offer.riskScore)}
              sx={{
                backgroundColor: `${getHealthColor(offer.riskScore)}20`,
                color: getHealthColor(offer.riskScore),
                fontWeight: 600,
                border: `1px solid ${getHealthColor(offer.riskScore)}40`
              }}
            />
          </Box>

          {/* Loan Metrics - Fixed Flexbox Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            mb: 3,
            flex: 1
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Interest Rate
              </Typography>
              <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                {offer.interestRate}%
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Max Amount
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                ${offer.maxAmount.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#4ade80', fontWeight: 600 }}>
                ${offer.available.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Min Collateral
              </Typography>
              <Typography variant="body2" sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                {offer.minCollateral}%
              </Typography>
            </Box>
          </Box>

          {/* Risk Score Progress */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Risk Score
              </Typography>
              <Typography variant="body2" sx={{ color: getHealthColor(offer.riskScore), fontWeight: 600 }}>
                {offer.riskScore}/100
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={offer.riskScore}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getHealthColor(offer.riskScore),
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* Action Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={() => onBorrow(offer)}
            disabled={!walletConnected}
            sx={{
              backgroundColor: offer.color,
              '&:hover': { 
                backgroundColor: offer.color,
                filter: 'brightness(0.9)'
              },
              '&:disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              fontWeight: 600,
              py: 1.5,
              mt: 'auto'
            }}
          >
            {!walletConnected ? 'Connect Wallet' : 'Borrow Now'}
          </Button>

          {/* Wallet Connection Notice */}
          {!walletConnected && (
            <Typography variant="caption" sx={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              textAlign: 'center',
              mt: 2
            }}>
              Connect wallet to borrow
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Active Loan Card Component - Fixed Flexbox Layout
const ActiveLoanCard = ({ loan, onManage, index }) => {
  const [walletConnected, setWalletConnected] = useState(false);

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const status = await walletService.getConnectionStatus();
        setWalletConnected(status.connected);
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };
    checkWalletConnection();
  }, []);

  const getHealthColor = (health) => {
    if (health >= 70) return '#22c55e';
    if (health >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthIcon = (health) => {
    if (health >= 70) return <CheckCircleIcon />;
    if (health >= 50) return <WarningIcon />;
    return <ErrorIcon />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ 
        flex: '1 1 calc(50% - 12px)', 
        minWidth: '350px',
        maxWidth: '100%'
      }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }}>
        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Loan Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                bgcolor: '#f43f5e', 
                width: 40, 
                height: 40
              }}>
                <LoanIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ 
                  color: '#fff', 
                  fontWeight: 700
                }}>
                  Loan #{loan.id}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Due: {loan.dueDate}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getHealthIcon(loan.health)}
              <Typography variant="body2" sx={{ 
                color: getHealthColor(loan.health),
                fontWeight: 600
              }}>
                {loan.health}%
              </Typography>
            </Box>
          </Box>

          {/* Loan Metrics - Fixed Flexbox Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            mb: 3,
            flex: 1
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Borrowed Amount
              </Typography>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                ${loan.amount.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Interest Rate
              </Typography>
              <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                {loan.interestRate}%
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Collateral
              </Typography>
              <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                ${loan.collateral.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Health Score Progress */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Loan Health
              </Typography>
              <Typography variant="body2" sx={{ color: getHealthColor(loan.health), fontWeight: 600 }}>
                {loan.health}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={loan.health}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getHealthColor(loan.health),
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* Action Buttons - Fixed Flexbox Layout */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            mt: 'auto'
          }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => onManage(loan, 'repay')}
              disabled={!walletConnected}
              sx={{
                backgroundColor: '#22c55e',
                '&:hover': { backgroundColor: '#16a34a' },
                '&:disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                fontWeight: 600,
                py: 1.5,
                flex: 1
              }}
            >
              Repay
            </Button>
            <Button
              variant="outlined"
              onClick={() => onManage(loan, 'addCollateral')}
              disabled={!walletConnected}
              sx={{
                borderColor: '#8b5cf6',
                color: '#8b5cf6',
                '&:hover': {
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)'
                },
                '&:disabled': { 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                fontWeight: 600,
                py: 1.5,
                minWidth: '120px'
              }}
            >
              Add Collateral
            </Button>
          </Box>

          {/* Wallet Connection Notice */}
          {!walletConnected && (
            <Typography variant="caption" sx={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              textAlign: 'center',
              mt: 2
            }}>
              Connect wallet to manage loan
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Loans Page Component
export default function LoansPage() {
  const [loading, setLoading] = useState(true);
  const [loanStats, setLoanStats] = useState({});
  const [loanOffers, setLoanOffers] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [manageAction, setManageAction] = useState('repay');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  // Load data on mount
  useEffect(() => {
    loadLoanData();
  }, []);

  const loadLoanData = async () => {
    setLoading(true);
    try {
      // Check wallet status
      const walletStatus = await walletService.getConnectionStatus();
      setWalletConnected(walletStatus.connected);
      setWalletAddress(walletStatus.address || null);
      
      const [loanOffersData, userLoansData, globalStatsData] = await Promise.all([
        contractService.getLoanOffers(),
        walletStatus.connected ? contractService.getUserLoans(walletStatus.address) : Promise.resolve([]),
        contractService.getLoanGlobalStats()
      ]);
      
      setLoanOffers(loanOffersData || []);
      setActiveLoans(userLoansData || []);
      
      // Calculate loan stats from real data
      const totalBorrowed = userLoansData.reduce((sum, loan) => sum + loan.amount, 0);
      const totalCollateral = userLoansData.reduce((sum, loan) => sum + loan.collateralAmount, 0);
      const averageInterest = userLoansData.length > 0 
        ? userLoansData.reduce((sum, loan) => sum + loan.interestRate, 0) / userLoansData.length 
        : 0;
      
      setLoanStats({
        totalBorrowed: globalStatsData?.totalVolume || totalBorrowed || 1200000,
        activeLoans: globalStatsData?.activeLoans || userLoansData.length || 324,
        averageInterest: globalStatsData?.averageAPR || averageInterest || 8.5,
        totalCollateral: globalStatsData?.totalCollateral || totalCollateral || 2100000
      });
      
    } catch (error) {
      console.error('Failed to load loan data:', error);
      
      // Set fallback data
      setLoanStats({
        totalBorrowed: 1200000,
        activeLoans: 324,
        averageInterest: 8.5,
        totalCollateral: 2100000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = (offer) => {
    setSelectedLoan(offer);
    setBorrowDialogOpen(true);
  };

  const handleExecuteBorrow = async () => {
    if (!walletConnected || !walletAddress) {
      console.error('Wallet not connected');
      return;
    }

    if (!selectedLoan || !loanAmount || !collateralAmount) {
      console.error('Missing loan data');
      return;
    }

    try {
      const loanData = {
        amount: parseFloat(loanAmount),
        collateralAmount: parseFloat(collateralAmount),
        interestRate: selectedLoan.interestRate,
        term: selectedLoan.term
      };

      const result = await contractService.executeLoanOperation(
        walletAddress,
        'borrow',
        loanData
      );

      if (result.success) {
        console.log('Loan operation successful:', result);
        
        // Close dialog
        setBorrowDialogOpen(false);
        
        // Refresh data
        await loadLoanData();
        
        // Reset form
        setLoanAmount('');
        setCollateralAmount('');
        
        console.log('Loan operation completed successfully');
      } else {
        console.error('Loan operation failed:', result);
      }
    } catch (error) {
      console.error('Error executing loan operation:', error);
    }
  };

  const handleManage = (loan, action) => {
    setSelectedLoan(loan);
    setManageAction(action);
    setManageDialogOpen(true);
  };

  const handleExecuteManage = async () => {
    if (!walletConnected || !walletAddress) {
      console.error('Wallet not connected');
      return;
    }

    if (!selectedLoan || !repayAmount) {
      console.error('Missing repay data');
      return;
    }

    try {
      const repayData = {
        amount: parseFloat(repayAmount),
        loanId: selectedLoan.id
      };

      const result = await contractService.executeLoanOperation(
        walletAddress,
        'repay',
        repayData
      );

      if (result.success) {
        console.log('Loan repay successful:', result);
        
        // Close dialog
        setManageDialogOpen(false);
        
        // Refresh data
        await loadLoanData();
        
        // Reset form
        setRepayAmount('');
        
        console.log('Loan repay completed successfully');
      } else {
        console.error('Loan repay failed:', result);
      }
    } catch (error) {
      console.error('Error executing loan repay:', error);
    }
  };

  // Enhanced Borrow Dialog - Fixed Design
  const BorrowDialog = () => (
    <Dialog
      open={borrowDialogOpen}
      onClose={() => setBorrowDialogOpen(false)}
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
        color: '#f43f5e', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1.25rem',
        fontWeight: 700
      }}>
        Borrow from {selectedLoan?.lender}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Enter the amount you want to borrow and provide collateral
          </Typography>
          
          {/* Loan Amount Input */}
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Loan Amount (USD)
            </Typography>
            <TextField
              fullWidth
              placeholder="0.00"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#f43f5e' }
                }
              }}
            />
          </Box>

          {/* Collateral Amount Input */}
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Collateral Amount (USD)
            </Typography>
            <TextField
              fullWidth
              placeholder="0.00"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#f43f5e' }
                }
              }}
            />
          </Box>

          {/* Loan Terms */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                Loan Terms
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Interest Rate
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                    {selectedLoan?.interestRate}% APR
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Term Length
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {selectedLoan?.term}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Min Collateral
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {selectedLoan?.minCollateral}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, display: 'flex', gap: 2 }}>
        <Button
          onClick={() => setBorrowDialogOpen(false)}
          sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleExecuteBorrow}
          disabled={!walletConnected || !loanAmount || !collateralAmount}
          sx={{
            backgroundColor: '#f43f5e',
            '&:hover': { backgroundColor: '#e11d48' },
            flex: 1
          }}
        >
          Confirm Borrow
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Enhanced Manage Dialog - Fixed Design
  const ManageDialog = () => (
    <Dialog
      open={manageDialogOpen}
      onClose={() => setManageDialogOpen(false)}
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
        color: '#f43f5e', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1.25rem',
        fontWeight: 700
      }}>
        Manage Loan #{selectedLoan?.id}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {manageAction === 'repay' ? 'Enter the amount you want to repay' : 'Enter the amount you want to add as collateral'}
          </Typography>
          
          {/* Repay Amount Input */}
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Repay Amount (USD)
            </Typography>
            <TextField
              fullWidth
              placeholder="0.00"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#f43f5e' }
                }
              }}
            />
          </Box>

          {/* Loan Details */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                Loan Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Borrowed Amount
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                    ${selectedLoan?.amount.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Interest Rate
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                    {selectedLoan?.interestRate}% APR
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Collateral
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                    ${selectedLoan?.collateral.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Due Date
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                    {selectedLoan?.dueDate}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, display: 'flex', gap: 2 }}>
        <Button
          onClick={() => setManageDialogOpen(false)}
          sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleExecuteManage}
          disabled={!walletConnected || !repayAmount}
          sx={{
            backgroundColor: '#22c55e',
            '&:hover': { backgroundColor: '#16a34a' },
            flex: 1
          }}
        >
          Confirm {manageAction}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <EnhancedDarkBackground />
      
      <Box sx={{ 
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        <Header />
        
        <Container maxWidth="xl" sx={{ 
          pt: { xs: 12, sm: 14 }, 
          pb: 8,
          px: { xs: 2, sm: 3 }
        }}>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h2" sx={{ 
                color: '#fff', 
                fontWeight: 800, 
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
              }}>
                Lending & Borrowing
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                Secure loans with competitive rates or lend to earn passive income
              </Typography>
            </Box>
          </motion.div>

          {/* Loan Statistics */}
          <LoanStats stats={loanStats} loading={loading} />

          {/* Tab Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2, 
              p: 1,
              flexWrap: 'wrap'
            }}>
              <Button
                variant={selectedTab === 0 ? 'contained' : 'text'}
                onClick={() => setSelectedTab(0)}
                sx={{
                  backgroundColor: selectedTab === 0 ? '#f43f5e' : 'transparent',
                  color: selectedTab === 0 ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: selectedTab === 0 ? '#e11d48' : 'rgba(255, 255, 255, 0.1)'
                  },
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  minWidth: 140
                }}
              >
                Available Loans
              </Button>
              <Button
                variant={selectedTab === 1 ? 'contained' : 'text'}
                onClick={() => setSelectedTab(1)}
                sx={{
                  backgroundColor: selectedTab === 1 ? '#f43f5e' : 'transparent',
                  color: selectedTab === 1 ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: selectedTab === 1 ? '#e11d48' : 'rgba(255, 255, 255, 0.1)'
                  },
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  minWidth: 140
                }}
              >
                My Loans
              </Button>
            </Box>
          </Box>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {selectedTab === 0 ? (
              <motion.div
                key="borrow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3,
                  mb: 4,
                  justifyContent: 'space-between'
                }}>
                  {loanOffers.map((offer, index) => (
                    <LoanOfferCard 
                      key={offer.id}
                      offer={offer} 
                      index={index}
                      onBorrow={handleBorrow}
                    />
                  ))}
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3,
                  mb: 4,
                  justifyContent: 'space-between'
                }}>
                  {activeLoans.map((loan, index) => (
                    <ActiveLoanCard 
                      key={loan.id}
                      loan={loan} 
                      index={index}
                      onManage={handleManage}
                    />
                  ))}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>

      <BorrowDialog />
      <ManageDialog />
    </>
  );
} 
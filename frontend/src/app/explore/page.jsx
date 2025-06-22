'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Gavel as GavelIcon,
  Shield as ShieldIcon,
  MonetizationOn as MoneyIcon,
  Insights as InsightsIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import Header from '../components/Header';

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
          radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.25) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.2) 0%, transparent 60%),
          linear-gradient(135deg, #0a0a23 0%, #1a1a3e 50%, #2a2a5e 100%)
        `,
      }}
    />
  );
};

// Lamp Container Component
const LampContainer = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0f172a',
        width: '100%',
        zIndex: 0,
      }}
    >
      <Box sx={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        flex: 1,
        transform: 'scaleY(1.25)',
        alignItems: 'center',
        justifyContent: 'center',
        isolation: 'isolate',
        zIndex: 0,
      }}>
        <motion.div
          initial={{ opacity: 0.5, width: 240 }}
          whileInView={{ opacity: 1, width: 480 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            right: '50%',
            height: 224,
            width: 480,
             background: `conic-gradient(from 70deg at center top, #a5b4fc, transparent, transparent)`,
            color: 'white',
            overflow: 'visible'
          }}
        >
          <Box sx={{
            position: 'absolute',
            width: '100%',
            left: 0,
            background: '#0f172a',
            height: 160,
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to top, white, transparent)'
          }} />
          <Box sx={{
            position: 'absolute',
            width: 160,
            height: '100%',
            left: 0,
            background: '#0f172a',
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to right, white, transparent)'
          }} />
    </motion.div>
    <motion.div
          initial={{ opacity: 0.5, width: 240 }}
          whileInView={{ opacity: 1, width: 480 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            left: '50%',
            height: 224,
            width: 480,
             background: `conic-gradient(from 290deg at center top, transparent, transparent, #a5b4fc)`,
            color: 'white'
          }}
        >
          <Box sx={{
            position: 'absolute',
            width: 160,
        height: '100%',
            right: 0,
            background: '#0f172a',
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to left, white, transparent)'
          }} />
          <Box sx={{
            position: 'absolute',
            width: '100%',
            right: 0,
            background: '#0f172a',
            height: 160,
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to top, white, transparent)'
          }} />
        </motion.div>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          height: 192,
          width: '100%',
          transform: 'translateY(48px) scaleX(1.5)',
          background: '#0f172a',
          filter: 'blur(32px)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          zIndex: 50,
          height: 192,
          width: '100%',
          background: 'transparent',
          opacity: 0.1,
          backdropFilter: 'blur(8px)'
        }} />
        <Box sx={{
          position: 'absolute',
          zIndex: 50,
          height: 144,
          width: 448,
          transform: 'translateY(-50%)',
          borderRadius: '50%',
                     background: '#a5b4fc',
          opacity: 0.5,
          filter: 'blur(48px)'
        }} />
        <motion.div
          initial={{ width: 128 }}
          whileInView={{ width: 256 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            zIndex: 30,
            height: 144,
            width: 256,
            transform: 'translateY(-96px)',
            borderRadius: '50%',
                         background: '#a5b4fc',
            filter: 'blur(32px)'
          }}
        />
        <motion.div
          initial={{ width: 240 }}
          whileInView={{ width: 480 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            zIndex: 50,
            height: 2,
            width: 480,
            transform: 'translateY(-112px)',
                         background: '#a5b4fc'
          }}
        />

      </Box>

      <Box sx={{
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        transform: 'translateY(-220px)',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2.5
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default function ExplorePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Scroll to feature function
  const scrollToFeature = (featureName) => {
    const element = document.getElementById(`feature-${featureName.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const features = [
    {
      title: 'Advanced Swap System',
      description: 'Multi-step token swaps with optimized routing, slippage protection, and minimal fees across Stellar network.',
      icon: <SwapIcon sx={{ fontSize: 32 }} />,
      color: '#a5b4fc',
      status: 'Live'
    },
    {
      title: 'Liquidity Pools & Yield Farming',
      description: 'Provide liquidity to earn rewards with dynamic APY calculations, impermanent loss protection, and automated distributions.',
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      color: '#4caf50',
      status: 'Live'
    },
    {
      title: 'DeFi Lending Protocol',
      description: 'Borrow against your assets with credit score integration, automated approvals, and competitive interest rates.',
      icon: <MoneyIcon sx={{ fontSize: 32 }} />,
      color: '#ff9800',
      status: 'Live'
    },
    {
      title: 'Multi-Asset Collateral',
      description: 'Use multiple Stellar assets as collateral with automated liquidation protection and real-time risk monitoring.',
      icon: <ShieldIcon sx={{ fontSize: 32 }} />,
      color: '#e91e63',
      status: 'Live'
    },
    {
      title: 'Credit Score System',
      description: 'On-chain credit scoring based on Stellar network activity, wallet age, transaction history, and DeFi behavior.',
      icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
      color: '#9c27b0',
      status: 'Live'
    },
    {
      title: 'Price Oracle Network',
      description: 'Manipulation-resistant price feeds with TWAP calculations, multiple data sources, and circuit breaker protection.',
      icon: <InsightsIcon sx={{ fontSize: 32 }} />,
      color: '#00bcd4',
      status: 'Live'
    },
    {
      title: 'Multi-Signature Governance',
      description: 'Secure protocol governance with threshold signatures, time-locked transactions, and emergency controls.',
      icon: <GavelIcon sx={{ fontSize: 32 }} />,
      color: '#795548',
      status: 'Live'
    },
    {
      title: 'Fee Management',
      description: 'Dynamic fee optimization across all protocol functions with automated revenue sharing and burn mechanisms.',
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      color: '#607d8b',
      status: 'Live'
    },
    {
      title: 'Advanced Analytics',
      description: 'Real-time protocol metrics, user analytics, yield tracking, and comprehensive portfolio management tools.',
      icon: <TimelineIcon sx={{ fontSize: 32 }} />,
      color: '#3f51b5',
      status: 'Beta'
    }
  ];

  return (
    <>
      <EnhancedDarkBackground />
      <Header transparent={true} />
      
      {/* Hero Section with Lamp Effect */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ pt: 8, display: 'flex', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.95)' }}>
          <LampContainer>
            <motion.div
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
            >
          <Typography 
                variant="h1"
            sx={{
                  mt: 2,
                  color: 'white',
                  textAlign: 'center',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  py: 2,
                  textShadow: '0 0 30px rgba(165, 180, 252, 0.8), 0 0 15px rgba(255, 255, 255, 0.3)',
                  filter: 'drop-shadow(0 0 8px rgba(165, 180, 252, 0.4))'
                }}
              >
                Explore Swave DeFi Features
          </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: "easeInOut",
              }}
            >
              <Box sx={{ 
                mt: 4, 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)' 
                },
                justifyContent: 'center', 
                gap: 2,
                maxWidth: '1000px',
                mx: 'auto'
              }}>
                {[
                  'Advanced Swap System',
                  'Liquidity Pools & Yield Farming', 
                  'DeFi Lending Protocol',
                  'Multi-Asset Collateral',
                  'Credit Score System',
                  'Price Oracle Network',
                  'Multi-Signature Governance',
                  'Fee Management',
                  'Advanced Analytics'
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.1 * index,
                      duration: 0.5 
                    }}
                  >
                                        <Chip
                      label={feature}
                      onClick={() => scrollToFeature(feature)}
                      sx={{
                        bgcolor: 'rgba(165, 180, 252, 0.1)',
                        color: '#a5b4fc',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        py: 1,
                        px: 2,
                        height: '40px',
                        width: '100%',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(165, 180, 252, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(165, 180, 252, 0.2)'
                        }
                      }}
                    />
                  </motion.div>
                ))}
            </Box>
            </motion.div>
            
          </LampContainer>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)', 
        py: { xs: 4, md: 6 },
        position: 'relative',
        zIndex: 1,
        mt: -10
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              color="white"
              textAlign="center"
              sx={{ 
                mb: 6,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Features
            </Typography>
          </motion.div>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <motion.div
                  id={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{ height: '100%' }}
                >
                  <Card sx={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(165, 180, 252, 0.2)',
                    borderRadius: 3,
                    height: '280px',
                    width: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      border: `1px solid ${feature.color}40`,
                      boxShadow: `0 8px 32px ${feature.color}20`,
                      transform: 'translateY(-4px)'
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}>
                      <Box>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8 }}
                        >
                          <Avatar sx={{ 
                            bgcolor: feature.color + '20', 
                            color: feature.color, 
                            width: 56, 
                            height: 56, 
                            mx: 'auto', 
                            mb: 2 
                          }}>
                            {feature.icon}
                          </Avatar>
                        </motion.div>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          color="white" 
                          sx={{ 
                            mb: 2,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            lineHeight: 1.3,
                            minHeight: '2.6em'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="rgba(255,255,255,0.7)" 
                          sx={{ 
                            mb: 2,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '4.2em'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                      <Chip 
                        label={feature.status}
                        size="small"
                        sx={{ 
                          bgcolor: feature.color + '20', 
                          color: feature.color,
                          fontWeight: 600,
                          alignSelf: 'center'
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

                    {/* Protocol Stats */}
          <Box sx={{ py: { xs: 4, md: 6 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h4" 
                fontWeight={700} 
                color="white" 
                textAlign="center" 
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' }
                }}
              >
                Protocol Statistics
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 3,
                maxWidth: '1000px',
                mx: 'auto'
              }}
            >
              {[
                { value: '9', label: 'Smart Contracts', color: '#a5b4fc', icon: '🔗' },
                { value: '100%', label: 'Security Audited', color: '#4caf50', icon: '🛡️' },
                { value: '24/7', label: 'Automated Operations', color: '#ff9800', icon: '⚡' },
                { value: '<5s', label: 'Transaction Speed', color: '#e91e63', icon: '🚀' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card
                    sx={{
                      height: 180,
                      minHeight: 180,
                      maxHeight: 180,
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
                      justifyContent: 'center',
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
                      <Typography 
                        sx={{ 
                          fontSize: '2rem', 
                          mb: 1.5,
                          filter: `drop-shadow(0 0 8px ${stat.color}40)`
                        }}
                      >
                        {stat.icon}
                      </Typography>
                      
                      <Typography 
                        variant="h5" 
                        fontWeight={700} 
                        color="white"
                        sx={{ 
                          fontSize: { xs: '1.5rem', sm: '1.8rem' }, 
                          mb: 1,
                          textShadow: `0 0 10px ${stat.color}30`
                        }}
                      >
                        {stat.value}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="rgba(255,255,255,0.8)"
                        sx={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 500,
                          lineHeight: 1.3
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
      </Container>
      </Box>
    </>
  );
} 
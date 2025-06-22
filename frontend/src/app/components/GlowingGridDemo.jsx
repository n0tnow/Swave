'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { 
  SwapHoriz as SwapIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as OracleIcon
} from '@mui/icons-material';

const GlowingGridDemo = () => {
  const gridItems = [
    {
      icon: <SwapIcon sx={{ fontSize: 24 }} />,
      title: 'Advanced Swap Engine',
      description: 'Multi-step routing with slippage protection and automatic fee calculation',
    },
    {
      icon: <OracleIcon sx={{ fontSize: 24 }} />,
      title: 'Enterprise Oracle',
      description: 'Multi-source price feeds with manipulation protection and TWAP calculation',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 24 }} />,
      title: 'Multi-signature Security',
      description: 'Battle-tested smart contracts with multi-sig governance and emergency controls',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 24 }} />,
      title: 'Liquidity Management',
      description: 'Dynamic pool management with automated rebalancing and yield optimization',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 24 }} />,
      title: 'Credit Scoring',
      description: 'On-chain credit assessment with collateral management and risk analytics',
    }
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)'
          },
          gap: 3,
          maxWidth: '1000px',
          mx: 'auto',
          // Special layout for 5 items: 2-2-1 centered
          '& > :nth-of-type(5)': {
            gridColumn: { sm: 'span 2', lg: 'span 2' },
            maxWidth: { sm: '400px', lg: '400px' },
            mx: 'auto'
          }
        }}
      >
        {gridItems.map((item, index) => (
          <GridItem 
            key={index}
            item={item}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

const GridItem = ({ item, index }) => {
  return (
    <Box
      sx={{
        height: 280, // Fixed height for all cards
        minHeight: 280,
        maxHeight: 280,
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        height: '100%',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
        p: 2
      }}>
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(20px)',
            p: 3,
            boxShadow: '0px 0px 27px 0px rgba(45,45,45,0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid rgba(102,126,234,0.3)',
              boxShadow: '0px 0px 40px 0px rgba(102,126,234,0.2)',
              transform: 'translateY(-4px)'
            }
          }}
        >
          {/* Icon Container */}
          <Box sx={{ width: 'fit-content' }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.1)',
                bgcolor: 'rgba(102,126,234,0.1)',
                color: '#667eea',
                p: 1.5
              }}
            >
              {item.icon}
            </Avatar>
          </Box>

          {/* Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.25rem',
                lineHeight: 1.3,
                fontWeight: 600,
                color: 'white',
                minHeight: '2.6rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {item.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.7)',
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GlowingGridDemo; 
'use client';

import React from 'react';
import { Button, Box } from '@mui/material';
import { keyframes } from '@mui/system';

// Star movement animations
const starMovementBottom = keyframes`
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(-100%, 0%);
    opacity: 0;
  }
`;

const starMovementTop = keyframes`
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(100%, 0%);
    opacity: 0;
  }
`;

const StarBorderButton = ({ 
  children, 
  onClick, 
  color = '#667eea', 
  speed = '6s',
  variant = 'contained',
  size = 'large',
  startIcon,
  endIcon,
  disabled = false,
  sx = {},
  ...props 
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        borderRadius: '12px',
        overflow: 'hidden',
        ...sx
      }}
      {...props}
    >
      {/* Bottom star effect */}
      <Box
        sx={{
          position: 'absolute',
          width: '300%',
          height: '50%',
          bottom: '-11px',
          right: '-250%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          opacity: 0.4,
          animation: `${starMovementBottom} ${speed} linear infinite alternate`,
          zIndex: 0,
        }}
      />
      
      {/* Top star effect */}
      <Box
        sx={{
          position: 'absolute',
          width: '300%',
          height: '50%',
          top: '-10px',
          left: '-250%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          opacity: 0.4,
          animation: `${starMovementTop} ${speed} linear infinite alternate`,
          zIndex: 0,
        }}
      />
      
      {/* Button content */}
      <Button
        variant={variant}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
        disabled={disabled}
        onClick={onClick}
        sx={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '12px',
          background: variant === 'contained' 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.9) 100%)'
            : 'transparent',
          backdropFilter: 'blur(20px)',
          border: 'none',
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          py: 1.2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            background: variant === 'contained'
              ? 'linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(30,30,30,0.95) 100%)'
              : `${color}10`,
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 20px ${color}30`,
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
          },
          '& .MuiButton-startIcon': {
            marginRight: 1,
            marginLeft: 0
          }
        }}
      >
        {children}
      </Button>
    </Box>
  );
};

export default StarBorderButton; 
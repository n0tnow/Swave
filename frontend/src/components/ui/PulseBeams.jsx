'use client';

import React from 'react';
import { Box, keyframes } from '@mui/material';

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
`;

const beamAnimation = keyframes`
  0% {
    opacity: 0;
    transform: rotate(0deg) scale(0.8);
  }
  
  50% {
    opacity: 1;
    transform: rotate(180deg) scale(1.2);
  }
  
  100% {
    opacity: 0;
    transform: rotate(360deg) scale(0.8);
  }
`;

export const PulseBeams = ({ 
  size = 80, 
  color = '#667eea', 
  pulseSpeed = 2, 
  beamSpeed = 4,
  beamCount = 4 
}) => {
  const beams = Array.from({ length: beamCount }, (_, i) => i);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        animation: `${pulseAnimation} ${pulseSpeed}s infinite`,
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          borderRadius: '50%',
          border: `2px solid ${color}40`,
          animation: `${pulseAnimation} ${pulseSpeed * 1.5}s infinite reverse`,
        }
      }}
    >
      {beams.map((beam, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2px',
            height: size * 0.6,
            background: `linear-gradient(to top, transparent, ${color}, transparent)`,
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${index * (360 / beamCount)}deg)`,
            animation: `${beamAnimation} ${beamSpeed}s infinite`,
            animationDelay: `${index * (beamSpeed / beamCount)}s`,
            opacity: 0.6,
          }}
        />
      ))}
      
      {/* Central glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}80 0%, ${color}40 50%, transparent 100%)`,
          animation: `${pulseAnimation} ${pulseSpeed * 0.8}s infinite alternate`,
        }}
      />
    </Box>
  );
};

export default PulseBeams; 
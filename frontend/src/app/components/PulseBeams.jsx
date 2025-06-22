'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const PulseBeams = ({
  children,
  beams,
  width = 858,
  height = 434,
  baseColor = 'rgba(255,255,255,0.1)',
  accentColor = 'rgba(255,255,255,0.3)',
  gradientColors = {
    start: '#667eea',
    middle: '#764ba2', 
    end: '#f093fb'
  },
  className,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: '#000000',
        ...sx
      }}
      className={className}
      {...props}
    >
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        {children}
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SVGBeams
          beams={beams}
          width={width}
          height={height}
          baseColor={baseColor}
          accentColor={accentColor}
          gradientColors={gradientColors}
        />
      </Box>
    </Box>
  );
};

const SVGBeams = ({ beams, width, height, baseColor, accentColor, gradientColors }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        display: 'flex', 
        flexShrink: 0,
        opacity: 0.8
      }}
    >
      {beams.map((beam, index) => (
        <React.Fragment key={index}>
          <path
            d={beam.path}
            stroke={baseColor}
            strokeWidth="1"
          />
          <path
            d={beam.path}
            stroke={`url(#grad${index})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {beam.connectionPoints?.map((point, pointIndex) => (
            <circle
              key={`${index}-${pointIndex}`}
              cx={point.cx}
              cy={point.cy}
              r={point.r}
              fill={baseColor}
              stroke={accentColor}
              strokeWidth="1"
            />
          ))}
        </React.Fragment>
      ))}

      <defs>
        {beams.map((beam, index) => (
          <motion.linearGradient
            key={index}
            id={`grad${index}`}
            gradientUnits="userSpaceOnUse"
            initial={beam.gradientConfig.initial}
            animate={beam.gradientConfig.animate}
            transition={beam.gradientConfig.transition}
          >
            <stop offset="0%" stopColor={gradientColors.start} stopOpacity="0" />
            <stop offset="20%" stopColor={gradientColors.start} stopOpacity="1" />
            <stop offset="50%" stopColor={gradientColors.middle} stopOpacity="1" />
            <stop offset="100%" stopColor={gradientColors.end} stopOpacity="0" />
          </motion.linearGradient>
        ))}
      </defs>
    </svg>
  );
};

export default PulseBeams; 
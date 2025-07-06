'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingPaths = ({ position }) => {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255, 255, 255, ${0.05 + i * 0.01})`,
    width: 0.3 + i * 0.02,
  }));

  return (
    <Box sx={{ 
      position: 'absolute', 
      inset: 0, 
      pointerEvents: 'none',
      overflow: 'hidden' 
    }}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          color: '#ffffff'
        }}
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.05 + path.id * 0.015}
            fill="none"
            initial={{ pathLength: 0.2, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.6, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </Box>
  );
};

export const BackgroundPaths = ({ title = "Background Paths", children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: '#000000'
      }}>
        {children}
      </Box>
    );
  }

  const words = title.split(" ");

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'hidden',
      background: `
        radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(240, 147, 251, 0.06) 0%, transparent 50%),
        #000000
      `
    }}>
      {/* Fixed position background for full page coverage */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </Box>

      <Box sx={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, md: 3 },
        textAlign: 'center'
      }}>
        {children || (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
                fontWeight: 800,
                mb: 4,
                letterSpacing: '-0.02em'
              }}
            >
              {words.map((word, wordIndex) => (
                <Box
                  key={wordIndex}
                  component="span"
                  sx={{ display: 'inline-block', mr: 2 }}
                >
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </Box>
              ))}
            </Typography>

            <Box sx={{
              display: 'inline-block',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              p: 0.2,
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(255, 255, 255, 0.1)'
              },
              transition: 'all 0.3s ease'
            }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 3.5,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.9)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box component="span" sx={{ opacity: 0.9, mr: 1 }}>
                  Discover Excellence
                </Box>
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.3 }}
                  style={{ opacity: 0.7 }}
                >
                  →
                </motion.span>
              </Button>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default BackgroundPaths; 
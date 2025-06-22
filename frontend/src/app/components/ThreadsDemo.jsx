'use client';

import { Box } from '@mui/material';
import { Threads } from './Threads';

export const ThreadsDemo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '800px',
          height: '600px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 25px 25px -12px rgba(0,0,0,0.25)',
          background: 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Threads
          sx={{ width: '100%', height: '100%' }}
          amplitude={0.7}
          distance={0.05}
          enableMouseInteraction={true}
          color={[1.0, 1.0, 1.0]}
        />
      </Box>
    </Box>
  );
}; 
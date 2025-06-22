'use client';

import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Alert
} from '@mui/material';
import { 
  Extension as ExtensionIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const FreighterInstallGuide = ({ open, onClose, onRetry }) => {
  const steps = [
    'Install Freighter Extension',
    'Create or Import Wallet',
    'Connect to SWAVE'
  ];

  const handleInstall = () => {
    window.open('https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk', '_blank');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: 3,
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
        pb: 2
      }}>
        <ExtensionIcon sx={{ color: '#667eea' }} />
        <Typography variant="h6" fontWeight={600}>
          Install Freighter Wallet
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            bgcolor: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            color: 'white',
            '& .MuiAlert-icon': { color: '#667eea' }
          }}
        >
          Freighter is the official Stellar wallet extension. It's secure, free, and easy to use.
        </Alert>

        <Stepper 
          activeStep={0} 
          orientation="vertical"
          sx={{
            '& .MuiStepIcon-root': {
              color: 'rgba(102, 126, 234, 0.3)',
              '&.Mui-active': { color: '#667eea' },
              '&.Mui-completed': { color: '#4caf50' }
            },
            '& .MuiStepLabel-label': { color: 'white' },
            '& .MuiStepConnector-line': { borderColor: 'rgba(102, 126, 234, 0.2)' }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant="body1" fontWeight={500}>
                  {label}
                </Typography>
                {index === 0 && (
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 1 }}>
                    Click the button below to install from Chrome Web Store
                  </Typography>
                )}
                {index === 1 && (
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 1 }}>
                    Follow the setup wizard to create your wallet
                  </Typography>
                )}
                {index === 2 && (
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 1 }}>
                    Return here and click "Connect Wallet" again
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            💡 <strong>Tip:</strong> After installation, you might need to refresh this page for the wallet to be detected.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ gap: 2, p: 3 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={onRetry}
          startIcon={<RefreshIcon />}
          sx={{
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            '&:hover': { 
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.5)'
            }
          }}
        >
          Check Again
        </Button>
        
        <Button
          onClick={handleInstall}
          variant="contained"
          startIcon={<ExtensionIcon />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            }
          }}
        >
          Install Freighter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FreighterInstallGuide; 
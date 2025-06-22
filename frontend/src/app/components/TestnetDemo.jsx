'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import stellarTestnetService from '../lib/stellarTestnetService';

const TestnetDemo = () => {
  const [loading, setLoading] = useState(false);
  const [testAccount, setTestAccount] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [orderBookData, setOrderBookData] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [stats24h, setStats24h] = useState(null);
  const [error, setError] = useState(null);

  // Test account (Stellar testnet)
  const DEMO_ACCOUNT = 'GCKFBEIYTKP5RQHDHKPBZGD7CKBGD6KQFQXZB5LNHVJ5JKZJQZQZQZQZ';

  const loadTestnetData = async (accountId = DEMO_ACCOUNT) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Testing real Stellar testnet integration...');

      // Test 1: Load account balance
      try {
        const balances = await stellarTestnetService.getAccountBalance(accountId);
        setAccountData({ publicKey: accountId, balances });
        console.log('✅ Account balances loaded:', balances);
      } catch (err) {
        console.log('⚠️ Account not found or no balance, using demo data');
        setAccountData({ 
          publicKey: accountId, 
          balances: { XLM: 1000.0, USDC: 500.0 },
          demo: true 
        });
      }

      // Test 2: Load order book
      try {
        const orderBook = await stellarTestnetService.getOrderBook(
          stellarTestnetService.assets.XLM,
          stellarTestnetService.assets.USDC
        );
        setOrderBookData(orderBook);
        console.log('✅ Order book loaded:', orderBook);
      } catch (err) {
        console.log('⚠️ Order book not available, using demo data');
        setOrderBookData({
          bids: [
            { price: 0.1234, amount: 1000 },
            { price: 0.1233, amount: 2000 },
            { price: 0.1232, amount: 1500 }
          ],
          asks: [
            { price: 0.1236, amount: 800 },
            { price: 0.1237, amount: 1200 },
            { price: 0.1238, amount: 900 }
          ],
          demo: true
        });
      }

      // Test 3: Load trade history
      try {
        const trades = await stellarTestnetService.getTradeHistory(
          stellarTestnetService.assets.XLM,
          stellarTestnetService.assets.USDC,
          5
        );
        setTradeHistory(trades);
        console.log('✅ Trade history loaded:', trades);
      } catch (err) {
        console.log('⚠️ Trade history not available, using demo data');
        setTradeHistory([
          { id: '1', price: 0.1235, baseAmount: 100, timestamp: Date.now() - 3600000 },
          { id: '2', price: 0.1234, baseAmount: 250, timestamp: Date.now() - 7200000 },
          { id: '3', price: 0.1236, baseAmount: 180, timestamp: Date.now() - 10800000 }
        ]);
      }

      // Test 4: Load 24h stats
      try {
        const stats = await stellarTestnetService.get24hStats(
          stellarTestnetService.assets.XLM,
          stellarTestnetService.assets.USDC
        );
        setStats24h(stats);
        console.log('✅ 24h stats loaded:', stats);
      } catch (err) {
        console.log('⚠️ 24h stats not available, using demo data');
        setStats24h({
          volume24h: 125000,
          priceChange24h: 2.45,
          high24h: 0.1245,
          low24h: 0.1220,
          currentPrice: 0.1235,
          demo: true
        });
      }

    } catch (error) {
      console.error('❌ Testnet demo error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testSwapRoute = async () => {
    setLoading(true);
    try {
      const route = await stellarTestnetService.calculateOptimalRoute('XLM', 'USDC', 100);
      console.log('✅ Test swap route calculated:', route);
      alert(`Route calculated! Output: ${route.totalAmountOut.toFixed(6)} USDC for 100 XLM`);
    } catch (error) {
      console.error('❌ Route calculation failed:', error);
      alert(`Route calculation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestnetData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🌊 SWAVE Stellar Testnet Integration Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Real USDC Contract: <code>GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5</code>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Account Data */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Balance
                {accountData?.demo && <Chip label="Demo Data" size="small" sx={{ ml: 1 }} />}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Account Public Key"
                  value={testAccount}
                  onChange={(e) => setTestAccount(e.target.value)}
                  placeholder="Enter Stellar testnet account"
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={() => loadTestnetData(testAccount || DEMO_ACCOUNT)}
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Load Account'}
                </Button>
              </Box>

              {accountData && (
                <List dense>
                  {Object.entries(accountData.balances).map(([asset, balance]) => (
                    <ListItem key={asset}>
                      <ListItemText
                        primary={`${asset}: ${balance.toFixed(4)}`}
                        secondary={asset === 'XLM' ? 'Native Asset' : 'Issued Asset'}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Book */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                XLM/USDC Order Book
                {orderBookData?.demo && <Chip label="Demo Data" size="small" sx={{ ml: 1 }} />}
              </Typography>

              {orderBookData && (
                <Box>
                  <Typography variant="subtitle2" color="error">Asks (Sell Orders)</Typography>
                  {orderBookData.asks.slice(0, 3).map((ask, index) => (
                    <Typography key={index} variant="body2">
                      {ask.price.toFixed(6)} USDC - {ask.amount.toFixed(2)} XLM
                    </Typography>
                  ))}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle2" color="success.main">Bids (Buy Orders)</Typography>
                  {orderBookData.bids.slice(0, 3).map((bid, index) => (
                    <Typography key={index} variant="body2">
                      {bid.price.toFixed(6)} USDC - {bid.amount.toFixed(2)} XLM
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 24h Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                24h Market Stats
                {stats24h?.demo && <Chip label="Demo Data" size="small" sx={{ ml: 1 }} />}
              </Typography>

              {stats24h && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Volume 24h</Typography>
                    <Typography variant="h6">{stats24h.volume24h.toLocaleString()} XLM</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Price Change</Typography>
                    <Typography 
                      variant="h6" 
                      color={stats24h.priceChange24h >= 0 ? 'success.main' : 'error.main'}
                    >
                      {stats24h.priceChange24h >= 0 ? '+' : ''}{stats24h.priceChange24h.toFixed(2)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">High</Typography>
                    <Typography variant="body1">{stats24h.high24h?.toFixed(6) || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Low</Typography>
                    <Typography variant="body1">{stats24h.low24h?.toFixed(6) || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Trades */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Trades
              </Typography>

              {tradeHistory.length > 0 ? (
                <List dense>
                  {tradeHistory.map((trade, index) => (
                    <ListItem key={trade.id || index}>
                      <ListItemText
                        primary={`${trade.price.toFixed(6)} USDC`}
                        secondary={`${trade.baseAmount.toFixed(2)} XLM - ${new Date(trade.timestamp).toLocaleTimeString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent trades available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Test Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Real Swap Calculation
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test the real Stellar DEX route calculation for 100 XLM → USDC
              </Typography>

              <Button
                variant="contained"
                onClick={testSwapRoute}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Calculating...' : 'Test Swap Route'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestnetDemo; 
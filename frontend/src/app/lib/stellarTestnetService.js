/**
 * SWAVE Stellar Testnet Integration Service
 * Real testnet data and swap execution
 */

import * as StellarSdk from '@stellar/stellar-sdk';

class StellarTestnetService {
  constructor() {
    // Stellar Testnet Configuration  
    this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    this.sorobanServer = new StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');
    this.networkPassphrase = StellarSdk.Networks.TESTNET;
    
    // Real assets on Stellar Testnet
    this.assets = {
      XLM: StellarSdk.Asset.native(),
      USDC: new StellarSdk.Asset('USDC', 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'), // Real USDC issuer
      // Add more real testnet assets as needed
    };

    // SWAVE Contract Addresses (your deployed contracts)
    this.swaveContracts = {
      SWAP: 'CD5FDLAZX3VCDCIMDUB2D5EFWAQJ4IHV4HU66YK6R6CZWK4VZBZPJX5U',
      ORACLE: 'CCR2XYJWYDQKD672VFZ2WYF5OBXZNBWWPOUJZY6BBG3BIA5DVCP56N45',
      LIQUIDITY: 'CBEGN6QYJBYY4WWIJM6C7R4XA5I2MWQF2IA6R2FOIGOUFI4GQ4QVMBIZ',
      FEE_MANAGER: 'CAXR2ODIZR77GC5INTSCEX7ZVQAKKVE4XZ45DC7VTXOY64D36S4OCJZK',
      CREDIT_SCORE: 'CAMQZZ5FMDFKMBQ3M7DAGJBZ3F5FCBNUDBUGM3XHGCDD5BBA6VDNPTLH',
      LOAN: 'CB5Q2J2LGHSHPPZGNHHQZ46Q3BTM5RTZWDMVOYQ7BMVSUOIH5OOOHXS3',
      COLLATERAL: 'CB4BQCSOZT5SHIDK3OERWUBW5X5GRYQRGAFSM5T54GPA74RNW5UEE5IS',
      MULTISIG: 'CA5CRKZRXFW2AK6IQUMXOCRUOXVGVKIN7DU2LKWKPNLZHICA2LPPNEC4',
      STORAGE_MANAGER: 'CAZBL3HZEPQMPYAH4COX7NWOZL5BFLM2OMN3QS4IBF2EERAXVH3PAEF4'
    };

    // Cache for real-time data
    this.priceCache = new Map();
    this.liquidityCache = new Map();
    this.lastUpdate = 0;
    this.UPDATE_INTERVAL = 30000; // 30 seconds
  }

  /**
   * Get real account balance from testnet
   */
  async getAccountBalance(accountId) {
    try {
      const account = await this.server.loadAccount(accountId);
      const balances = {};

      account.balances.forEach(balance => {
        if (balance.asset_type === 'native') {
          balances.XLM = parseFloat(balance.balance);
        } else {
          const assetCode = balance.asset_code;
          balances[assetCode] = parseFloat(balance.balance);
        }
      });

      return balances;
    } catch (error) {
      console.error('❌ Error loading account balance:', error);
      throw new Error(`Failed to load account balance: ${error.message}`);
    }
  }

  /**
   * Get real-time order book data for token pairs
   */
  async getOrderBook(sellingAsset, buyingAsset, limit = 20) {
    try {
      const orderbook = await this.server
        .orderbook(sellingAsset, buyingAsset)
        .limit(limit)
        .call();

      return {
        bids: orderbook.bids.map(bid => ({
          price: parseFloat(bid.price),
          amount: parseFloat(bid.amount)
        })),
        asks: orderbook.asks.map(ask => ({
          price: parseFloat(ask.price),
          amount: parseFloat(ask.amount)
        })),
        base: orderbook.base,
        counter: orderbook.counter
      };
    } catch (error) {
      console.error('❌ Error fetching orderbook:', error);
      return { bids: [], asks: [], base: null, counter: null };
    }
  }

  /**
   * Get real trading pairs and liquidity from Stellar DEX
   */
  async getRealLiquidityPools() {
    try {
      const pools = [];
      
      // XLM/USDC pair
      const xlmUsdcBook = await this.getOrderBook(this.assets.XLM, this.assets.USDC);
      if (xlmUsdcBook.bids.length > 0 && xlmUsdcBook.asks.length > 0) {
        const midPrice = (xlmUsdcBook.bids[0].price + xlmUsdcBook.asks[0].price) / 2;
        const totalLiquidity = xlmUsdcBook.bids.reduce((sum, bid) => sum + bid.amount, 0) +
                              xlmUsdcBook.asks.reduce((sum, ask) => sum + ask.amount, 0);

        pools.push({
          id: 'XLM_USDC',
          tokenA: 'XLM',
          tokenB: 'USDC',
          reserveA: xlmUsdcBook.bids.reduce((sum, bid) => sum + bid.amount, 0),
          reserveB: xlmUsdcBook.asks.reduce((sum, ask) => sum + ask.amount * ask.price, 0),
          price: midPrice,
          liquidity: totalLiquidity,
          fee: 0.003, // Estimated DEX fee
          spread: xlmUsdcBook.asks[0]?.price - xlmUsdcBook.bids[0]?.price || 0,
          lastUpdate: Date.now()
        });
      }

      // Add more pairs as needed
      console.log(`📊 Loaded ${pools.length} real liquidity pools from Stellar DEX`);
      return pools;
    } catch (error) {
      console.error('❌ Error loading real liquidity pools:', error);
      return [];
    }
  }

  /**
   * Get real-time price from Stellar DEX
   */
  async getRealTimePrice(fromAsset, toAsset) {
    try {
      const trades = await this.server
        .trades()
        .forAssetPair(fromAsset, toAsset)
        .order('desc')
        .limit(1)
        .call();

      if (trades.records.length > 0) {
        const lastTrade = trades.records[0];
        return {
          price: parseFloat(lastTrade.price.n) / parseFloat(lastTrade.price.d),
          amount: parseFloat(lastTrade.base_amount),
          timestamp: new Date(lastTrade.ledger_close_time).getTime()
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching real-time price:', error);
      return null;
    }
  }

  /**
   * Calculate optimal swap route using real Stellar DEX data
   */
  async calculateOptimalRoute(fromToken, toToken, amount) {
    try {
      console.log(`🔍 Calculating real route: ${fromToken} -> ${toToken}, Amount: ${amount}`);

      // Direct path
      const fromAsset = this.assets[fromToken];
      const toAsset = this.assets[toToken];
      
      if (!fromAsset || !toAsset) {
        throw new Error(`Unsupported asset: ${fromToken} or ${toToken}`);
      }

      // Get real order book
      const orderbook = await this.getOrderBook(fromAsset, toAsset);
      
      if (orderbook.asks.length === 0) {
        throw new Error(`No liquidity available for ${fromToken}/${toToken}`);
      }

      // Calculate output amount from real order book
      let remainingAmount = amount;
      let totalOutput = 0;
      let totalFee = 0;
      const usedOrders = [];

      for (const ask of orderbook.asks) {
        if (remainingAmount <= 0) break;

        const orderAmount = Math.min(remainingAmount, ask.amount);
        const orderOutput = orderAmount * ask.price;
        const orderFee = orderOutput * 0.003; // 0.3% fee

        totalOutput += orderOutput - orderFee;
        totalFee += orderFee;
        remainingAmount -= orderAmount;

        usedOrders.push({
          price: ask.price,
          amount: orderAmount,
          output: orderOutput - orderFee,
          fee: orderFee
        });
      }

      if (remainingAmount > 0) {
        throw new Error('Insufficient liquidity for this amount');
      }

      // Calculate price impact
      const avgPrice = totalOutput / amount;
      const marketPrice = orderbook.asks[0].price;
      const priceImpact = Math.abs((avgPrice - marketPrice) / marketPrice) * 100;

      return {
        path: [fromToken, toToken],
        steps: [{
          from: fromToken,
          to: toToken,
          inputAmount: amount,
          outputAmount: totalOutput,
          fee: totalFee,
          price: avgPrice,
          priceImpact,
          orders: usedOrders
        }],
        totalAmountIn: amount,
        totalAmountOut: totalOutput,
        totalFees: totalFee,
        priceImpact,
        efficiency: (totalOutput / (amount * marketPrice)) * 100,
        timestamp: Date.now(),
        source: 'stellar_dex'
      };

    } catch (error) {
      console.error('❌ Route calculation failed:', error);
      throw error;
    }
  }

  /**
   * Execute real swap using your deployed SWAVE contract
   */
  async executeSwap(route, userKeypair, walletService) {
    try {
      console.log('🚀 Executing swap via SWAVE contract...', route);

      if (!userKeypair) {
        throw new Error('User keypair required for transaction signing');
      }

      // Load user account
      const account = await this.server.loadAccount(userKeypair.publicKey());
      
      // Build Soroban contract call for your SWAVE swap contract
      const swapContract = new StellarSdk.Contract(this.swaveContracts.SWAP);
      
      // Prepare swap request parameters
      const swapRequest = {
        user: userKeypair.publicKey(),
        route: {
          steps: route.steps.map(step => ({
            token_in: {
              symbol: step.from,
              contract: step.from === 'XLM' ? null : this.assets[step.from].issuer
            },
            token_out: {
              symbol: step.to,
              contract: step.to === 'XLM' ? null : this.assets[step.to].issuer
            },
            amount_in: Math.floor(step.inputAmount * 10000000), // Convert to stroops
            amount_out: Math.floor(step.outputAmount * 10000000),
            fee: Math.floor(step.fee * 10000000),
            pool_id: `${step.from}_${step.to}`
          })),
          total_amount_in: Math.floor(route.totalAmountIn * 10000000),
          total_amount_out: Math.floor(route.totalAmountOut * 10000000),
          total_fees: Math.floor(route.totalFees * 10000000),
          expected_slippage: Math.floor(route.priceImpact * 100), // Convert to basis points
          expires_at: Date.now() + 300000 // 5 minutes from now
        },
        max_slippage: 500, // 5% max slippage in basis points
        min_amount_out: Math.floor(route.totalAmountOut * 0.95 * 10000000), // 5% slippage tolerance
        deadline: Date.now() + 300000 // 5 minutes deadline
      };

      // Build Soroban transaction
      const operation = swapContract.call(
        'execute_swap',
        StellarSdk.nativeToScVal(swapRequest, {
          type: {
            user: 'address',
            route: {
              steps: [{
                token_in: { symbol: 'string', contract: ['null', 'address'] },
                token_out: { symbol: 'string', contract: ['null', 'address'] },
                amount_in: 'i128',
                amount_out: 'i128',
                fee: 'i128',
                pool_id: 'string'
              }],
              total_amount_in: 'i128',
              total_amount_out: 'i128',
              total_fees: 'i128',
              expected_slippage: 'u32',
              expires_at: 'u64'
            },
            max_slippage: 'u32',
            min_amount_out: 'i128',
            deadline: 'u64'
          }
        })
      );

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      transaction.sign(userKeypair);

      // Submit to Soroban RPC
      const result = await this.sorobanServer.sendTransaction(transaction);
      
      console.log('✅ SWAVE contract swap executed:', result);

      return {
        hash: result.hash,
        status: result.status,
        amountOut: route.totalAmountOut,
        feesPaid: route.totalFees,
        priceImpact: route.priceImpact,
        executedAt: Date.now(),
        contractResult: result
      };

    } catch (error) {
      console.error('❌ SWAVE contract swap failed:', error);
      
      // Fallback to DEX swap if contract call fails
      console.log('🔄 Falling back to DEX swap...');
      return await this.executeDEXSwap(route, userKeypair);
    }
  }

  /**
   * Fallback DEX swap execution
   */
  async executeDEXSwap(route, userKeypair) {
    try {
      const account = await this.server.loadAccount(userKeypair.publicKey());
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      });

      // Add DEX operations for each step
      for (const step of route.steps) {
        const operation = StellarSdk.Operation.manageBuyOffer({
          selling: this.assets[step.from],
          buying: this.assets[step.to],
          buyAmount: step.outputAmount.toFixed(7),
          price: step.price.toFixed(7),
          offerId: 0
        });

        transaction.addOperation(operation);
      }

      const builtTransaction = transaction.setTimeout(300).build();
      builtTransaction.sign(userKeypair);

      const result = await this.server.submitTransaction(builtTransaction);
      
      return {
        hash: result.hash,
        ledger: result.ledger,
        amountOut: route.totalAmountOut,
        feesPaid: route.totalFees,
        priceImpact: route.priceImpact,
        executedAt: Date.now(),
        method: 'dex_fallback',
        stellarResult: result
      };

    } catch (error) {
      console.error('❌ DEX fallback swap also failed:', error);
      throw new Error(`Both contract and DEX swap failed: ${error.message}`);
    }
  }

  /**
   * Get recent trade history for a pair
   */
  async getTradeHistory(fromAsset, toAsset, limit = 10) {
    try {
      const trades = await this.server
        .trades()
        .forAssetPair(fromAsset, toAsset)
        .order('desc')
        .limit(limit)
        .call();

      return trades.records.map(trade => ({
        id: trade.id,
        price: parseFloat(trade.price.n) / parseFloat(trade.price.d),
        baseAmount: parseFloat(trade.base_amount),
        counterAmount: parseFloat(trade.counter_amount),
        timestamp: new Date(trade.ledger_close_time).getTime(),
        seller: trade.base_account,
        buyer: trade.counter_account
      }));
    } catch (error) {
      console.error('❌ Error fetching trade history:', error);
      return [];
    }
  }

  /**
   * Get 24h volume and price change
   */
  async get24hStats(fromAsset, toAsset) {
    try {
      const now = Date.now();
      const yesterday = now - (24 * 60 * 60 * 1000);

      const trades = await this.server
        .trades()
        .forAssetPair(fromAsset, toAsset)
        .order('desc')
        .limit(200)
        .call();

      const recentTrades = trades.records.filter(trade => 
        new Date(trade.ledger_close_time).getTime() > yesterday
      );

      if (recentTrades.length === 0) {
        return { volume24h: 0, priceChange24h: 0, high24h: 0, low24h: 0 };
      }

      const volume24h = recentTrades.reduce((sum, trade) => 
        sum + parseFloat(trade.base_amount), 0
      );

      const prices = recentTrades.map(trade => 
        parseFloat(trade.price.n) / parseFloat(trade.price.d)
      );

      const currentPrice = prices[0];
      const oldestPrice = prices[prices.length - 1];
      const priceChange24h = ((currentPrice - oldestPrice) / oldestPrice) * 100;

      return {
        volume24h,
        priceChange24h,
        high24h: Math.max(...prices),
        low24h: Math.min(...prices),
        currentPrice
      };
    } catch (error) {
      console.error('❌ Error fetching 24h stats:', error);
      return { volume24h: 0, priceChange24h: 0, high24h: 0, low24h: 0 };
    }
  }

  /**
   * Monitor real-time price updates
   */
  startPriceMonitoring(callback) {
    const monitor = async () => {
      try {
        // Monitor XLM/USDC pair
        const xlmUsdcPrice = await this.getRealTimePrice(this.assets.XLM, this.assets.USDC);
        if (xlmUsdcPrice) {
          callback({
            pair: 'XLM/USDC',
            price: xlmUsdcPrice.price,
            timestamp: xlmUsdcPrice.timestamp
          });
        }

        // Add more pairs as needed
      } catch (error) {
        console.error('❌ Price monitoring error:', error);
      }
    };

    // Initial call
    monitor();

    // Set up interval
    const interval = setInterval(monitor, 10000); // Every 10 seconds

    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Validate transaction before execution
   */
  async validateSwap(route, userPublicKey) {
    try {
      // Check account balance
      const balances = await this.getAccountBalance(userPublicKey);
      const fromToken = route.steps[0].from;
      const requiredAmount = route.totalAmountIn;

      if (!balances[fromToken] || balances[fromToken] < requiredAmount) {
        throw new Error(`Insufficient ${fromToken} balance. Required: ${requiredAmount}, Available: ${balances[fromToken] || 0}`);
      }

      // Check if route is still valid (prices haven't changed too much)
      const currentRoute = await this.calculateOptimalRoute(
        route.steps[0].from,
        route.steps[route.steps.length - 1].to,
        route.totalAmountIn
      );

      const priceDifference = Math.abs(currentRoute.totalAmountOut - route.totalAmountOut) / route.totalAmountOut;
      if (priceDifference > 0.05) { // 5% tolerance
        throw new Error('Price has changed significantly. Please refresh the route.');
      }

      return { valid: true, currentRoute };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Export singleton instance
export const stellarTestnetService = new StellarTestnetService();
export default stellarTestnetService; 
/**
 * Token Service for managing token data and metadata
 */

export class TokenService {
  constructor() {
    this.tokenCache = new Map();
    this.priceCache = new Map();
    this.lastPriceUpdate = 0;
    this.PRICE_UPDATE_INTERVAL = 30000; // 30 seconds
  }

  /**
   * Get list of supported tokens
   * @returns {Array} List of token objects
   */
  async getTokenList() {
    console.log('📋 Loading token list...');
    
    // Mock token list - in real implementation, fetch from API
    const tokenList = [
      {
        symbol: 'XLM',
        name: 'Stellar Lumens',
        address: null, // Native asset
        decimals: 7,
        price: 0.095,
        change24h: 2.3,
        volume24h: 12500000,
        logoUrl: '/tokens/xlm.png',
        reserves: 1000000
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
        decimals: 7,
        price: 1.00,
        change24h: 0.1,
        volume24h: 8750000,
        logoUrl: '/tokens/usdc.png',
        reserves: 875000
      },
      {
        symbol: 'AQUA',
        name: 'Aquarius',
        address: 'GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA',
        decimals: 7,
        price: 0.0032,
        change24h: -1.2,
        volume24h: 450000,
        logoUrl: '/tokens/aqua.png',
        reserves: 15000000
      },
      {
        symbol: 'yXLM',
        name: 'Yieldblox XLM',
        address: 'GARDNV3Q7YGT4AKSDF25LT32YSCCW67G326FIR7FPLP3TTMOTLLU3YLD',
        decimals: 7,
        price: 0.098,
        change24h: 2.1,
        volume24h: 125000,
        logoUrl: '/tokens/yxlm.png',
        reserves: 250000
      },
      {
        symbol: 'SHX',
        name: 'Stronghold USD',
        address: 'GBSTRUSD7IRX73RQZBL3RQUH6KS3O4NYFY3QCALDLZD77XMZOPWAVTUK',
        decimals: 7,
        price: 1.001,
        change24h: 0.05,
        volume24h: 95000,
        logoUrl: '/tokens/shx.png',
        reserves: 95000
      }
    ];

    // Cache tokens
    tokenList.forEach(token => {
      this.tokenCache.set(token.symbol, token);
    });

    console.log('✅ Token list loaded:', tokenList.length, 'tokens');
    return tokenList;
  }

  /**
   * Get token by symbol
   * @param {string} symbol - Token symbol
   * @returns {Object|null} Token object or null if not found
   */
  getToken(symbol) {
    return this.tokenCache.get(symbol) || null;
  }

  /**
   * Get current token prices
   * @param {Array} symbols - Array of token symbols
   * @returns {Object} Price data for tokens
   */
  async getTokenPrices(symbols) {
    const now = Date.now();
    
    // Return cached prices if still fresh
    if (now - this.lastPriceUpdate < this.PRICE_UPDATE_INTERVAL) {
      const prices = {};
      symbols.forEach(symbol => {
        if (this.priceCache.has(symbol)) {
          prices[symbol] = this.priceCache.get(symbol);
        }
      });
      return prices;
    }

    console.log('📈 Fetching token prices...');

    // Mock price data - in real implementation, fetch from price API
    const mockPrices = {
      XLM: {
        price: 0.095 + (Math.random() - 0.5) * 0.002,
        change24h: 2.3 + (Math.random() - 0.5) * 1.0,
        timestamp: now
      },
      USDC: {
        price: 1.00 + (Math.random() - 0.5) * 0.001,
        change24h: 0.1 + (Math.random() - 0.5) * 0.2,
        timestamp: now
      },
      AQUA: {
        price: 0.0032 + (Math.random() - 0.5) * 0.0002,
        change24h: -1.2 + (Math.random() - 0.5) * 2.0,
        timestamp: now
      },
      yXLM: {
        price: 0.098 + (Math.random() - 0.5) * 0.002,
        change24h: 2.1 + (Math.random() - 0.5) * 1.0,
        timestamp: now
      },
      SHX: {
        price: 1.001 + (Math.random() - 0.5) * 0.001,
        change24h: 0.05 + (Math.random() - 0.5) * 0.1,
        timestamp: now
      }
    };

    // Cache prices
    Object.entries(mockPrices).forEach(([symbol, data]) => {
      this.priceCache.set(symbol, data);
    });

    this.lastPriceUpdate = now;

    // Return requested prices
    const result = {};
    symbols.forEach(symbol => {
      if (mockPrices[symbol]) {
        result[symbol] = mockPrices[symbol];
      }
    });

    return result;
  }

  /**
   * Get token balance for a user
   * @param {string} userAddress - User's wallet address
   * @param {string} tokenSymbol - Token symbol
   * @returns {number} Token balance
   */
  async getTokenBalance(userAddress, tokenSymbol) {
    // Mock balance data - in real implementation, query Stellar network
    const mockBalances = {
      XLM: 1500.5,
      USDC: 250.0,
      AQUA: 50000.0,
      yXLM: 100.0,
      SHX: 75.5
    };

    return mockBalances[tokenSymbol] || 0;
  }

  /**
   * Format token amount with proper decimals
   * @param {number} amount - Raw amount
   * @param {Object} token - Token object with decimals info
   * @returns {string} Formatted amount
   */
  formatTokenAmount(amount, token) {
    const decimals = token.decimals || 7;
    const divisor = Math.pow(10, decimals);
    const formatted = (amount / divisor).toFixed(6);
    
    // Remove trailing zeros
    return parseFloat(formatted).toString();
  }

  /**
   * Parse token amount to raw units
   * @param {string} amount - Human readable amount
   * @param {Object} token - Token object with decimals info
   * @returns {number} Raw amount in token units
   */
  parseTokenAmount(amount, token) {
    const decimals = token.decimals || 7;
    const multiplier = Math.pow(10, decimals);
    
    return Math.floor(parseFloat(amount) * multiplier);
  }

  /**
   * Validate token address format
   * @param {string} address - Token address to validate
   * @returns {boolean} True if valid Stellar address
   */
  isValidTokenAddress(address) {
    if (!address) return true; // Native XLM has no address
    
    // Stellar address validation (simplified)
    return address.length === 56 && address.match(/^G[A-Z2-7]{55}$/);
  }

  /**
   * Get token trading pairs
   * @param {string} baseToken - Base token symbol
   * @returns {Array} Available trading pairs
   */
  getTradingPairs(baseToken) {
    const allTokens = Array.from(this.tokenCache.keys());
    
    return allTokens
      .filter(symbol => symbol !== baseToken)
      .map(symbol => ({
        base: baseToken,
        quote: symbol,
        pair: `${baseToken}/${symbol}`
      }));
  }

  /**
   * Get token market data
   * @param {string} symbol - Token symbol
   * @returns {Object} Market data including price, volume, etc.
   */
  async getTokenMarketData(symbol) {
    const token = this.getToken(symbol);
    if (!token) return null;

    const priceData = await this.getTokenPrices([symbol]);
    
    return {
      symbol,
      name: token.name,
      price: priceData[symbol]?.price || token.price,
      change24h: priceData[symbol]?.change24h || token.change24h,
      volume24h: token.volume24h,
      marketCap: (priceData[symbol]?.price || token.price) * 1000000000, // Mock supply
      reserves: token.reserves,
      lastUpdate: priceData[symbol]?.timestamp || Date.now()
    };
  }

  /**
   * Search tokens by name or symbol
   * @param {string} query - Search query
   * @returns {Array} Matching tokens
   */
  searchTokens(query) {
    const searchTerm = query.toLowerCase();
    const tokens = Array.from(this.tokenCache.values());
    
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(searchTerm) ||
      token.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get popular token pairs
   * @returns {Array} Popular trading pairs
   */
  getPopularPairs() {
    return [
      { from: 'XLM', to: 'USDC', volume24h: 5000000 },
      { from: 'XLM', to: 'AQUA', volume24h: 1200000 },
      { from: 'USDC', to: 'AQUA', volume24h: 800000 },
      { from: 'XLM', to: 'yXLM', volume24h: 450000 },
      { from: 'USDC', to: 'SHX', volume24h: 250000 }
    ];
  }
} 
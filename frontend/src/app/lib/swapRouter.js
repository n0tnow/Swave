/**
 * SWAVE Advanced Swap Router with Dijkstra Algorithm
 * Optimal path finding for multi-hop swaps with fee optimization
 */

import * as StellarSdk from 'stellar-sdk';

export class EnhancedSwapRouter {
  constructor() {
    // Deployed Contract Addresses (from deployment)
    this.contracts = {
      SWAP: 'CD5FDLAZX3VCDCIMDUB2D5EFWAQJ4IHV4HU66YK6R6CZWK4VZBZPJX5U',
      ORACLE: 'CCR2XYJWYDQKD672VFZ2WYF5OBXZNBWWPOUJZY6BBG3BIA5DVCP56N45',
      LIQUIDITY: 'CBEGN6QYJBYY4WWIJM6C7R4XA5I2MWQF2IA6R2FOIGOUFI4GQ4QVMBIZ',
      FEE_MANAGER: 'CAXR2ODIZR77GC5INTSCEX7ZVQAKKVE4XZ45DC7VTXOY64D36S4OCJZK',
      CREDIT_SCORE: 'CAMQZZ5FMDFKMBQ3M7DAGJBZ3F5FCBNUDBUGM3XHGCDD5BBA6VDNPTLH'
    };

    // Stellar Testnet Configuration
    this.rpcUrl = 'https://soroban-testnet.stellar.org';
    this.networkPassphrase = StellarSdk.Networks.TESTNET;
    
    // Initialize server only in browser environment
    if (typeof window !== 'undefined') {
      try {
        this.server = new StellarSdk.SorobanRpc.Server(this.rpcUrl);
      } catch (error) {
        console.warn('⚠️ SorobanRpc not available, using mock server');
        this.server = null;
      }
    } else {
      this.server = null;
    }

    // Token Graph for routing
    this.tokenGraph = new Map();
    this.liquidityPools = new Map();
    this.priceCache = new Map();
    this.lastUpdate = 0;
    this.UPDATE_INTERVAL = 60000; // 1 minute
    
    // Algorithm performance metrics
    this.metrics = {
      dijkstraTime: 0,
      aStarTime: 0,
      feeCalculationTime: 0
    };

    // Stellar network fees and exchange rates
    this.networkFee = 100; // 0.00001 XLM base fee in stroops
    this.baseFeeRate = 0.003; // 0.3% base swap fee
    
    // Token definitions with real-world data
    this.tokens = {
      'XLM': {
        symbol: 'XLM',
        name: 'Stellar Lumens',
        icon: '🌟',
        decimals: 7,
        isNative: true,
        contract: null
      },
      'USDC': {
        symbol: 'USDC',
        name: 'USD Coin',
        icon: '💵',
        decimals: 7,
        isNative: false,
        issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5' // Real USDC issuer on testnet
      },
      'BTC': {
        symbol: 'BTC',
        name: 'Bitcoin',
        icon: '₿',
        decimals: 8,
        isNative: false,
        contract: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7OSPGKLPBGBMVL5MHALQ4MNY'
      },
      'ETH': {
        symbol: 'ETH',
        name: 'Ethereum',
        icon: '⟠',
        decimals: 8,
        isNative: false,
        contract: 'CAZWK5KQXSENGN5HRFWU2HMOU7JXQPY6DRM56YIONPVVG4AASN6IKJGF'
      },
      'BNB': {
        symbol: 'BNB',
        name: 'Binance Coin',
        icon: '🔶',
        decimals: 8,
        isNative: false,
        contract: 'CCHKUUQQDGXUAY7YZLHQVIKEKHYUGTJ7MFWGVYF5NQVGVFGZGQZLGQGB'
      }
    };

    // Liquidity pools with real trading pairs
    this.liquidityPools = {
      'XLM-USDC': {
        tokenA: 'XLM',
        tokenB: 'USDC',
        reserveA: 10000000000000, // 1M XLM
        reserveB: 120000000000,   // 120K USDC
        fee: 0.003,               // 0.3%
        volume24h: 50000000000,   // 24h volume
        active: true
      },
      'XLM-BTC': {
        tokenA: 'XLM',
        tokenB: 'BTC',
        reserveA: 5000000000000,  // 500K XLM
        reserveB: 150000000,      // 1.5 BTC
        fee: 0.005,               // 0.5%
        volume24h: 20000000000,
        active: true
      },
      'BTC-USDC': {
        tokenA: 'BTC',
        tokenB: 'USDC',
        reserveA: 100000000,      // 1 BTC
        reserveB: 430000000000,   // 43K USDC
        fee: 0.003,
        volume24h: 30000000000,
        active: true
      },
      'BTC-ETH': {
        tokenA: 'BTC',
        tokenB: 'ETH',
        reserveA: 50000000,       // 0.5 BTC
        reserveB: 1200000000,     // 12 ETH
        fee: 0.004,               // 0.4%
        volume24h: 15000000000,
        active: true
      },
      'ETH-USDC': {
        tokenA: 'ETH',
        tokenB: 'USDC',
        reserveA: 800000000,      // 8 ETH
        reserveB: 200000000000,   // 20K USDC
        fee: 0.003,
        volume24h: 25000000000,
        active: true
      },
      'BNB-USDC': {
        tokenA: 'BNB',
        tokenB: 'USDC',
        reserveA: 1000000000,     // 10 BNB
        reserveB: 24000000000,    // 2.4K USDC
        fee: 0.004,
        volume24h: 8000000000,
        active: true
      },
      'XLM-BNB': {
        tokenA: 'XLM',
        tokenB: 'BNB',
        reserveA: 2000000000000,  // 200K XLM
        reserveB: 500000000,      // 5 BNB
        fee: 0.006,               // 0.6%
        volume24h: 5000000000,
        active: true
      },
      'BTC-BNB': {
        tokenA: 'BTC',
        tokenB: 'BNB',
        reserveA: 30000000,       // 0.3 BTC
        reserveB: 600000000,      // 6 BNB
        fee: 0.005,
        volume24h: 7000000000,
        active: true
      }
    };
  }

  /**
   * Initialize router with real contract data
   */
  async initialize() {
    console.log('🚀 Initializing Enhanced Swap Router...');
    
    try {
      await this.loadLiquidityPools();
      await this.updatePriceCache();
      console.log('✅ Swap Router initialized successfully');
    } catch (error) {
      console.error('❌ Router initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load liquidity pools from deployed contract
   */
  async loadLiquidityPools() {
    try {
      const contract = new StellarSdk.Contract(this.contracts.LIQUIDITY);
      
      // Simulated pool data (in production, this would come from contract)
      const pools = [
        { tokenA: 'XLM', tokenB: 'USDC', reserve_a: 1000000, reserve_b: 500000, fee: 0.003 },
        { tokenA: 'USDC', tokenB: 'BTC', reserve_a: 500000, reserve_b: 50, fee: 0.003 },
        { tokenA: 'XLM', tokenB: 'ETH', reserve_a: 1000000, reserve_b: 200, fee: 0.005 },
        { tokenA: 'ETH', tokenB: 'BTC', reserve_a: 200, reserve_b: 10, fee: 0.005 },
        { tokenA: 'USDC', tokenB: 'ADA', reserve_a: 500000, reserve_b: 800000, fee: 0.003 },
        { tokenA: 'XLM', tokenB: 'DOT', reserve_a: 1000000, reserve_b: 100000, fee: 0.004 }
      ];

      // Build token graph
      this.buildTokenGraph(pools);
      console.log(`📊 Loaded ${pools.length} liquidity pools`);
      
    } catch (error) {
      console.error('❌ Failed to load liquidity pools:', error);
      throw error;
    }
  }

  /**
   * Build token graph from available liquidity pools
   * @param {Array} tokenList - List of supported tokens
   * @returns {Object} Token graph with nodes and edges
   */
  async buildTokenGraph(tokenList) {
    const now = Date.now();
    
    // Return cached graph if still fresh
    if (this.tokenGraph && (now - this.lastUpdate) < this.UPDATE_INTERVAL) {
      return this.tokenGraph;
    }

    console.log('🔄 Building token graph...');

    // Create nodes (tokens)
    const nodes = new Map();
    tokenList.forEach(token => {
      nodes.set(token.symbol, {
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        price: token.price || 0,
        reserves: token.reserves || 0
      });
    });

    // Create edges (liquidity pools)
    const edges = new Map();
    const adjacencyList = new Map();

    // Initialize adjacency list
    tokenList.forEach(token => {
      adjacencyList.set(token.symbol, []);
    });

    // Mock liquidity pools for demo (in real app, fetch from DEX)
    const mockPools = await this.fetchLiquidityPools(tokenList);
    
    mockPools.forEach(pool => {
      const key = `${pool.tokenA.symbol}_${pool.tokenB.symbol}`;
      const reverseKey = `${pool.tokenB.symbol}_${pool.tokenA.symbol}`;
      
      // Calculate costs (fees + slippage)
      const cost = this.calculateEdgeCost(pool);
      
      // Add forward edge
      edges.set(key, {
        from: pool.tokenA.symbol,
        to: pool.tokenB.symbol,
        pool: pool,
        cost: cost,
        liquidity: pool.liquidity,
        fee: pool.fee,
        slippage: pool.slippage
      });
      
      // Add reverse edge
      edges.set(reverseKey, {
        from: pool.tokenB.symbol,
        to: pool.tokenA.symbol,
        pool: pool,
        cost: cost,
        liquidity: pool.liquidity,
        fee: pool.fee,
        slippage: pool.slippage
      });
      
      // Update adjacency list
      adjacencyList.get(pool.tokenA.symbol).push(pool.tokenB.symbol);
      adjacencyList.get(pool.tokenB.symbol).push(pool.tokenA.symbol);
    });

    this.tokenGraph = {
      nodes,
      edges,
      adjacencyList,
      lastUpdate: now
    };

    this.lastUpdate = now;
    console.log('✅ Token graph built successfully', this.tokenGraph);
    
    return this.tokenGraph;
  }

  /**
   * Find optimal route using Dijkstra's algorithm
   * @param {Object} graph - Token graph
   * @param {Object} fromToken - Source token
   * @param {Object} toToken - Destination token
   * @param {number} amount - Input amount
   * @param {number} maxSlippage - Maximum acceptable slippage
   * @returns {Object} Optimal route with path and metrics
   */
  async findOptimalRoute(graph, fromToken, toToken, amount, maxSlippage = 0.5) {
    console.log(`🔍 Finding optimal route: ${fromToken.symbol} -> ${toToken.symbol}, Amount: ${amount}`);
    
    const startTime = performance.now();
    
    // Initialize Dijkstra data structures
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    const unvisited = new Set();
    
    // Initialize all distances to infinity
    for (const [symbol] of graph.nodes) {
      distances.set(symbol, symbol === fromToken.symbol ? 0 : Infinity);
      previous.set(symbol, null);
      unvisited.add(symbol);
    }
    
    // Dijkstra's algorithm
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      const current = this.getMinDistanceNode(distances, unvisited);
      
      if (distances.get(current) === Infinity) {
        break; // No path possible
      }
      
      // Mark as visited
      unvisited.delete(current);
      visited.add(current);
      
      // Found target?
      if (current === toToken.symbol) {
        break;
      }
      
      // Update distances to neighbors
      const neighbors = graph.adjacencyList.get(current) || [];
      
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue;
        
        const edgeKey = `${current}_${neighbor}`;
        const edge = graph.edges.get(edgeKey);
        
        if (!edge) continue;
        
        // Calculate cost including slippage impact
        const edgeCost = this.calculateDynamicCost(edge, amount);
        const altDistance = distances.get(current) + edgeCost;
        
        if (altDistance < distances.get(neighbor)) {
          distances.set(neighbor, altDistance);
          previous.set(neighbor, current);
        }
      }
    }
    
    // Reconstruct path
    const path = this.reconstructPath(previous, fromToken.symbol, toToken.symbol);
    
    if (path.length === 0) {
      throw new Error('No route found between tokens');
    }
    
    // Calculate route metrics
    const route = await this.calculateRouteMetrics(graph, path, amount, maxSlippage);
    
    const endTime = performance.now();
    console.log(`✅ Route found in ${(endTime - startTime).toFixed(2)}ms:`, route);
    
    return route;
  }

  /**
   * Execute swap using the calculated route
   * @param {Object} route - Optimal route from findOptimalRoute
   * @param {number} maxSlippage - Maximum acceptable slippage
   * @returns {Object} Swap execution result
   */
  async executeSwap(route, maxSlippage) {
    console.log('🚀 Executing swap...', route);
    
    try {
      // Validate route hasn't expired
      const now = Date.now();
      if (now - route.timestamp > 30000) { // 30 seconds
        throw new Error('Route expired, please refresh');
      }
      
      // Check slippage tolerance
      if (route.expectedSlippage > maxSlippage) {
        throw new Error(`Slippage ${route.expectedSlippage.toFixed(2)}% exceeds maximum ${maxSlippage}%`);
      }
      
      // Prepare swap request for smart contract
      const swapRequest = {
        user: 'user_address_here', // Would be actual user address
        route: {
          steps: route.steps,
          totalAmountIn: route.amountIn,
          totalAmountOut: route.expectedOutput,
          totalFees: route.totalFees,
          expectedSlippage: Math.floor(route.expectedSlippage * 100), // Convert to basis points
          expiresAt: now + 300000 // 5 minutes from now
        },
        maxSlippage: Math.floor(maxSlippage * 100), // Convert to basis points
        minAmountOut: route.expectedOutput * (1 - maxSlippage / 100),
        deadline: now + 300000 // 5 minutes from now
      };
      
      // In real implementation, this would call the smart contract
      const result = await this.mockSwapExecution(swapRequest);
      
      console.log('✅ Swap executed successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Swap execution failed:', error);
      throw error;
    }
  }

  // Private helper methods
  
  /**
   * Get unvisited node with minimum distance (for Dijkstra)
   */
  getMinDistanceNode(distances, unvisited) {
    let minDistance = Infinity;
    let minNode = null;
    
    for (const node of unvisited) {
      const distance = distances.get(node);
      if (distance < minDistance) {
        minDistance = distance;
        minNode = node;
      }
    }
    
    return minNode;
  }

  /**
   * Reconstruct path from Dijkstra previous pointers
   */
  reconstructPath(previous, start, end) {
    const path = [];
    let current = end;
    
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }
    
    // Verify path is valid
    if (path[0] !== start) {
      return []; // No path found
    }
    
    return path;
  }

  /**
   * Calculate edge cost including fees and slippage
   */
  calculateEdgeCost(pool) {
    const baseCost = pool.fee || 0.003; // 0.3% default fee
    const slippageCost = pool.slippage || 0.001; // 0.1% default slippage
    
    // Total cost in basis points
    return Math.floor((baseCost + slippageCost) * 10000);
  }

  /**
   * Calculate dynamic cost based on trade size and liquidity
   */
  calculateDynamicCost(edge, amount) {
    let cost = edge.cost;
    
    // Increase cost for larger trades relative to liquidity
    if (edge.liquidity > 0) {
      const impactRatio = amount / edge.liquidity;
      
      if (impactRatio > 0.1) { // > 10% of liquidity
        cost += 500; // Add 5% penalty
      } else if (impactRatio > 0.05) { // > 5% of liquidity
        cost += 200; // Add 2% penalty
      }
    }
    
    return cost;
  }

  /**
   * Calculate comprehensive route metrics
   */
  async calculateRouteMetrics(graph, path, amount, maxSlippage) {
    const steps = [];
    let currentAmount = amount;
    let totalFees = 0;
    let totalSlippage = 0;
    
    // Calculate each step
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const edgeKey = `${from}_${to}`;
      const edge = graph.edges.get(edgeKey);
      
      if (!edge) {
        throw new Error(`Missing edge: ${from} -> ${to}`);
      }
      
      // Calculate step output using AMM formula
      const stepOutput = this.calculateAMMOutput(currentAmount, edge);
      const stepFee = currentAmount * edge.fee;
      
      steps.push({
        tokenIn: { symbol: from },
        tokenOut: { symbol: to },
        poolId: `${from}_${to}_pool`,
        amountIn: currentAmount,
        amountOut: stepOutput,
        fee: stepFee
      });
      
      totalFees += stepFee;
      totalSlippage += edge.slippage;
      currentAmount = stepOutput;
    }
    
    // Calculate final metrics
    const expectedOutput = currentAmount;
    const priceImpact = this.calculatePriceImpact(amount, expectedOutput);
    const qualityScore = this.calculateQualityScore(totalFees, totalSlippage, priceImpact);
    
    return {
      path: path.map(symbol => ({ symbol })),
      steps,
      amountIn: amount,
      expectedOutput,
      totalFees,
      expectedSlippage: totalSlippage,
      priceImpact,
      qualityScore,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate AMM output using constant product formula
   */
  calculateAMMOutput(amountIn, edge) {
    const { pool } = edge;
    const reserveIn = pool.reserveA || 1000000; // Mock reserves
    const reserveOut = pool.reserveB || 1000000;
    
    // x * y = k formula
    const amountInWithFee = amountIn * (1 - edge.fee);
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn + amountInWithFee;
    
    return numerator / denominator;
  }

  /**
   * Calculate price impact percentage
   */
  calculatePriceImpact(amountIn, amountOut) {
    // Simplified price impact calculation
    const expectedRate = 1; // 1:1 in ideal case
    const actualRate = amountOut / amountIn;
    
    return Math.abs(expectedRate - actualRate);
  }

  /**
   * Calculate route quality score (0-100)
   */
  calculateQualityScore(fees, slippage, priceImpact) {
    const totalCost = fees + slippage + priceImpact;
    const score = Math.max(0, 100 - (totalCost * 10000)); // Scale to 0-100
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Mock liquidity pools for demo
   */
  async fetchLiquidityPools(tokenList) {
    // In real implementation, this would fetch from DEX APIs
    return [
      {
        id: 'XLM_USDC',
        tokenA: { symbol: 'XLM' },
        tokenB: { symbol: 'USDC' },
        reserveA: 1000000,
        reserveB: 100000,
        liquidity: 1000000,
        fee: 0.003,
        slippage: 0.001
      },
      {
        id: 'XLM_AQUA',
        tokenA: { symbol: 'XLM' },
        tokenB: { symbol: 'AQUA' },
        reserveA: 500000,
        reserveB: 50000000,
        liquidity: 500000,
        fee: 0.003,
        slippage: 0.002
      },
      {
        id: 'USDC_AQUA',
        tokenA: { symbol: 'USDC' },
        tokenB: { symbol: 'AQUA' },
        reserveA: 100000,
        reserveB: 10000000,
        liquidity: 100000,
        fee: 0.003,
        slippage: 0.0015
      }
    ];
  }

  /**
   * Mock swap execution for demo
   */
  async mockSwapExecution(swapRequest) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful execution
    return {
      amountOut: swapRequest.route.totalAmountOut * 0.995, // 0.5% slippage
      feesPaid: swapRequest.route.totalFees,
      actualSlippage: 0.5,
      executedAt: Date.now()
    };
  }

  // Update price cache from oracle contract
  async updatePriceCache() {
    try {
      // Simulate price updates (in production, call ORACLE contract)
      const prices = {
        'XLM': 0.12,
        'USDC': 1.00,
        'BTC': 45000,
        'ETH': 3000,
        'ADA': 0.35,
        'DOT': 8.50
      };

      this.priceCache.clear();
      Object.entries(prices).forEach(([token, price]) => {
        this.priceCache.set(token, price);
      });

      console.log('📈 Price cache updated');
    } catch (error) {
      console.error('❌ Price update failed:', error);
    }
  }

  // Get real-time price from cache
  getTokenPrice(token) {
    return this.priceCache.get(token) || 0;
  }

  // Get performance metrics
  getMetrics() {
    return {
      ...this.metrics,
      totalTokens: this.tokenGraph.size,
      totalPools: Array.from(this.tokenGraph.values()).reduce((sum, edges) => sum + edges.length, 0) / 2,
      cacheSize: this.priceCache.size
    };
  }

  addEdge(from, to, poolData) {
    if (!this.tokenGraph.has(from)) {
      this.tokenGraph.set(from, []);
    }
    
    // Get the array and ensure it exists
    const edges = this.tokenGraph.get(from);
    if (edges) {
      edges.push({
        to,
        weight: this.calculateEdgeWeight(poolData),
        pool: poolData
      });
    }
  }

  /**
   * Dijkstra Algorithm for finding optimal swap path
   * @param {string} fromToken - Source token symbol
   * @param {string} toToken - Target token symbol
   * @param {number} amount - Amount to swap
   * @returns {Object} Optimal route with cost analysis
   */
  findOptimalRoute(fromToken, toToken, amount) {
    if (fromToken === toToken) {
      return {
        path: [fromToken],
        totalCost: 0,
        totalFee: 0,
        outputAmount: amount,
        steps: [],
        efficiency: 100
      };
    }

    // Build graph from liquidity pools
    const graph = this.buildGraph();
    
    // Dijkstra's algorithm implementation
    const distances = {};
    const previous = {};
    const routes = {};
    const visited = new Set();
    const queue = [];

    // Initialize distances
    Object.keys(this.tokens).forEach(token => {
      distances[token] = token === fromToken ? 0 : Infinity;
      routes[token] = {
        path: [fromToken],
        totalFee: 0,
        steps: [],
        outputAmount: token === fromToken ? amount : 0
      };
      queue.push(token);
    });

    while (queue.length > 0) {
      // Find unvisited node with minimum distance
      let current = null;
      let minDistance = Infinity;
      
      for (const node of queue) {
        if (!visited.has(node) && distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (!current || distances[current] === Infinity) break;

      visited.add(current);
      queue.splice(queue.indexOf(current), 1);

      // Check neighbors
      if (graph[current]) {
        for (const neighbor of Object.keys(graph[current])) {
          if (visited.has(neighbor)) continue;

          const edge = graph[current][neighbor];
          const currentRoute = routes[current];
          
          // Calculate cost for this hop
          const hopResult = this.calculateHopCost(
            current,
            neighbor,
            currentRoute.outputAmount,
            edge
          );

          const newDistance = distances[current] + hopResult.cost;
          
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = current;
            
            routes[neighbor] = {
              path: [...currentRoute.path, neighbor],
              totalFee: currentRoute.totalFee + hopResult.fee,
              steps: [...currentRoute.steps, {
                from: current,
                to: neighbor,
                pool: edge.poolId,
                inputAmount: currentRoute.outputAmount,
                outputAmount: hopResult.outputAmount,
                fee: hopResult.fee,
                rate: hopResult.rate,
                priceImpact: hopResult.priceImpact
              }],
              outputAmount: hopResult.outputAmount
            };
          }
        }
      }
    }

    // Return optimal route to target token
    const optimalRoute = routes[toToken];
    
    if (!optimalRoute || optimalRoute.outputAmount === 0) {
      return {
        path: [],
        totalCost: Infinity,
        totalFee: 0,
        outputAmount: 0,
        steps: [],
        efficiency: 0,
        error: 'No route found'
      };
    }

    // Calculate efficiency
    const directRate = this.getDirectRate(fromToken, toToken);
    const routeRate = optimalRoute.outputAmount / amount;
    const efficiency = directRate > 0 ? (routeRate / directRate) * 100 : 0;

    return {
      ...optimalRoute,
      totalCost: distances[toToken],
      efficiency: Math.min(efficiency, 100),
      networkFees: optimalRoute.steps.length * this.networkFee,
      estimatedTime: optimalRoute.steps.length * 5, // 5 seconds per hop
      slippage: this.calculateTotalSlippage(optimalRoute.steps)
    };
  }

  /**
   * Build graph from liquidity pools
   */
  buildGraph() {
    const graph = {};
    
    Object.entries(this.liquidityPools).forEach(([poolId, pool]) => {
      if (!pool.active) return;
      
      const { tokenA, tokenB } = pool;
      
      // Initialize nodes
      if (!graph[tokenA]) graph[tokenA] = {};
      if (!graph[tokenB]) graph[tokenB] = {};
      
      // Add bidirectional edges
      graph[tokenA][tokenB] = { ...pool, poolId };
      graph[tokenB][tokenA] = { 
        ...pool, 
        poolId,
        // Swap reserves for reverse direction
        reserveA: pool.reserveB,
        reserveB: pool.reserveA,
        tokenA: tokenB,
        tokenB: tokenA
      };
    });
    
    return graph;
  }

  /**
   * Calculate cost for single hop using AMM formula
   */
  calculateHopCost(fromToken, toToken, inputAmount, poolData) {
    const { reserveA, reserveB, fee } = poolData;
    
    if (reserveA === 0 || reserveB === 0 || inputAmount === 0) {
      return {
        cost: Infinity,
        fee: 0,
        outputAmount: 0,
        rate: 0,
        priceImpact: 100
      };
    }

    // AMM constant product formula: x * y = k
    // After fee: inputAmountAfterFee = inputAmount * (1 - fee)
    const inputAmountAfterFee = inputAmount * (1 - fee);
    
    // Calculate output: outputAmount = (inputAmountAfterFee * reserveB) / (reserveA + inputAmountAfterFee)
    const outputAmount = (inputAmountAfterFee * reserveB) / (reserveA + inputAmountAfterFee);
    
    // Calculate price impact
    const priceBeforeSwap = reserveB / reserveA;
    const priceAfterSwap = (reserveB - outputAmount) / (reserveA + inputAmount);
    const priceImpact = Math.abs((priceAfterSwap - priceBeforeSwap) / priceBeforeSwap) * 100;
    
    // Calculate fees
    const feeAmount = inputAmount * fee;
    const networkFee = this.networkFee;
    
    // Cost function: prioritize higher output, lower fees, lower price impact
    const cost = (1 / outputAmount) * (1 + fee) * (1 + priceImpact / 100) + networkFee;
    
    return {
      cost,
      fee: feeAmount + networkFee,
      outputAmount,
      rate: outputAmount / inputAmount,
      priceImpact
    };
  }

  /**
   * Get direct exchange rate between two tokens
   */
  getDirectRate(fromToken, toToken) {
    const poolId = `${fromToken}-${toToken}`;
    const reversePoolId = `${toToken}-${fromToken}`;
    
    if (this.liquidityPools[poolId]) {
      const pool = this.liquidityPools[poolId];
      return pool.reserveB / pool.reserveA;
    } else if (this.liquidityPools[reversePoolId]) {
      const pool = this.liquidityPools[reversePoolId];
      return pool.reserveA / pool.reserveB;
    }
    
    return 0;
  }

  /**
   * Calculate total slippage for multi-hop route
   */
  calculateTotalSlippage(steps) {
    return steps.reduce((total, step) => total + step.priceImpact, 0);
  }

  /**
   * Compare multiple routes and return best options
   */
  findMultipleRoutes(fromToken, toToken, amount, maxRoutes = 3) {
    const routes = [];
    
    // Direct route
    const directRoute = this.findOptimalRoute(fromToken, toToken, amount);
    if (directRoute.path.length > 0) {
      routes.push({ ...directRoute, type: 'direct' });
    }

    // Find alternative routes by temporarily disabling best pools
    const originalPools = JSON.parse(JSON.stringify(this.liquidityPools));
    
    for (let i = 1; i < maxRoutes && routes.length < maxRoutes; i++) {
      // Disable pools used in previous routes
      routes.forEach(route => {
        route.steps.forEach(step => {
          if (this.liquidityPools[step.pool]) {
            this.liquidityPools[step.pool].active = false;
          }
        });
      });

      const alternativeRoute = this.findOptimalRoute(fromToken, toToken, amount);
      if (alternativeRoute.path.length > 0 && alternativeRoute.outputAmount > 0) {
        routes.push({ ...alternativeRoute, type: `alternative_${i}` });
      }

      // Restore pools
      this.liquidityPools = JSON.parse(JSON.stringify(originalPools));
    }

    // Sort by efficiency
    return routes.sort((a, b) => b.efficiency - a.efficiency);
  }

  /**
   * Get real-time market data for tokens
   */
  getMarketData(tokenSymbol) {
    const token = this.tokens[tokenSymbol];
    if (!token) return null;

    // Simulate real market data
    const basePrice = this.getTokenPrice(tokenSymbol);
    
    return {
      symbol: tokenSymbol,
      name: token.name,
      price: basePrice,
      change24h: (Math.random() - 0.5) * 20, // -10% to +10%
      volume24h: this.getTotalVolume(tokenSymbol),
      marketCap: basePrice * this.getCirculatingSupply(tokenSymbol),
      liquidity: this.getTotalLiquidity(tokenSymbol)
    };
  }

  /**
   * Helper methods for market data
   */
  getTokenPrice(symbol) {
    const prices = {
      'XLM': 0.12,
      'USDC': 1.00,
      'BTC': 43000,
      'ETH': 2500,
      'BNB': 240
    };
    return prices[symbol] || 0;
  }

  getTotalVolume(symbol) {
    let totalVolume = 0;
    Object.values(this.liquidityPools).forEach(pool => {
      if (pool.tokenA === symbol || pool.tokenB === symbol) {
        totalVolume += pool.volume24h;
      }
    });
    return totalVolume;
  }

  getTotalLiquidity(symbol) {
    let totalLiquidity = 0;
    Object.values(this.liquidityPools).forEach(pool => {
      if (pool.tokenA === symbol) {
        totalLiquidity += pool.reserveA * this.getTokenPrice(symbol);
      } else if (pool.tokenB === symbol) {
        totalLiquidity += pool.reserveB * this.getTokenPrice(symbol);
      }
    });
    return totalLiquidity;
  }

  getCirculatingSupply(symbol) {
    const supplies = {
      'XLM': 50000000000, // 50B XLM
      'USDC': 30000000000, // 30B USDC
      'BTC': 19700000,     // 19.7M BTC
      'ETH': 120000000,    // 120M ETH
      'BNB': 150000000     // 150M BNB
    };
    return supplies[symbol] || 0;
  }

  /**
   * Estimate gas/network fees for route execution
   */
  estimateExecutionCost(route) {
    const baseCost = this.networkFee * route.steps.length;
    const complexityCost = route.steps.length > 2 ? this.networkFee * 0.5 : 0;
    
    return {
      networkFees: baseCost + complexityCost,
      totalSteps: route.steps.length,
      estimatedTime: route.steps.length * 5, // seconds
      gasLimit: route.steps.length * 100000 // estimated gas units
    };
  }
}

// Export singleton instance
export const swapRouter = new EnhancedSwapRouter();
export default swapRouter; 
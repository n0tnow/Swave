import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Import contract service dynamically
    const { default: contractService } = await import('../../lib/contractService');
    
    // Get user address from query params
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('address') || 'GDJK...7X3A';
    
    // Try to get real user analytics from contracts
    const userAnalytics = await contractService.getUserAnalytics(userAddress);
    
    // Load additional contract data for analytics
    const [
      creditScore,
      creditProfile,
      creditScoreBreakdown,
      riskLevel,
      collateralPosition,
      collateralStats,
      allTokenPrices,
      feeConfig,
      userTier,
      storageStats,
      isLiquidationRequired
    ] = await Promise.all([
      contractService.getCreditScore(userAddress),
      contractService.getCreditProfile(userAddress),
      contractService.getCreditScoreBreakdown(userAddress),
      contractService.getRiskLevel(userAddress),
      contractService.getCollateralPosition(userAddress),
      contractService.getCollateralGlobalStats(),
      contractService.getAllTokenPrices(),
      contractService.getFeeConfiguration(),
      contractService.getUserTier(userAddress),
      contractService.getStorageStats(),
      contractService.isLiquidationRequired(userAddress)
    ]);

    // Enhance analytics with additional contract data
    const enhancedAnalytics = {
      ...userAnalytics,
      creditScore: creditScore || userAnalytics?.creditScore,
      creditProfile: creditProfile || userAnalytics?.creditProfile,
      creditScoreBreakdown: creditScoreBreakdown || userAnalytics?.creditScoreBreakdown,
      riskLevel: riskLevel || userAnalytics?.riskLevel,
      collateralPosition: collateralPosition || userAnalytics?.collateralPosition,
      collateralStats: collateralStats || userAnalytics?.collateralStats,
      tokenPrices: allTokenPrices || userAnalytics?.tokenPrices,
      feeConfig: feeConfig || userAnalytics?.feeConfig,
      userTier: userTier || userAnalytics?.userTier,
      storageStats: storageStats || userAnalytics?.storageStats,
      isLiquidationRequired: isLiquidationRequired || userAnalytics?.isLiquidationRequired
    };
    
    if (enhancedAnalytics) {
      // Check if user has portfolio analytics data (transactions, liquidity positions)
      const hasPortfolioData = enhancedAnalytics.portfolio && enhancedAnalytics.portfolio.assets;
      const hasTransactionHistory = enhancedAnalytics.recentTransactions && enhancedAnalytics.recentTransactions.length > 0;
      const hasLiquidityPositions = enhancedAnalytics.liquidityPositions && enhancedAnalytics.liquidityPositions.length > 0;
      
      // If user has contract data but missing portfolio analytics, add empty arrays
      if (!hasPortfolioData || !hasTransactionHistory || !hasLiquidityPositions) {
        console.log(`User ${userAddress} has contract data but missing portfolio analytics`);
        return NextResponse.json({
          ...enhancedAnalytics,
          // Add empty portfolio data to indicate user exists but has no transactions
          portfolio: hasPortfolioData ? enhancedAnalytics.portfolio : null,
          recentTransactions: hasTransactionHistory ? enhancedAnalytics.recentTransactions : [],
          liquidityPositions: hasLiquidityPositions ? enhancedAnalytics.liquidityPositions : [],
          performance: enhancedAnalytics.performance || null
        });
      }
      
      return NextResponse.json(enhancedAnalytics);
    }
    
    // Fallback to enhanced simulated data if contract calls fail
    const fallbackData = {
      address: userAddress,
      creditScore: {
        current: 742,
        breakdown: {
          walletAge: 18,
          txCount: 16,
          assetDiversity: 14,
          swapVolume: 19,
          behavioral: 15
        },
        history: [
          { date: '2024-01-01', score: 680 },
          { date: '2024-01-15', score: 705 },
          { date: '2024-02-01', score: 720 },
          { date: '2024-02-15', score: 742 }
        ]
      },
      collateralPositions: [
        { 
          asset: 'XLM', 
          amount: 50000, 
          valueUSD: 5000, 
          ltv: 65, 
          status: 'Active',
          liquidationPrice: 0.08,
          currentPrice: 0.10
        },
        { 
          asset: 'USDC', 
          amount: 2500, 
          valueUSD: 2500, 
          ltv: 70, 
          status: 'Active',
          liquidationPrice: 0.95,
          currentPrice: 1.00
        }
      ],
      loanHistory: [
        { 
          id: 'loan_001',
          amount: 3000, 
          interestRate: 8.5, 
          status: 'Repaid', 
          daysActive: 45,
          totalRepaid: 3106.25,
          repaidDate: '2024-01-15'
        },
        { 
          id: 'loan_002',
          amount: 1500, 
          interestRate: 7.2, 
          status: 'Active', 
          daysActive: 12,
          nextPayment: 89.50,
          dueDate: '2024-03-01'
        }
      ],
      swapActivity: {
        totalVolume: 125000,
        transactionCount: 234,
        avgTransactionSize: 534,
        favoriteAssets: ['XLM', 'USDC', 'AQUA', 'yXLM'],
        recentSwaps: [
          { from: 'XLM', to: 'USDC', amount: 1000, timestamp: '2024-02-20T10:30:00Z' },
          { from: 'USDC', to: 'AQUA', amount: 500, timestamp: '2024-02-19T14:20:00Z' }
        ]
      },
      riskProfile: {
        level: 'Moderate',
        score: 7.2,
        factors: [
          { name: 'Diversification', score: 8.1, status: 'Good', description: 'Well diversified across 7 assets' },
          { name: 'Leverage Usage', score: 6.8, status: 'Moderate', description: 'Moderate leverage with 65% average LTV' },
          { name: 'Liquidation Risk', score: 7.5, status: 'Low', description: 'Safe collateral ratios maintained' }
        ]
      },
      portfolio: {
        totalValue: 12450,
        totalGainLoss: 1450,
        totalGainLossPercentage: 13.2,
        assets: [
          { symbol: 'XLM', amount: 45000, value: 5400, percentage: 43.4 },
          { symbol: 'USDC', amount: 3500, value: 3500, percentage: 28.1 },
          { symbol: 'AQUA', amount: 125000, value: 2250, percentage: 18.1 },
          { symbol: 'yXLM', amount: 8200, value: 1300, percentage: 10.4 }
        ]
      },
      marketComparison: {
        portfolioReturn: 13.2,
        portfolioSharpe: 1.85,
        portfolioVolatility: 18.5,
        benchmarks: [
          {
            name: 'DeFi Index',
            return: 8.7,
            sharpe: 1.12,
            volatility: 24.2,
            color: '#4caf50'
          },
          {
            name: 'Stellar Average',
            return: 6.3,
            sharpe: 0.95,
            volatility: 21.8,
            color: '#ff9800'
          },
          {
            name: 'Market Leaders',
            return: 11.5,
            sharpe: 1.45,
            volatility: 19.7,
            color: '#2196f3'
          }
        ]
      },
      activity: {
        totalTransactions: 247,
        successRate: '99.8%',
        lastActivity: '2 hours ago',
        avgGasFee: '0.001 XLM',
        peakHours: '14:00 - 18:00 UTC',
        peakHourVolume: 68,
        preferredAssets: 'XLM, USDC, AQUA',
        assetConcentration: 75,
        avgTradeSize: 'Medium ($100-1000)',
        tradeSizeDistribution: 58,
        tradingFrequency: 'Daily Trader',
        frequencyScore: 82
      },
      tradingPatterns: {
        hourlyVolume: [
          { time: '00:00', volume: 5, value: 5 },
          { time: '04:00', volume: 8, value: 8 },
          { time: '08:00', volume: 25, value: 25 },
          { time: '12:00', volume: 45, value: 45 },
          { time: '16:00', volume: 85, value: 85 },
          { time: '20:00', volume: 35, value: 35 },
        ],
        insights: [
          {
            pattern: 'Peak Hours',
            description: '14:00 - 18:00 UTC',
            percentage: 68,
            color: '#4caf50'
          },
          {
            pattern: 'Preferred Assets',
            description: 'XLM, USDC, AQUA',
            percentage: 75,
            color: '#2196f3'
          },
          {
            pattern: 'Trade Size',
            description: 'Medium ($100-1000)',
            percentage: 58,
            color: '#ff9800'
          },
          {
            pattern: 'Frequency',
            description: 'Daily Trader',
            percentage: 82,
            color: '#9c27b0'
          }
        ]
      },
      gasAnalytics: {
        avgGasFee: '0.001 XLM',
        avgGasFeeChange: -5.2,
        totalGasSpent: '0.245 XLM',
        totalGasChange: 12.8,
        gasEfficiency: '94.2%',
        efficiencyChange: 2.1,
        peakGasTime: '16:00 UTC',
        metrics: [
          {
            label: 'Average Gas Fee',
            value: '0.001 XLM',
            change: -5.2,
            color: '#4caf50'
          },
          {
            label: 'Total Gas Spent',
            value: '0.245 XLM',
            change: 12.8,
            color: '#2196f3'
          },
          {
            label: 'Gas Efficiency',
            value: '94.2%',
            change: 2.1,
            color: '#4caf50'
          },
          {
            label: 'Peak Gas Time',
            value: '16:00 UTC',
            change: 0,
            color: '#ff9800'
          }
        ],
        optimizationTips: [
          {
            title: 'Optimal Time',
            description: 'Trade during 02:00-06:00 UTC for 20% lower fees',
            icon: 'AccessTime',
            color: '#4caf50',
            savings: '20%'
          },
          {
            title: 'Batch Operations',
            description: 'Combine multiple actions to save up to 15% gas',
            icon: 'Flash',
            color: '#2196f3',
            savings: '15%'
          },
          {
            title: 'Network Activity',
            description: 'Monitor network congestion for better timing',
            icon: 'TrendingUp',
            color: '#ff9800',
            savings: '10%'
          }
        ]
      }
    };
    
    return NextResponse.json(fallbackData);
    
  } catch (error) {
    console.error('Error in user-analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user analytics', details: error.message },
      { status: 500 }
    );
  }
} 
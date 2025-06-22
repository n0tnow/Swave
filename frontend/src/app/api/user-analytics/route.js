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
    
    if (userAnalytics) {
      return NextResponse.json(userAnalytics);
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
// Stellar Wallet Integration Service
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  ALBEDO_ID,
  XBULL_ID,
  RABET_ID,
  LOBSTR_ID
} from '@creit.tech/stellar-wallets-kit';

class StellarWalletService {
  constructor() {
    this.walletKit = null;
    this.connectedWallet = null;
    this.userAddress = null;
    this.networkConfig = {
      network: WalletNetwork.TESTNET,
      networkPassphrase: 'Test SDF Network ; September 2015',
      horizonUrl: 'https://horizon-testnet.stellar.org',
      sorobanRpcUrl: 'https://soroban-testnet.stellar.org'
    };
    
    // Connection state
    this.isConnected = false;
    this.connectionListeners = [];
    
    // Initialize only in browser environment
    if (typeof window !== 'undefined') {
      this.initializeWalletKit();
      
      // Restore connection after a short delay to ensure DOM is ready
      setTimeout(() => {
        this.restoreConnectionFromStorage();
      }, 100);
    }
  }

  // Restore connection from localStorage
  async restoreConnectionFromStorage() {
    try {
      const savedConnection = localStorage.getItem('swave_wallet_connection');
      if (savedConnection) {
        const connectionData = JSON.parse(savedConnection);
        
        // Verify the connection is still valid
        if (connectionData.address && connectionData.wallet) {
          console.log('🔄 Attempting to restore wallet connection...');
          
          // Set the wallet if available
          try {
            await this.setWallet(connectionData.wallet.id);
            
            // Verify the address is still accessible
            const currentAddress = await this.getAddress();
            
            if (currentAddress.address === connectionData.address) {
              // Connection restored successfully
              this.connectedWallet = connectionData.wallet;
              this.userAddress = connectionData.address;
              this.isConnected = true;
              
              // Get fresh balance
              const balance = await this.getBalance();
              
              // Notify listeners
              this.notifyConnectionListeners({
                type: 'connected',
                wallet: connectionData.wallet,
                address: connectionData.address,
                balance
              });
              
              console.log('✅ Wallet connection restored successfully');
            } else {
              // Address mismatch, clear stored data
              this.clearStoredConnection();
            }
          } catch (error) {
            console.log('⚠️ Could not restore wallet connection:', error.message);
            this.clearStoredConnection();
          }
        }
      }
    } catch (error) {
      console.error('❌ Error restoring connection:', error);
      this.clearStoredConnection();
    }
  }

  // Save connection to localStorage
  saveConnectionToStorage(wallet, address) {
    try {
      const connectionData = {
        wallet,
        address,
        timestamp: Date.now()
      };
      localStorage.setItem('swave_wallet_connection', JSON.stringify(connectionData));
    } catch (error) {
      console.error('❌ Failed to save connection to storage:', error);
    }
  }

  // Clear stored connection
  clearStoredConnection() {
    try {
      localStorage.removeItem('swave_wallet_connection');
    } catch (error) {
      console.error('❌ Failed to clear stored connection:', error);
    }
  }

  // Initialize Stellar Wallets Kit
  initializeWalletKit() {
    if (typeof window === 'undefined') {
      console.warn('⚠️ Wallet Kit can only be initialized in browser environment');
      return;
    }

    try {
      this.walletKit = new StellarWalletsKit({
        network: this.networkConfig.network,
        selectedWalletId: FREIGHTER_ID, // Default wallet
        modules: allowAllModules()
      });

      console.log('🔗 Stellar Wallets Kit initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Wallet Kit:', error);
      // Don't throw error to prevent SSR issues
    }
  }

  // Get available wallets
  getAvailableWallets() {
    if (typeof window === 'undefined') {
      return [];
    }

    const wallets = [
      {
        id: FREIGHTER_ID,
        name: 'Freighter',
        icon: '🚀',
        description: 'Browser extension wallet by SDF',
        isInstalled: this.isFreighterInstalled()
      },
      {
        id: ALBEDO_ID,
        name: 'Albedo',
        icon: '⭐',
        description: 'Web-based wallet',
        isInstalled: true // Always available
      },
      {
        id: XBULL_ID,
        name: 'xBull',
        icon: '🐂',
        description: 'Multi-platform wallet',
        isInstalled: typeof window !== 'undefined' && window.xBullSDK
      },
      {
        id: RABET_ID,
        name: 'Rabet',
        icon: '🦊',
        description: 'Browser extension wallet',
        isInstalled: typeof window !== 'undefined' && window.rabet
      },
      {
        id: LOBSTR_ID,
        name: 'Lobstr',
        icon: '🦞',
        description: 'Mobile and web wallet',
        isInstalled: true // Via WalletConnect
      }
    ];

    return wallets;
  }

  // Check if Freighter is installed
  isFreighterInstalled() {
    if (typeof window === 'undefined') return false;
    
    // Simplified check - just look for the main indicator
    return !!(window.freighter);
  }

  // Connect to wallet with improved error handling
  async connectWallet() {
    if (!this.walletKit) {
      throw new Error('Wallet Kit not initialized. Please refresh the page.');
    }

    return new Promise((resolve, reject) => {
      let isResolved = false; // Track if promise is already resolved
      
      try {
        this.walletKit.openModal({
          onWalletSelected: async (option) => {
            if (isResolved) return; // Prevent multiple resolutions
            
            try {
              await this.setWallet(option.id);
              const { address } = await this.getAddress();
              
              this.connectedWallet = option;
              this.userAddress = address;
              this.isConnected = true;
              
              // Save connection to localStorage
              this.saveConnectionToStorage(option, address);
              
              // Get balance
              const balance = await this.getBalance();
              
              // Notify listeners
              this.notifyConnectionListeners({
                type: 'connected',
                wallet: option,
                address,
                balance
              });

              console.log(`✅ Connected to ${option.name}: ${address}`);
              isResolved = true;
              resolve({
                wallet: option,
                address,
                balance
              });
            } catch (error) {
              if (isResolved) return;
              
              console.error('❌ Connection failed:', error);
              
              // Provide user-friendly error messages
              let userMessage = error.message;
              if (error.message.includes('not installed') || error.message.includes('not available')) {
                userMessage = `${option.name} wallet is not installed. Please install the wallet extension and try again.`;
              } else if (error.message.includes('rejected') || error.message.includes('denied')) {
                userMessage = 'Connection was rejected. Please try again and approve the connection.';
              }
              
              isResolved = true;
              reject(new Error(userMessage));
            }
          },
          onClosed: (error) => {
            if (isResolved) return; // Don't handle if already resolved
            
            // Only treat as error if there's a real connection error
            if (error && error.message && 
                !error.message.includes('Modal closed') && 
                !error.message.includes('closed by user')) {
              console.error('❌ Wallet modal closed with error:', error);
              isResolved = true;
              reject(new Error('Failed to connect wallet. Please try again.'));
            } else {
              console.log('ℹ️ Wallet modal closed by user');
              // Resolve with null to indicate cancellation
              isResolved = true;
              resolve(null);
            }
          },
          modalTitle: 'Connect to SWAVE',
          notAvailableText: 'Install Wallet Extension'
        });
      } catch (error) {
        console.error('❌ Failed to open wallet modal:', error);
        reject(new Error('Failed to open wallet selection. Please refresh and try again.'));
      }
    });
  }

  // Set specific wallet
  async setWallet(walletId) {
    if (!this.walletKit) {
      throw new Error('Wallet Kit not initialized');
    }

    try {
      await this.walletKit.setWallet(walletId);
      console.log(`🔄 Wallet set to: ${walletId}`);
    } catch (error) {
      console.error('❌ Failed to set wallet:', error);
      throw error;
    }
  }

  // Get user address
  async getAddress() {
    if (!this.walletKit) {
      throw new Error('Wallet Kit not initialized');
    }

    try {
      const result = await this.walletKit.getAddress();
      return result;
    } catch (error) {
      console.error('❌ Failed to get address:', error);
      throw error;
    }
  }

  // Get account balance
  async getBalance() {
    if (!this.userAddress) {
      throw new Error('No connected wallet');
    }

    try {
      const response = await fetch(
        `${this.networkConfig.horizonUrl}/accounts/${this.userAddress}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }

      const accountData = await response.json();
      const xlmBalance = accountData.balances.find(
        balance => balance.asset_type === 'native'
      );

      return {
        xlm: parseFloat(xlmBalance?.balance || '0'),
        assets: accountData.balances.filter(balance => balance.asset_type !== 'native')
      };
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      return { xlm: 0, assets: [] };
    }
  }

  // Sign transaction
  async signTransaction(xdr, options = {}) {
    if (!this.isConnected || !this.walletKit) {
      throw new Error('No wallet connected');
    }

    try {
      const result = await this.walletKit.signTransaction(xdr, {
        address: this.userAddress,
        networkPassphrase: this.networkConfig.networkPassphrase,
        ...options
      });

      console.log('✅ Transaction signed successfully');
      return result;
    } catch (error) {
      console.error('❌ Transaction signing failed:', error);
      throw error;
    }
  }

  // Submit transaction to network
  async submitTransaction(signedXdr) {
    try {
      const response = await fetch(`${this.networkConfig.horizonUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `tx=${encodeURIComponent(signedXdr)}`
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Transaction failed: ${errorData.title}`);
      }

      const result = await response.json();
      console.log('✅ Transaction submitted successfully:', result.hash);
      return result;
    } catch (error) {
      console.error('❌ Transaction submission failed:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnect() {
    this.connectedWallet = null;
    this.userAddress = null;
    this.isConnected = false;
    
    // Clear stored connection
    this.clearStoredConnection();
    
    // Notify listeners
    this.notifyConnectionListeners({
      type: 'disconnected'
    });

    console.log('🔌 Wallet disconnected');
  }

  // Connection event listeners
  onConnectionChange(callback) {
    this.connectionListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.connectionListeners.indexOf(callback);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  notifyConnectionListeners(event) {
    this.connectionListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ Connection listener error:', error);
      }
    });
  }

  // Check if user has sufficient balance for transaction
  async checkBalance(requiredAmount, asset = 'XLM') {
    const balance = await this.getBalance();
    
    if (asset === 'XLM') {
      const availableBalance = balance.xlm - 1; // Reserve 1 XLM for account minimum
      return availableBalance >= requiredAmount;
    } else {
      const assetBalance = balance.assets.find(
        a => a.asset_code === asset
      );
      return assetBalance ? parseFloat(assetBalance.balance) >= requiredAmount : false;
    }
  }

  // Get wallet connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      wallet: this.connectedWallet,
      address: this.userAddress,
      network: this.networkConfig.network,
      balance: null // Balance will be fetched separately to avoid blocking
    };
  }

  // Get connection status with balance
  async getConnectionStatusWithBalance() {
    const status = this.getConnectionStatus();
    if (status.isConnected) {
      try {
        status.balance = await this.getBalance();
      } catch (error) {
        console.error('❌ Failed to get balance:', error);
        status.balance = { xlm: 0, assets: [] };
      }
    }
    return status;
  }

  // Switch network
  async switchNetwork(network) {
    this.networkConfig.network = network;
    
    if (network === WalletNetwork.PUBLIC) {
      this.networkConfig.networkPassphrase = 'Public Global Stellar Network ; September 2015';
      this.networkConfig.horizonUrl = 'https://horizon.stellar.org';
      this.networkConfig.sorobanRpcUrl = 'https://soroban-rpc.stellar.org';
    } else {
      this.networkConfig.networkPassphrase = 'Test SDF Network ; September 2015';
      this.networkConfig.horizonUrl = 'https://horizon-testnet.stellar.org';
      this.networkConfig.sorobanRpcUrl = 'https://soroban-testnet.stellar.org';
    }

    // Reinitialize wallet kit with new network
    if (typeof window !== 'undefined') {
      this.initializeWalletKit();
    }
    
    console.log(`🔄 Switched to ${network} network`);
  }

  // Get transaction history
  async getTransactionHistory(limit = 10) {
    if (!this.userAddress) {
      throw new Error('No connected wallet');
    }

    try {
      const response = await fetch(
        `${this.networkConfig.horizonUrl}/accounts/${this.userAddress}/transactions?limit=${limit}&order=desc`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      const data = await response.json();
      return data.records.map(tx => ({
        id: tx.id,
        hash: tx.hash,
        timestamp: tx.created_at,
        operationCount: tx.operation_count,
        successful: tx.successful,
        fee: tx.fee_charged,
        memo: tx.memo
      }));
    } catch (error) {
      console.error('❌ Failed to get transaction history:', error);
      return [];
    }
  }

  // Validate Stellar address
  isValidStellarAddress(address) {
    try {
      return address.length === 56 && address.charAt(0) === 'G';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const walletService = new StellarWalletService();
export default walletService; 
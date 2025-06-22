#![no_std]

//! # SWAVE Simplified Swap Contract
//! 
//! Simplified swap execution contract focusing on:
//! - Basic token swaps
//! - Liquidity validation  
//! - Fee calculation
//! - Event emission
//! 
//! Route calculation and optimization is handled off-chain by frontend.

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, contractmeta,
    Address, Env, Vec, String, Symbol,
};

// Contract metadata
contractmeta!(
    key = "Description",
    val = "SWAVE Simplified Swap Contract - On-chain Execution Only"
);

contractmeta!(key = "Version", val = "3.0.0");

/// Swap constants
const BASE_FEE_RATE: u32 = 30;              // 0.3% base fee in basis points
const MAX_SLIPPAGE: u32 = 1000;             // 10% max slippage
const MIN_SWAP_AMOUNT: i128 = 1_000_000;    // 1 XLM minimum

/// Contract errors
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum SwapError {
    InvalidAmount = 1,
    InsufficientBalance = 2, 
    SlippageExceeded = 3,
    InvalidRoute = 4,
    SwapFailed = 5,
    Unauthorized = 6,
    TokenNotSupported = 7,
    PoolNotFound = 8,
    InsufficientLiquidity = 9,
    InvalidSlippage = 10,
}

/// Simple token info for swaps
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Token {
    /// Token contract address (None for native XLM)
    pub address: Option<Address>,
    /// Token symbol
    pub symbol: String,
    /// Token decimals
    pub decimals: u32,
}

/// Swap route step (calculated off-chain)
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SwapStep {
    /// Input token
    pub token_in: Token,
    /// Output token
    pub token_out: Token,
    /// Pool/exchange identifier
    pub pool_id: String,
    /// Expected amount in
    pub amount_in: i128,
    /// Expected amount out
    pub amount_out: i128,
    /// Fee for this step
    pub fee: i128,
}

/// Pre-calculated swap route from frontend
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SwapRoute {
    /// Swap steps in order
    pub steps: Vec<SwapStep>,
    /// Total input amount
    pub total_amount_in: i128,
    /// Total expected output
    pub total_amount_out: i128,
    /// Total fees
    pub total_fees: i128,
    /// Expected slippage (basis points)
    pub expected_slippage: u32,
    /// Route expiry timestamp
    pub expires_at: u64,
}

/// Swap execution request
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SwapRequest {
    /// User executing the swap
    pub user: Address,
    /// Pre-calculated route from frontend
    pub route: SwapRoute,
    /// Maximum slippage tolerance (basis points)
    pub max_slippage: u32,
    /// Minimum amount out (slippage protection)
    pub min_amount_out: i128,
    /// Deadline timestamp
    pub deadline: u64,
}

/// Swap execution result
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SwapResult {
    /// Actual amount received
    pub amount_out: i128,
    /// Actual fees paid
    pub fees_paid: i128,
    /// Actual slippage experienced
    pub actual_slippage: u32,
    /// Execution timestamp
    pub executed_at: u64,
}

/// Liquidity pool info
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Pool {
    /// Pool identifier
    pub id: String,
    /// Token A
    pub token_a: Token,
    /// Token B
    pub token_b: Token,
    /// Reserve A
    pub reserve_a: i128,
    /// Reserve B
    pub reserve_b: i128,
    /// Pool fee (basis points)
    pub fee: u32,
    /// Pool enabled
    pub enabled: bool,
}

/// Storage keys
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    /// Contract admin
    Admin,
    /// Pool data
    Pool(String),
    /// Supported tokens
    Token(String),
    /// Swap history
    SwapHistory(Address),
    /// Configuration
    Config,
}

/// Contract configuration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Config {
    /// Base fee rate
    pub base_fee_rate: u32,
    /// Maximum slippage allowed
    pub max_slippage: u32,
    /// Minimum swap amount
    pub min_swap_amount: i128,
    /// Contract enabled
    pub enabled: bool,
}

#[contract]
pub struct SwapContract;

#[contractimpl]
impl SwapContract {
    /// Initialize the contract
    pub fn initialize(
        env: Env,
        admin: Address,
    ) -> Result<(), SwapError> {
        admin.require_auth();
        
        // Set admin
        env.storage().persistent().set(&DataKey::Admin, &admin);
        
        // Set default config
        let config = Config {
            base_fee_rate: BASE_FEE_RATE,
            max_slippage: MAX_SLIPPAGE,
            min_swap_amount: MIN_SWAP_AMOUNT,
            enabled: true,
        };
        env.storage().persistent().set(&DataKey::Config, &config);
        
        Ok(())
    }

    /// Execute a pre-calculated swap route
    pub fn execute_swap(
        env: Env,
        request: SwapRequest,
    ) -> Result<SwapResult, SwapError> {
        // Validate request
        Self::validate_swap_request(&env, &request)?;
        
        request.user.require_auth();
        
        let config = Self::get_config(env.clone())?;
        if !config.enabled {
            return Err(SwapError::SwapFailed);
        }
        
        // Check deadline
        let current_time = env.ledger().timestamp();
        if current_time > request.deadline {
            return Err(SwapError::SwapFailed);
        }
        
        // Check route expiry
        if current_time > request.route.expires_at {
            return Err(SwapError::InvalidRoute);
        }
        
        // Execute swap steps
        let mut actual_amount_out = 0i128;
        let mut total_fees_paid = 0i128;
        
        for step in request.route.steps.iter() {
            let step_result = Self::execute_swap_step(&env, &request.user, &step)?;
            actual_amount_out += step_result.0;
            total_fees_paid += step_result.1;
        }
        
        // Check slippage protection
        if actual_amount_out < request.min_amount_out {
            return Err(SwapError::SlippageExceeded);
        }
        
        // Calculate actual slippage
        let actual_slippage = Self::calculate_slippage(
            request.route.total_amount_out,
            actual_amount_out,
        )?;
        
        // Check maximum slippage
        if actual_slippage > request.max_slippage {
            return Err(SwapError::SlippageExceeded);
        }
        
        let result = SwapResult {
            amount_out: actual_amount_out,
            fees_paid: total_fees_paid,
            actual_slippage,
            executed_at: current_time,
        };
        
        // Record swap history
        Self::record_swap_history(&env, &request.user, &result)?;
        
        // Emit swap event
        env.events().publish(
            (Symbol::new(&env, "swap_executed"),),
            (request.user.clone(), result.clone())
        );
        
        Ok(result)
    }
    
    /// Add liquidity pool
    pub fn add_pool(
        env: Env,
        caller: Address,
        pool: Pool,
    ) -> Result<(), SwapError> {
        let admin = Self::get_admin(&env)?;
        if caller != admin {
            return Err(SwapError::Unauthorized);
        }
        
        caller.require_auth();
        
        env.storage().persistent().set(&DataKey::Pool(pool.id.clone()), &pool);
        
        Ok(())
    }
    
    /// Get pool information
    pub fn get_pool(
        env: Env,
        pool_id: String,
    ) -> Result<Pool, SwapError> {
        env.storage()
            .persistent()
            .get(&DataKey::Pool(pool_id))
            .ok_or(SwapError::PoolNotFound)
    }
    
    /// Get configuration
    pub fn get_config(
        env: Env,
    ) -> Result<Config, SwapError> {
        env.storage()
            .persistent()
            .get(&DataKey::Config)
            .ok_or(SwapError::SwapFailed)
    }
    
    /// Update configuration (admin only)
    pub fn update_config(
        env: Env,
        caller: Address,
        config: Config,
    ) -> Result<(), SwapError> {
        let admin = Self::get_admin(&env)?;
        if caller != admin {
            return Err(SwapError::Unauthorized);
        }
        
        caller.require_auth();
        env.storage().persistent().set(&DataKey::Config, &config);
        
        Ok(())
    }

    // Internal helper functions
    
    fn validate_swap_request(
        env: &Env,
        request: &SwapRequest,
    ) -> Result<(), SwapError> {
        let config = Self::get_config(env.clone())?;
        
        // Check minimum amount
        if request.route.total_amount_in < config.min_swap_amount {
            return Err(SwapError::InvalidAmount);
        }
        
        // Check slippage tolerance
        if request.max_slippage > config.max_slippage {
            return Err(SwapError::InvalidSlippage);
        }
        
        // Validate route has steps
        if request.route.steps.is_empty() {
            return Err(SwapError::InvalidRoute);
        }
        
        Ok(())
    }
    
    fn execute_swap_step(
        env: &Env,
        _user: &Address,
        step: &SwapStep,
    ) -> Result<(i128, i128), SwapError> {
        // Get pool info
        let pool = Self::get_pool(env.clone(), step.pool_id.clone())?;
        
        if !pool.enabled {
            return Err(SwapError::PoolNotFound);
        }
        
        // Validate pool tokens match step
        let valid_pair = (pool.token_a == step.token_in && pool.token_b == step.token_out) ||
                        (pool.token_b == step.token_in && pool.token_a == step.token_out);
        
        if !valid_pair {
            return Err(SwapError::InvalidRoute);
        }
        
        // Calculate actual output using AMM formula
        let actual_amount_out = Self::calculate_amm_output(
            step.amount_in,
            &pool,
            &step.token_in,
        )?;
        
        // Calculate fee
        let fee = (step.amount_in * pool.fee as i128) / 10000;
        
        // Execute token transfers (simplified - would integrate with token contracts)
        // This would call the actual token contract transfer functions
        
        Ok((actual_amount_out, fee))
    }
    
    fn calculate_amm_output(
        amount_in: i128,
        pool: &Pool,
        token_in: &Token,
    ) -> Result<i128, SwapError> {
        // Simple AMM formula: x * y = k
        let (reserve_in, reserve_out) = if pool.token_a == *token_in {
            (pool.reserve_a, pool.reserve_b)
        } else {
            (pool.reserve_b, pool.reserve_a)
        };
        
        if reserve_in == 0 || reserve_out == 0 {
            return Err(SwapError::InsufficientLiquidity);
        }
        
        // amount_out = (amount_in * reserve_out) / (reserve_in + amount_in)
        let amount_out = (amount_in * reserve_out) / (reserve_in + amount_in);
        
        if amount_out <= 0 {
            return Err(SwapError::InsufficientLiquidity);
        }
        
        Ok(amount_out)
    }
    
    fn calculate_slippage(
        expected: i128,
        actual: i128,
    ) -> Result<u32, SwapError> {
        if expected == 0 {
            return Ok(0);
        }
        
        let slippage = ((expected - actual).abs() * 10000) / expected;
        Ok(slippage as u32)
    }
    
    fn get_admin(env: &Env) -> Result<Address, SwapError> {
        env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .ok_or(SwapError::Unauthorized)
    }

    fn record_swap_history(
        env: &Env,
        user: &Address,
        result: &SwapResult,
    ) -> Result<(), SwapError> {
        let key = DataKey::SwapHistory(user.clone());
        let mut history: Vec<SwapResult> = env.storage()
            .persistent()
            .get(&key)
            .unwrap_or(Vec::new(env));
        
        history.push_back(result.clone());
        
        // Keep only last 100 swaps
        if history.len() > 100 {
            history.pop_front();
        }
        
        env.storage().persistent().set(&key, &history);
        Ok(())
    }
} 
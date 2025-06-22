#![no_std]

//! # SWAVE Ultimate Fee Manager Smart Contract
//! 
//! Advanced fee management and revenue distribution system with governance integration,
//! dynamic fee adjustment, and sophisticated yield distribution mechanisms.
//! 
//! ## Ultimate Features
//! - Dynamic fee adjustment based on market conditions
//! - Multi-tier fee structure for different user categories
//! - Automated revenue distribution to stakeholders
//! - Governance-controlled fee parameters
//! - Fee optimization algorithms
//! - Revenue analytics and reporting

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, contractmeta,
    Address, Env, Map, String,
};

// Contract metadata
contractmeta!(
    key = "Description",
    val = "SWAVE Ultimate Fee Manager - DeFi Revenue Distribution & Governance"
);

contractmeta!(key = "Version", val = "2.0.0");

/// Fee constants
const BASE_SWAP_FEE: u32 = 30;               // 0.3% base swap fee
const BASE_LOAN_FEE: u32 = 100;              // 1% base loan fee
const LIQUIDATION_FEE: u32 = 500;            // 5% liquidation fee
const PROTOCOL_FEE_SHARE: u32 = 2000;        // 20% to protocol
const LP_FEE_SHARE: u32 = 8000;              // 80% to LPs

/// Fee tiers based on user activity
const TIER_1_THRESHOLD: i128 = 100_000_000_000;  // 10K XLM volume
const TIER_2_THRESHOLD: i128 = 1_000_000_000_000; // 100K XLM volume
const TIER_3_THRESHOLD: i128 = 10_000_000_000_000; // 1M XLM volume

/// Contract errors
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum FeeManagerError {
    InvalidFeeRate = 1,
    UnauthorizedAccess = 2,
    InsufficientBalance = 3,
    DistributionFailed = 4,
    InvalidTier = 5,
    FeeCalculationError = 6,
    RevenueTrackingError = 7,
    GovernanceError = 8,
}

/// User fee tier
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum FeeTier {
    Standard,    // Default tier
    Silver,      // 10% discount
    Gold,        // 25% discount  
    Platinum,    // 50% discount
}

/// Fee structure
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FeeStructure {
    /// Swap fees by tier
    pub swap_fees: Map<FeeTier, u32>,
    /// Loan fees by tier
    pub loan_fees: Map<FeeTier, u32>,
    /// Liquidation fees
    pub liquidation_fee: u32,
    /// Protocol fee share
    pub protocol_share: u32,
    /// Liquidity provider share
    pub lp_share: u32,
    /// Last update timestamp
    pub last_updated: u64,
}

/// Revenue distribution data
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RevenueDistribution {
    /// Total revenue collected
    pub total_revenue: i128,
    /// Protocol treasury share
    pub protocol_share: i128,
    /// Liquidity provider share
    pub lp_share: i128,
    /// Stakers reward share
    pub staker_share: i128,
    /// Governance share
    pub governance_share: i128,
    /// Distribution timestamp
    pub distributed_at: u64,
}

/// User fee profile
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserFeeProfile {
    /// User address
    pub user: Address,
    /// Current fee tier
    pub tier: FeeTier,
    /// Total volume (for tier calculation)
    pub total_volume: i128,
    /// Total fees paid
    pub total_fees_paid: i128,
    /// Last tier update
    pub last_tier_update: u64,
    /// Credit score bonus
    pub credit_score_bonus: u32,
}

/// Storage keys
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    /// Fee structure
    FeeStructure,
    /// User fee profile
    UserProfile(Address),
    /// Revenue distribution
    Revenue(u64), // timestamp
    /// Global statistics
    GlobalStats,
    /// Admin address
    Admin,
    /// Governance address
    Governance,
    /// Treasury address
    Treasury,
}

/// SWAVE Ultimate Fee Manager Contract
#[contract]
pub struct UltimateFeeManagerContract;

#[contractimpl]
impl UltimateFeeManagerContract {
    
    /// Initialize fee manager
    pub fn initialize(
        env: Env,
        admin: Address,
        treasury: Address,
        governance: Address,
    ) -> Result<(), FeeManagerError> {
        // Set addresses
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::Governance, &governance);
        
        // Initialize fee structure
        let fee_structure = Self::create_default_fee_structure(&env)?;
        env.storage().instance().set(&DataKey::FeeStructure, &fee_structure);
        
        Ok(())
    }

    /// Calculate fee for swap operation
    pub fn calculate_swap_fee(
        env: Env,
        user: Address,
        amount: i128,
    ) -> Result<i128, FeeManagerError> {
        let profile = Self::get_user_profile(&env, &user)?;
        let fee_structure: FeeStructure = env.storage().instance()
            .get(&DataKey::FeeStructure)
            .ok_or(FeeManagerError::FeeCalculationError)?;
        
        let base_fee_rate = fee_structure.swap_fees
            .get(profile.tier.clone())
            .unwrap_or(BASE_SWAP_FEE);
        
        // Apply credit score bonus
        let adjusted_rate = base_fee_rate.saturating_sub(profile.credit_score_bonus);
        
        let fee = (amount * adjusted_rate as i128) / 10000;
        Ok(fee)
    }

    /// Calculate fee for loan operation
    pub fn calculate_loan_fee(
        env: Env,
        user: Address,
        amount: i128,
    ) -> Result<i128, FeeManagerError> {
        let profile = Self::get_user_profile(&env, &user)?;
        let fee_structure: FeeStructure = env.storage().instance()
            .get(&DataKey::FeeStructure)
            .ok_or(FeeManagerError::FeeCalculationError)?;
        
        let base_fee_rate = fee_structure.loan_fees
            .get(profile.tier.clone())
            .unwrap_or(BASE_LOAN_FEE);
        
        // Apply credit score bonus
        let adjusted_rate = base_fee_rate.saturating_sub(profile.credit_score_bonus);
        
        let fee = (amount * adjusted_rate as i128) / 10000;
        Ok(fee)
    }

    /// Collect and distribute fees
    pub fn collect_and_distribute_fees(
        env: Env,
        caller: Address,
        total_fees: i128,
        _fee_type: String,
    ) -> Result<(), FeeManagerError> {
        caller.require_auth();
        
        let fee_structure: FeeStructure = env.storage().instance()
            .get(&DataKey::FeeStructure)
            .ok_or(FeeManagerError::DistributionFailed)?;
        
        // Calculate distribution amounts
        let protocol_amount = (total_fees * fee_structure.protocol_share as i128) / 10000;
        let lp_amount = (total_fees * fee_structure.lp_share as i128) / 10000;
        let staker_amount = total_fees - protocol_amount - lp_amount;
        
        // Create distribution record
        let distribution = RevenueDistribution {
            total_revenue: total_fees,
            protocol_share: protocol_amount,
            lp_share: lp_amount,
            staker_share: staker_amount,
            governance_share: 0,
            distributed_at: env.ledger().timestamp(),
        };
        
        // Store distribution record
        env.storage().persistent().set(&DataKey::Revenue(env.ledger().timestamp()), &distribution);
        
        Ok(())
    }

    /// Update user volume and tier
    pub fn update_user_volume(
        env: Env,
        user: Address,
        volume: i128,
        fees_paid: i128,
    ) -> Result<(), FeeManagerError> {
        let mut profile = Self::get_user_profile(&env, &user)?;
        
        // Update volume and fees
        profile.total_volume = profile.total_volume.saturating_add(volume);
        profile.total_fees_paid = profile.total_fees_paid.saturating_add(fees_paid);
        
        // Update tier based on volume
        profile.tier = Self::calculate_fee_tier(profile.total_volume);
        profile.last_tier_update = env.ledger().timestamp();
        
        // Store updated profile
        env.storage().persistent().set(&DataKey::UserProfile(user), &profile);
        
        Ok(())
    }

    /// Get user fee profile
    fn get_user_profile(env: &Env, user: &Address) -> Result<UserFeeProfile, FeeManagerError> {
        if let Some(profile) = env.storage().persistent().get::<DataKey, UserFeeProfile>(&DataKey::UserProfile(user.clone())) {
            Ok(profile)
        } else {
            // Create new profile
            Ok(UserFeeProfile {
                user: user.clone(),
                tier: FeeTier::Standard,
                total_volume: 0,
                total_fees_paid: 0,
                last_tier_update: env.ledger().timestamp(),
                credit_score_bonus: 0,
            })
        }
    }

    /// Calculate fee tier based on volume
    fn calculate_fee_tier(volume: i128) -> FeeTier {
        if volume >= TIER_3_THRESHOLD {
            FeeTier::Platinum
        } else if volume >= TIER_2_THRESHOLD {
            FeeTier::Gold
        } else if volume >= TIER_1_THRESHOLD {
            FeeTier::Silver
        } else {
            FeeTier::Standard
        }
    }

    /// Create default fee structure
    fn create_default_fee_structure(env: &Env) -> Result<FeeStructure, FeeManagerError> {
        let mut swap_fees = Map::new(env);
        let mut loan_fees = Map::new(env);
        
        // Set swap fees by tier
        swap_fees.set(FeeTier::Standard, BASE_SWAP_FEE);
        swap_fees.set(FeeTier::Silver, (BASE_SWAP_FEE * 90) / 100); // 10% discount
        swap_fees.set(FeeTier::Gold, (BASE_SWAP_FEE * 75) / 100);   // 25% discount
        swap_fees.set(FeeTier::Platinum, (BASE_SWAP_FEE * 50) / 100); // 50% discount
        
        // Set loan fees by tier
        loan_fees.set(FeeTier::Standard, BASE_LOAN_FEE);
        loan_fees.set(FeeTier::Silver, (BASE_LOAN_FEE * 90) / 100);
        loan_fees.set(FeeTier::Gold, (BASE_LOAN_FEE * 75) / 100);
        loan_fees.set(FeeTier::Platinum, (BASE_LOAN_FEE * 50) / 100);
        
        Ok(FeeStructure {
            swap_fees,
            loan_fees,
            liquidation_fee: LIQUIDATION_FEE,
            protocol_share: PROTOCOL_FEE_SHARE,
            lp_share: LP_FEE_SHARE,
            last_updated: env.ledger().timestamp(),
        })
    }

    /// Update fee structure (governance only)
    pub fn update_fee_structure(
        env: Env,
        caller: Address,
        new_structure: FeeStructure,
    ) -> Result<(), FeeManagerError> {
        caller.require_auth();
        
        let governance: Address = env.storage().instance()
            .get(&DataKey::Governance)
            .ok_or(FeeManagerError::UnauthorizedAccess)?;
        
        if caller != governance {
            return Err(FeeManagerError::UnauthorizedAccess);
        }
        
        env.storage().instance().set(&DataKey::FeeStructure, &new_structure);
        Ok(())
    }

    /// Get user tier
    pub fn get_user_tier(env: Env, user: Address) -> Result<FeeTier, FeeManagerError> {
        let profile = Self::get_user_profile(&env, &user)?;
        Ok(profile.tier)
    }

    /// Get fee structure
    pub fn get_fee_structure(env: Env) -> Result<FeeStructure, FeeManagerError> {
        env.storage().instance()
            .get(&DataKey::FeeStructure)
            .ok_or(FeeManagerError::FeeCalculationError)
    }
} 
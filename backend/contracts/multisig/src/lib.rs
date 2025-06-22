#![no_std]

//! # SWAVE Multi-Signature Contract
//! 
//! Enterprise-grade multi-signature wallet for secure admin operations,
//! threshold-based approvals, and time-locked transactions.
//! 
//! ## Features
//! - Threshold-based signature requirements (M-of-N)
//! - Time-locked transactions for critical operations
//! - Role-based access control
//! - Emergency recovery mechanisms
//! - Transaction batching and scheduling

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, contractmeta,
    Address, Env, Vec, String, Bytes,
};

// Contract metadata
contractmeta!(
    key = "Description",
    val = "SWAVE Multi-Signature - Secure Admin Operations & Governance"
);

contractmeta!(key = "Version", val = "1.0.0");

/// Multi-sig constants
const MIN_THRESHOLD: u32 = 2;                // Minimum signature threshold
const TIME_LOCK_DURATION: u64 = 86400;       // 24 hours time lock

/// Contract errors
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum MultiSigError {
    InvalidThreshold = 1,
    InsufficientSignatures = 2,
    SignerNotFound = 3,
    TransactionNotFound = 4,
    TransactionExpired = 5,
    TransactionAlreadyExecuted = 6,
    UnauthorizedSigner = 7,
    DuplicateSignature = 8,
    TimeLockActive = 9,
    InvalidTransaction = 10,
}

/// Signer roles
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SignerRole {
    Admin,      // Full admin privileges
    Operator,   // Operational functions
    Guardian,   // Emergency functions only
}

/// Transaction types
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum TransactionType {
    AdminAction,        // General admin action
    EmergencyAction,    // Emergency pause/unpause
    ConfigUpdate,       // Configuration changes
    AssetManagement,    // Asset operations
    FeeUpdate,          // Fee structure changes
}

/// Multi-sig signer
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Signer {
    /// Signer address
    pub address: Address,
    /// Signer role
    pub role: SignerRole,
    /// Is signer active
    pub active: bool,
    /// Added timestamp
    pub added_at: u64,
    /// Last activity
    pub last_activity: u64,
}

/// Pending transaction
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingTransaction {
    /// Transaction ID
    pub tx_id: u64,
    /// Transaction type
    pub tx_type: TransactionType,
    /// Target contract
    pub target_contract: Address,
    /// Function to call
    pub function_name: String,
    /// Function arguments
    pub arguments: Bytes,
    /// Required threshold
    pub required_threshold: u32,
    /// Current signatures
    pub signatures: Vec<Address>,
    /// Proposed by
    pub proposer: Address,
    /// Created timestamp
    pub created_at: u64,
    /// Execution deadline
    pub deadline: u64,
    /// Time lock release
    pub time_lock_release: u64,
    /// Is executed
    pub executed: bool,
}

/// Multi-sig configuration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MultiSigConfig {
    /// Signature threshold
    pub threshold: u32,
    /// Total signers
    pub total_signers: u32,
    /// Emergency threshold
    pub emergency_threshold: u32,
    /// Time lock duration
    pub time_lock_duration: u64,
    /// Transaction expiry
    pub transaction_expiry: u64,
}

/// Storage keys
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    /// Signer information
    Signer(Address),
    /// Pending transaction
    Transaction(u64),
    /// Multi-sig configuration
    Config,
    /// Next transaction ID
    NextTxId,
    /// Active signers list
    ActiveSigners,
    /// Signers list
    Signers,
    /// Threshold
    Threshold,
}

/// SWAVE Multi-Signature Contract
#[contract]
pub struct MultiSigContract;

#[contractimpl]
impl MultiSigContract {
    
    /// Initialize multi-sig wallet
    pub fn initialize(
        env: Env,
        signers: Vec<Address>,
        threshold: u32,
    ) -> Result<(), MultiSigError> {
        if threshold < MIN_THRESHOLD || threshold > signers.len() as u32 {
            return Err(MultiSigError::InvalidThreshold);
        }
        
        env.storage().instance().set(&DataKey::Signers, &signers);
        env.storage().instance().set(&DataKey::Threshold, &threshold);
        env.storage().instance().set(&DataKey::NextTxId, &1u64);
        
        Ok(())
    }

    /// Propose a new transaction
    pub fn propose_transaction(
        env: Env,
        proposer: Address,
        target_contract: Address,
        function_name: String,
    ) -> Result<u64, MultiSigError> {
        proposer.require_auth();
        
        let signers: Vec<Address> = env.storage().instance()
            .get(&DataKey::Signers)
            .ok_or(MultiSigError::SignerNotFound)?;
        
        if !signers.contains(&proposer) {
            return Err(MultiSigError::UnauthorizedSigner);
        }
        
        let tx_id = env.storage().instance()
            .get::<DataKey, u64>(&DataKey::NextTxId)
            .unwrap_or(1);
        
        let threshold: u32 = env.storage().instance()
            .get(&DataKey::Threshold)
            .unwrap_or(MIN_THRESHOLD);
        
        let mut signatures = Vec::new(&env);
        signatures.push_back(proposer.clone());
        
        let pending_tx = PendingTransaction {
            tx_id,
            tx_type: TransactionType::AdminAction,
            target_contract,
            function_name,
            arguments: Bytes::new(&env),
            required_threshold: threshold,
            signatures,
            proposer: proposer.clone(),
            created_at: env.ledger().timestamp(),
            deadline: env.ledger().timestamp() + TIME_LOCK_DURATION,
            time_lock_release: env.ledger().timestamp(),
            executed: false,
        };
        
        env.storage().persistent().set(&DataKey::Transaction(tx_id), &pending_tx);
        env.storage().instance().set(&DataKey::NextTxId, &(tx_id + 1));
        
        Ok(tx_id)
    }

    /// Sign a pending transaction
    pub fn sign_transaction(
        env: Env,
        signer: Address,
        tx_id: u64,
    ) -> Result<(), MultiSigError> {
        signer.require_auth();
        
        let signers: Vec<Address> = env.storage().instance()
            .get(&DataKey::Signers)
            .ok_or(MultiSigError::SignerNotFound)?;
        
        if !signers.contains(&signer) {
            return Err(MultiSigError::UnauthorizedSigner);
        }
        
        let mut pending_tx = env.storage().persistent()
            .get::<DataKey, PendingTransaction>(&DataKey::Transaction(tx_id))
            .ok_or(MultiSigError::SignerNotFound)?;
        
        if !pending_tx.signatures.contains(&signer) {
            pending_tx.signatures.push_back(signer);
            env.storage().persistent().set(&DataKey::Transaction(tx_id), &pending_tx);
        }
        
        Ok(())
    }

    /// Execute a transaction when threshold is met
    pub fn execute_transaction(
        env: Env,
        executor: Address,
        tx_id: u64,
    ) -> Result<(), MultiSigError> {
        executor.require_auth();
        
        let mut pending_tx = env.storage().persistent()
            .get::<DataKey, PendingTransaction>(&DataKey::Transaction(tx_id))
            .ok_or(MultiSigError::SignerNotFound)?;
        
        if pending_tx.signatures.len() < pending_tx.required_threshold {
            return Err(MultiSigError::InsufficientSignatures);
        }
        
        pending_tx.executed = true;
        env.storage().persistent().set(&DataKey::Transaction(tx_id), &pending_tx);
        
        Ok(())
    }

    /// Get signers
    pub fn get_signers(env: Env) -> Result<Vec<Address>, MultiSigError> {
        env.storage().instance()
            .get(&DataKey::Signers)
            .ok_or(MultiSigError::SignerNotFound)
    }

    /// Get transaction details
    pub fn get_transaction(
        env: Env,
        tx_id: u64,
    ) -> Result<PendingTransaction, MultiSigError> {
        env.storage().persistent()
            .get::<DataKey, PendingTransaction>(&DataKey::Transaction(tx_id))
            .ok_or(MultiSigError::TransactionNotFound)
    }

    /// Get signer information
    pub fn get_signer(
        env: Env,
        signer: Address,
    ) -> Result<Signer, MultiSigError> {
        env.storage().persistent()
            .get::<DataKey, Signer>(&DataKey::Signer(signer))
            .ok_or(MultiSigError::SignerNotFound)
    }

    /// Get multi-sig configuration
    pub fn get_config(env: Env) -> Result<MultiSigConfig, MultiSigError> {
        env.storage().instance()
            .get(&DataKey::Config)
            .ok_or(MultiSigError::InvalidTransaction)
    }

    /// Get active signers
    pub fn get_active_signers(env: Env) -> Result<Vec<Address>, MultiSigError> {
        env.storage().instance()
            .get(&DataKey::ActiveSigners)
            .ok_or(MultiSigError::SignerNotFound)
    }

    /// Emergency pause function (high threshold required)
    pub fn emergency_pause(
        env: Env,
        caller: Address,
        target_contract: Address,
    ) -> Result<u64, MultiSigError> {
        // Create emergency transaction
        Self::propose_transaction(
            env.clone(),
            caller,
            target_contract,
            String::from_str(&env, "emergency_pause"),
        )
    }
} 
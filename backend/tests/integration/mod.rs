//! # SWAVE DeFi Platform Integration Tests
//! 
//! Comprehensive integration tests for all SWAVE smart contracts.
//! These tests verify the interaction between different contracts
//! and ensure the entire DeFi ecosystem works correctly.

use soroban_sdk::{testutils::Address as _, Address, Env};

// Test modules
pub mod credit_tests;
pub mod loan_tests;
pub mod collateral_tests;
pub mod swap_tests;
pub mod fee_tests;
pub mod liquidity_tests;

/// Common test utilities and helper functions
pub struct TestContext {
    pub env: Env,
    pub admin: Address,
    pub user1: Address,
    pub user2: Address,
    pub user3: Address,
}

impl TestContext {
    pub fn new() -> Self {
        let env = Env::default();
        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let user3 = Address::generate(&env);

        TestContext {
            env,
            admin,
            user1,
            user2,
            user3,
        }
    }
}

/// Common test constants
pub const TEST_LOAN_AMOUNT: i128 = 1_000_000_000; // 1000 XLM
pub const TEST_COLLATERAL_AMOUNT: i128 = 1_500_000_000; // 1500 XLM
pub const TEST_CREDIT_SCORE: u32 = 750;
pub const TEST_LOAN_DURATION: u64 = 2_592_000; // 30 days

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_context_creation() {
        let ctx = TestContext::new();
        assert_ne!(ctx.admin, ctx.user1);
        assert_ne!(ctx.user1, ctx.user2);
        assert_ne!(ctx.user2, ctx.user3);
    }
}

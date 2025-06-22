#!/bin/bash

# SWAVE DeFi Platform - Initialization Script
# This script sets up the development environment for SWAVE

set -e

echo "🚀 Initializing SWAVE DeFi Development Environment..."
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

# Check Rust installation
print_status "Checking Rust installation..."
if ! command -v rustc &> /dev/null; then
    print_error "Rust is not installed. Please install Rust first:"
    print_error "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

RUST_VERSION=$(rustc --version)
print_success "Rust is installed: $RUST_VERSION"

# Check for wasm32 target
print_status "Checking wasm32 target..."
if ! rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
    print_status "Installing wasm32-unknown-unknown target..."
    rustup target add wasm32-unknown-unknown
    print_success "wasm32-unknown-unknown target installed"
else
    print_success "wasm32-unknown-unknown target already installed"
fi

# Check for Soroban CLI
print_status "Checking Soroban CLI..."
if ! command -v soroban &> /dev/null; then
    print_status "Installing Soroban CLI..."
    cargo install --locked soroban-cli
    print_success "Soroban CLI installed"
else
    SOROBAN_VERSION=$(soroban --version)
    print_success "Soroban CLI is installed: $SOROBAN_VERSION"
fi

# Install additional tools
print_status "Installing additional development tools..."

# Install cargo-edit for dependency management
if ! command -v cargo-add &> /dev/null; then
    print_status "Installing cargo-edit..."
    cargo install cargo-edit
    print_success "cargo-edit installed"
fi

# Install cargo-audit for security auditing
if ! command -v cargo-audit &> /dev/null; then
    print_status "Installing cargo-audit..."
    cargo install cargo-audit
    print_success "cargo-audit installed"
fi

# Install cargo-machete for unused dependency detection
if ! command -v cargo-machete &> /dev/null; then
    print_status "Installing cargo-machete..."
    cargo install cargo-machete
    print_success "cargo-machete installed"
fi

# Install wasm-opt for WASM optimization
if ! command -v wasm-opt &> /dev/null; then
    print_status "Installing wasm-opt..."
    if command -v npm &> /dev/null; then
        npm install -g wasm-opt
        print_success "wasm-opt installed via npm"
    else
        print_warning "npm not found. Please install wasm-opt manually for optimization."
    fi
fi

# Configure Soroban networks
print_status "Configuring Soroban networks..."

# Configure testnet
soroban network add testnet \
    --rpc-url https://soroban-testnet.stellar.org:443 \
    --network-passphrase "Test SDF Network ; September 2015" 2>/dev/null || true

# Configure futurenet
soroban network add futurenet \
    --rpc-url https://rpc-futurenet.stellar.org:443 \
    --network-passphrase "Test SDF Future Network ; October 2022" 2>/dev/null || true

# Configure mainnet
soroban network add mainnet \
    --rpc-url https://soroban-mainnet.stellar.org:443 \
    --network-passphrase "Public Global Stellar Network ; September 2015" 2>/dev/null || true

print_success "Soroban networks configured"

# Create development identity
IDENTITY_NAME="swave-dev"
if ! soroban keys show $IDENTITY_NAME &> /dev/null; then
    print_status "Creating development identity..."
    soroban keys generate $IDENTITY_NAME --network testnet
    DEV_ADDRESS=$(soroban keys address $IDENTITY_NAME)
    print_success "Development identity created: $DEV_ADDRESS"
    
    # Fund the account on testnet
    print_status "Funding development account on testnet..."
    soroban keys fund $IDENTITY_NAME --network testnet || print_warning "Failed to fund account"
else
    DEV_ADDRESS=$(soroban keys address $IDENTITY_NAME)
    print_success "Development identity already exists: $DEV_ADDRESS"
fi

# Set up project structure
print_status "Setting up project directories..."
mkdir -p deployed
mkdir -p logs
mkdir -p docs

# Create .env file for environment variables
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# SWAVE DeFi Platform Environment Variables
RUST_LOG=debug
SOROBAN_NETWORK=testnet
DEPLOYER_IDENTITY=swave-dev
DEV_IDENTITY=$IDENTITY_NAME
DEV_ADDRESS=$DEV_ADDRESS

# Network URLs
TESTNET_RPC=https://soroban-testnet.stellar.org:443
FUTURENET_RPC=https://rpc-futurenet.stellar.org:443
MAINNET_RPC=https://soroban-mainnet.stellar.org:443

# Network Passphrases
TESTNET_PASSPHRASE="Test SDF Network ; September 2015"
FUTURENET_PASSPHRASE="Test SDF Future Network ; October 2022"
MAINNET_PASSPHRASE="Public Global Stellar Network ; September 2015"
EOF
    print_success ".env file created"
fi

# Run initial checks
print_status "Running initial project checks..."

# Check dependencies
print_status "Checking dependencies..."
cargo check

# Run security audit
print_status "Running security audit..."
cargo audit || print_warning "Security audit found issues (check output above)"

# Check for unused dependencies
print_status "Checking for unused dependencies..."
cargo machete || print_warning "Found unused dependencies (check output above)"

# Make scripts executable
print_status "Making scripts executable..."
chmod +x scripts/*.sh

print_success "All scripts are now executable"

# Create helpful aliases in a source file
cat > .aliases << 'EOF'
# SWAVE Development Aliases
alias swave-build='./scripts/build.sh'
alias swave-deploy='./scripts/deploy.sh'
alias swave-test='cargo test'
alias swave-check='cargo check'
alias swave-lint='cargo clippy'
alias swave-audit='cargo audit'
alias swave-clean='cargo clean'
alias swave-docs='cargo doc --open'

# Soroban shortcuts
alias sb='soroban'
alias sb-testnet='soroban --network testnet'
alias sb-invoke='soroban contract invoke --network testnet --source swave-dev'

echo "SWAVE aliases loaded! Available commands:"
echo "  swave-build    - Build all contracts"
echo "  swave-deploy   - Deploy all contracts"
echo "  swave-test     - Run all tests"
echo "  swave-check    - Check code compilation"
echo "  swave-lint     - Run clippy linter"
echo "  swave-audit    - Run security audit"
echo "  swave-clean    - Clean build artifacts"
echo "  swave-docs     - Generate and open documentation"
EOF

echo ""
echo "🎉 SWAVE Development Environment Initialized!"
echo "============================================="
echo ""
echo "📋 Summary:"
echo "  ✅ Rust toolchain configured"
echo "  ✅ Soroban CLI installed and configured"
echo "  ✅ Development tools installed"
echo "  ✅ Networks configured (testnet, futurenet, mainnet)"
echo "  ✅ Development identity created: $DEV_ADDRESS"
echo "  ✅ Project structure set up"
echo "  ✅ Environment variables configured"
echo ""
echo "🚀 Next Steps:"
echo "  1. Source aliases: source .aliases"
echo "  2. Build contracts: ./scripts/build.sh"
echo "  3. Deploy to testnet: ./scripts/deploy.sh testnet"
echo "  4. Run tests: cargo test"
echo ""
echo "📚 Useful Commands:"
echo "  ./scripts/build.sh     - Build all contracts"
echo "  ./scripts/deploy.sh    - Deploy to testnet"
echo "  cargo test             - Run all tests"
echo "  cargo doc --open       - View documentation"
echo ""
echo "Happy coding! 🦀✨"

#!/bin/bash

# Shield-17799 Pre-Demo Verification Script
# Run this before presenting to judges to ensure everything works

set -e

echo "🔍 Shield-17799 Pre-Demo Checklist"
echo "===================================="
echo ""

# Check Node.js version
echo "✅ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Found: $NODE_VERSION"
if [[ ! $NODE_VERSION =~ ^v(18|20|21) ]]; then
  echo "   ⚠️  Recommended: Node 18+ (LTS)"
fi
echo ""

# Check npm version
echo "✅ Checking npm version..."
NPM_VERSION=$(npm -v)
echo "   Found: $NPM_VERSION"
echo ""

# Check if node_modules exists
echo "✅ Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "   Installing npm dependencies..."
  npm install
else
  echo "   Dependencies found ✓"
fi
echo ""

# Check environment file
echo "✅ Checking environment configuration..."
if [ ! -f ".env" ]; then
  echo "   ⚠️  .env file not found"
  echo "   Creating from .env.example..."
  cp .env.example .env
  echo "   ⚠️  IMPORTANT: Update .env with your GEMINI_API_KEY"
  echo "   Get free key at: https://aistudio.google.com/"
else
  if grep -q "YOUR_GEMINI_API_KEY_HERE" .env; then
    echo "   ⚠️  GEMINI_API_KEY not configured!"
    echo "   Update .env with your actual API key"
    exit 1
  else
    echo "   API Key configured ✓"
  fi
fi
echo ""

# Run TypeScript check
echo "✅ Running TypeScript type checking..."
npm run lint
echo "   TypeScript check passed ✓"
echo ""

# Build the project
echo "✅ Building production bundle..."
npm run build
echo "   Build successful ✓"
echo ""

# Verify build artifacts
echo "✅ Verifying build artifacts..."
if [ -d "dist" ] && [ -f "dist/server.cjs" ]; then
  echo "   Build artifacts found ✓"
else
  echo "   ❌ Build artifacts missing!"
  exit 1
fi
echo ""

echo "════════════════════════════════════"
echo "🏆 All checks passed! Ready for demo"
echo "════════════════════════════════════"
echo ""
echo "To start the demo:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""

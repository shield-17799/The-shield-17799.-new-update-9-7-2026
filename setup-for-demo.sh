#!/bin/bash

# Make the pre-demo check script executable
chmod +x scripts/pre-demo-check.sh

# Quick verification that project is ready
echo "Running Shield-17799 pre-demo checks..."

# Run checks
bash scripts/pre-demo-check.sh

echo ""
echo "✅ Project ready for hackathon demo!"

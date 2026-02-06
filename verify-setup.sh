#!/bin/bash

echo "🔍 Verifying WhatsApp Translation Server Setup..."
echo ""

# Check Node version
echo "✓ Checking Node.js version..."
node -v
echo ""

# Check npm version
echo "✓ Checking npm version..."
npm -v
echo ""

# Check if dependencies are installed
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
  echo "  - Root dependencies: ✓"
else
  echo "  - Root dependencies: ✗ (run 'npm install')"
fi

if [ -f "shared/dist/index.js" ]; then
  echo "  - Shared package built: ✓"
else
  echo "  - Shared package built: ✗"
fi
echo ""

# Check configuration files
echo "✓ Checking configuration..."
if [ -f "backend/.env" ]; then
  echo "  - Backend .env: ✓"
  if grep -q "your-api-key-here" backend/.env; then
    echo "    ⚠️  WARNING: Please add your OpenAI API key to backend/.env"
  else
    echo "    ✓ API key appears to be set"
  fi
else
  echo "  - Backend .env: ✗ (copy from .env.example)"
fi

if [ -f "frontend/.env" ]; then
  echo "  - Frontend .env: ✓"
else
  echo "  - Frontend .env: ✗ (copy from .env.example)"
fi
echo ""

# Check TypeScript compilation
echo "✓ Running TypeScript type check..."
npm run typecheck --silent 2>&1 > /dev/null
if [ $? -eq 0 ]; then
  echo "  - TypeScript: ✓ (no errors)"
else
  echo "  - TypeScript: ✗ (run 'npm run typecheck' for details)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Setup Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to backend/.env"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo "4. Scan the QR code with WhatsApp"
echo ""
echo "For detailed instructions, see:"
echo "  - README.md"
echo "  - QUICKSTART.md"
echo "  - NEXT_STEPS.md"
echo ""

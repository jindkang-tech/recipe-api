#!/bin/bash
# Setup script for Recipe Website in Codio environment

echo "====== Recipe Website Setup for Codio ======"
echo ""

# Check if MySQL is running
echo "Checking MySQL status..."
if sudo service mysql status > /dev/null; then
  echo "✅ MySQL is running"
else
  echo "Starting MySQL..."
  sudo service mysql start
  sleep 2
  if sudo service mysql status > /dev/null; then
    echo "✅ MySQL started successfully"
  else
    echo "❌ Failed to start MySQL. Please check errors and try manually"
    exit 1
  fi
fi

# Import database schema
echo ""
echo "Setting up database..."
# Using root without password prompt (common in Codio)
if mysql -u root < backend/database.sql; then
  echo "✅ Database schema imported successfully"
else
  echo "❌ Failed to import database schema. You might need to enter password manually"
  echo "Try running: mysql -u root -p < backend/database.sql"
fi

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
if npm install; then
  echo "✅ Backend dependencies installed successfully"
else
  echo "❌ Failed to install backend dependencies"
  exit 1
fi

# Test database connection
echo ""
echo "Testing database connection..."
node -e "require('./src/config/database.js')"

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd ../frontend
if npm install; then
  echo "✅ Frontend dependencies installed successfully"
else
  echo "❌ Failed to install frontend dependencies"
  exit 1
fi

# Create .env.development file to fix host header issues
echo ""
echo "Creating environment configuration for frontend..."
cat > .env.development << EOF
DANGEROUSLY_DISABLE_HOST_CHECK=true
WDS_SOCKET_PORT=0
EOF
echo "✅ Created .env.development file to fix 'Invalid Host header' issues"

echo ""
echo "====== Setup Complete ======"
echo ""
echo "To start the application:"
echo "1. Start backend: cd backend && npm start"
echo "2. In a new terminal, start frontend: cd frontend && npm start"
echo ""
echo "Access the frontend at: https://[box-name]-3000.codio-box.uk/"
echo "Default admin login:"
echo "Username: jind"
echo "Password: admin123"
echo ""
echo "For troubleshooting, refer to the README.md file"

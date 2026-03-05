#!/bin/bash
# ============================================================
# Raymond E-Commerce — EC2 Initial Setup Script
# ============================================================
# Run this ONCE on a fresh Ubuntu EC2 instance to install
# Docker, Docker Compose, and set up the project.
#
# Usage: curl -sSL <raw-github-url>/ec2-setup.sh | bash
#        OR: chmod +x ec2-setup.sh && ./ec2-setup.sh
# ============================================================

set -e

echo "🔧 Setting up Raymond E-Commerce on EC2..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add current user to docker group (no sudo needed for docker commands)
sudo usermod -aG docker $USER

# Create project directory
echo "📁 Setting up project directory..."
mkdir -p /home/ubuntu/raymond-ecommerce
cd /home/ubuntu/raymond-ecommerce

# Clone the repo (or copy compose file)
echo "📥 Cloning repository..."
git clone https://github.com/29Gunjan/Raymond-Ecommerce.git ./ 2>/dev/null || echo "Repo already exists, pulling latest..."
git pull origin main 2>/dev/null || true

# Set environment variable for Docker Hub username
echo "DOCKERHUB_USERNAME=gunja29" > .env

# Make deploy script executable
chmod +x deploy.sh

echo ""
echo "============================================================"
echo "✅ EC2 Setup Complete!"
echo "============================================================"
echo ""
echo "IMPORTANT: Log out and log back in for Docker permissions."
echo "Then run:"
echo "  cd /home/ubuntu/raymond-ecommerce"
echo "  ./deploy.sh"
echo ""
echo "Your app will be available at:"
echo "  http://<YOUR-EC2-PUBLIC-IP>:3000"
echo "============================================================"

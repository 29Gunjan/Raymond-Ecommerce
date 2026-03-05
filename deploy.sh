#!/bin/bash
# ============================================================
# Raymond E-Commerce — EC2 Deploy Script
# ============================================================
# This script is run on the EC2 instance to pull the latest
# Docker images from Docker Hub and restart the containers.
#
# Usage: ./deploy.sh
# ============================================================

set -e

echo "🚀 Deploying Raymond E-Commerce..."

# Navigate to project directory
cd /home/ubuntu/raymond-ecommerce

# Pull latest images from Docker Hub
echo "📦 Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

# Stop and restart containers
echo "🔄 Restarting containers..."
docker compose -f docker-compose.prod.yml up -d --force-recreate

# Clean up old images
echo "🧹 Cleaning up old images..."
docker image prune -f

# Wait for health check
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo "📊 Container status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deployment complete!"
echo "   Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "   Backend:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000"

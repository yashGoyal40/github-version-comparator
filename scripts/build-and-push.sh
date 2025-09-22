#!/bin/bash

# GitHub Version Comparator - Docker Build and Push Script
# Usage: ./scripts/build-and-push.sh [tag] [registry]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TAG=${1:-latest}
REGISTRY=${2:-"your-registry.com"}
APP_NAME="github-version-comparator"

# Image name
IMAGE_NAME="${REGISTRY}/${APP_NAME}:${TAG}"

echo -e "${BLUE}🐳 Building and Pushing GitHub Version Comparator${NC}"
echo -e "${BLUE}Image: ${IMAGE_NAME}${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

print_status "Docker is available"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running"
    exit 1
fi

print_status "Docker daemon is running"

# Build the Docker image
print_status "Building Docker image: ${IMAGE_NAME}"
docker build -t ${IMAGE_NAME} .

# Also tag as latest if not already
if [ "${TAG}" != "latest" ]; then
    LATEST_IMAGE="${REGISTRY}/${APP_NAME}:latest"
    print_status "Tagging as latest: ${LATEST_IMAGE}"
    docker tag ${IMAGE_NAME} ${LATEST_IMAGE}
fi

# Show image details
print_status "Built image details:"
docker images | grep ${APP_NAME}

# Ask for confirmation before pushing
echo ""
print_warning "About to push image to registry: ${REGISTRY}"
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Login to registry (if needed)
    print_status "Pushing image to registry..."
    docker push ${IMAGE_NAME}
    
    if [ "${TAG}" != "latest" ]; then
        docker push ${LATEST_IMAGE}
    fi
    
    print_status "Image pushed successfully!"
    print_status "You can now deploy using: ./scripts/deploy.sh dev ${TAG}"
else
    print_warning "Push cancelled. Image is available locally."
    print_warning "To push later, run: docker push ${IMAGE_NAME}"
fi

print_status "Build process completed!"

#!/bin/bash

# GitHub Version Comparator - Kubernetes Deployment Script
# Usage: ./scripts/deploy.sh [environment] [image-tag]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-dev}
IMAGE_TAG=${2:-latest}
REGISTRY=${REGISTRY:-"your-registry.com"}
APP_NAME="github-version-comparator"
NAMESPACE="github-version-comparator"

# Image name
IMAGE_NAME="${REGISTRY}/${APP_NAME}:${IMAGE_TAG}"

echo -e "${BLUE}🚀 Deploying GitHub Version Comparator${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
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

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster"
    exit 1
fi

print_status "Connected to Kubernetes cluster"

# Create namespace if it doesn't exist
if ! kubectl get namespace ${NAMESPACE} &> /dev/null; then
    print_status "Creating namespace: ${NAMESPACE}"
    kubectl create namespace ${NAMESPACE}
else
    print_status "Namespace ${NAMESPACE} already exists"
fi

# Update image in kustomization
if [ -f "k8s/kustomization.yaml" ]; then
    print_status "Updating image tag in kustomization"
    sed -i.bak "s|newTag: .*|newTag: ${IMAGE_TAG}|g" k8s/kustomization.yaml
    sed -i.bak "s|name: ${APP_NAME}|name: ${APP_NAME}|g" k8s/kustomization.yaml
fi

# Deploy using kustomize
print_status "Deploying application using kustomize"
kubectl apply -k k8s/

# Wait for deployment to be ready
print_status "Waiting for deployment to be ready"
kubectl wait --for=condition=available --timeout=300s deployment/${APP_NAME} -n ${NAMESPACE}

# Check deployment status
print_status "Checking deployment status"
kubectl get pods -n ${NAMESPACE} -l app=${APP_NAME}

# Get service information
print_status "Service information:"
kubectl get svc -n ${NAMESPACE}

# Get ingress information (if exists)
if kubectl get ingress -n ${NAMESPACE} &> /dev/null; then
    print_status "Ingress information:"
    kubectl get ingress -n ${NAMESPACE}
fi

# Port forward for local testing (optional)
if [ "${ENVIRONMENT}" = "dev" ]; then
    print_warning "Starting port-forward for local testing..."
    print_warning "Access the application at: http://localhost:8080"
    print_warning "Press Ctrl+C to stop port-forward"
    kubectl port-forward -n ${NAMESPACE} svc/${APP_NAME}-service 8080:80
fi

print_status "Deployment completed successfully!"

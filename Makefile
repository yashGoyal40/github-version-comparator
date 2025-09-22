# GitHub Version Comparator - Makefile
# Usage: make <target>

.PHONY: help build run docker-build docker-run k8s-deploy k8s-delete clean

# Default target
help:
	@echo "🚀 GitHub Version Comparator - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  dev          Start development server"
	@echo "  build        Build for production"
	@echo "  clean        Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build Build Docker image"
	@echo "  docker-run   Run Docker container locally"
	@echo "  docker-push  Build and push to registry"
	@echo ""
	@echo "Kubernetes:"
	@echo "  k8s-deploy   Deploy to Kubernetes"
	@echo "  k8s-delete   Delete from Kubernetes"
	@echo "  k8s-status   Check Kubernetes status"
	@echo ""
	@echo "Utilities:"
	@echo "  install      Install dependencies"
	@echo "  lint         Run linter"
	@echo "  test         Run tests"
	@echo "  release      Create a new release"

# Development
dev:
	@echo "🚀 Starting development server..."
	npm run dev

build:
	@echo "🔨 Building for production..."
	npm run build

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .next out node_modules/.cache

install:
	@echo "📦 Installing dependencies..."
	npm install

lint:
	@echo "🔍 Running linter..."
	npm run lint

test:
	@echo "🧪 Running tests..."
	npm run test

release:
	@echo "🚀 Creating release..."
	./scripts/release.sh

# Docker
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t github-version-comparator:latest .

docker-run:
	@echo "🐳 Running Docker container..."
	docker run -p 3000:3000 github-version-comparator:latest

docker-push:
	@echo "🐳 Building and pushing Docker image..."
	@read -p "Enter registry URL (e.g., your-registry.com): " registry; \
	read -p "Enter tag (default: latest): " tag; \
	tag=$${tag:-latest}; \
	./scripts/build-and-push.sh $$tag $$registry

# Kubernetes
k8s-deploy:
	@echo "☸️  Deploying to Kubernetes..."
	kubectl apply -k k8s/

k8s-delete:
	@echo "☸️  Deleting from Kubernetes..."
	kubectl delete -k k8s/

k8s-status:
	@echo "☸️  Kubernetes status:"
	@kubectl get all -n github-version-comparator

k8s-logs:
	@echo "☸️  Viewing logs..."
	@kubectl logs -n github-version-comparator -l app=github-version-comparator -f

k8s-port-forward:
	@echo "☸️  Starting port forward..."
	@kubectl port-forward -n github-version-comparator svc/github-version-comparator-service 8080:80

# Quick deployment
deploy-local: docker-build docker-run

deploy-k8s: docker-build k8s-deploy

deploy-vercel:
	@echo "🚀 Deploying to Vercel..."
	vercel --prod

# All-in-one commands
setup: install
	@echo "✅ Setup complete!"

full-deploy: clean build docker-build k8s-deploy
	@echo "✅ Full deployment complete!"

# Environment setup
setup-dev:
	@echo "🔧 Setting up development environment..."
	nvm use 20
	npm install
	@echo "✅ Development environment ready!"

# Health checks
health:
	@echo "🏥 Checking application health..."
	@curl -f http://localhost:3000/health || echo "❌ Application not responding"

# Show current status
status:
	@echo "📊 Current Status:"
	@echo "Node version: $$(node --version)"
	@echo "NPM version: $$(npm --version)"
	@echo "Docker version: $$(docker --version 2>/dev/null || echo 'Not installed')"
	@echo "Kubectl version: $$(kubectl version --client 2>/dev/null || echo 'Not installed')"

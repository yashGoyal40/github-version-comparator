#!/bin/bash

# GitHub Version Comparator - Release Script
# Usage: ./scripts/release.sh [version] [type]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
VERSION=${1:-patch}
TYPE=${2:-patch}

echo -e "${BLUE}🚀 Creating Release for GitHub Version Comparator${NC}"
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

# Check if git is clean
if ! git diff-index --quiet HEAD --; then
    print_error "Working directory is not clean. Please commit or stash changes first."
    exit 1
fi

print_status "Working directory is clean"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    print_warning "You're not on main/master branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update version
print_status "Updating version..."
npm version $TYPE

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
print_status "New version: $NEW_VERSION"

# Build the project
print_status "Building project..."
npm run build

# Run tests (if available)
if npm run test --silent 2>/dev/null; then
    print_status "Running tests..."
    npm run test
else
    print_warning "No tests found, skipping..."
fi

# Lint check
print_status "Running linter..."
npm run lint

# Create release commit
print_status "Creating release commit..."
git add .
git commit -m "chore: release v$NEW_VERSION

- Update version to $NEW_VERSION
- Update CHANGELOG.md
- Build for production"

# Create tag
print_status "Creating tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

# Push changes and tags
print_status "Pushing changes and tags..."
git push origin HEAD
git push origin "v$NEW_VERSION"

print_status "Release v$NEW_VERSION created successfully!"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Go to GitHub repository"
echo "2. Click 'Releases' → 'Create a new release'"
echo "3. Select tag 'v$NEW_VERSION'"
echo "4. Use the release notes from RELEASE_TEMPLATE.md"
echo "5. Publish the release"
echo ""
echo -e "${BLUE}🔗 Release URL:${NC}"
echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/releases/new"
echo ""
print_status "Happy releasing! 🎉"

# 🚀 Deployment Guide

This guide covers different deployment options for the GitHub Version Comparator - a client-side only application.

## 📋 Prerequisites

- Node.js 20+ (for building)
- Docker (for containerized deployment)
- Kubernetes cluster (for K8s deployment)
- Git repository access

## 🎯 Quick Deploy Options

### 1. Static Hosting (Recommended for most users)

Since this is a **client-side only application**, it can be deployed to any static hosting platform:

#### Vercel (Easiest)

1. **Connect Repository**
   - Push code to GitHub
   - Connect to Vercel
   - Deploy automatically

2. **Using Vercel CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

#### Other Static Platforms

- **Netlify**: Drag & drop or Git integration
- **GitHub Pages**: Free for public repos
- **AWS S3 + CloudFront**: Enterprise scale
- **Cloudflare Pages**: Fast global CDN

### 2. Docker Deployment

#### Build and Run Locally

```bash
# Build the image
docker build -t github-version-comparator:latest .

# Run locally
docker run -p 3000:3000 github-version-comparator:latest
```

#### Using Deployment Scripts

```bash
# Build and push to registry
./scripts/build-and-push.sh v1.0.0 your-registry.com

# Deploy to Kubernetes
./scripts/deploy.sh dev v1.0.0
```

### 3. Kubernetes Deployment

#### Prerequisites

- Kubernetes cluster (v1.19+)
- kubectl configured
- Docker image in registry

#### Deploy

```bash
# Deploy all resources
kubectl apply -f k8s/

# Or using kustomize
kubectl apply -k k8s/
```

#### Access Application

```bash
# Port forward for local access
kubectl port-forward -n github-version-comparator svc/github-version-comparator-service 8080:80
```

## 🐳 Docker Configuration

### Multi-stage Dockerfile

The application uses a multi-stage Docker build:

1. **Build Stage**: Node.js 20 Alpine for building
2. **Production Stage**: Nginx Alpine for serving

### Key Features

- **Minimal Image Size**: ~50MB final image
- **Security**: Non-root user, read-only filesystem
- **Performance**: Nginx with gzip compression
- **Health Checks**: Built-in health monitoring

### Customization

Edit `nginx.conf` for custom Nginx configuration:

```nginx
# Custom server configuration
server {
    listen 3000;
    server_name your-domain.com;
    # ... your custom config
}
```

## ☸️ Kubernetes Configuration

### Architecture

- **Namespace**: `github-version-comparator`
- **Deployment**: 3 replicas with rolling updates
- **Service**: ClusterIP for internal access
- **Ingress**: External access with TLS
- **HPA**: Auto-scaling based on CPU/Memory

### Resource Requirements

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "50m"
  limits:
    memory: "128Mi"
    cpu: "100m"
```

### Security Features

- **Non-root user**: Runs as user 1001
- **Read-only filesystem**: Enhanced security
- **Security headers**: XSS, CSRF protection
- **TLS encryption**: Automatic HTTPS
- **Resource limits**: Prevents resource exhaustion

### Scaling Configuration

```yaml
# Horizontal Pod Autoscaler
minReplicas: 2
maxReplicas: 10
cpuTarget: 70%
memoryTarget: 80%
```

## 🔧 Environment Configuration

### No Environment Variables Required!

Since this is a client-side only application, **no environment variables are needed**. All configuration is handled in the browser.

### Build Configuration

```bash
# Build for production
npm run build

# The output will be in the 'out' directory
# Deploy the 'out' directory to any static host
```

## 🔒 Security Considerations

### Client-Side Security

- **No server required**: Pure client-side application
- **Tokens stored locally**: Never sent to any server
- **Direct GitHub API**: No data passes through your infrastructure
- **Rate limits**: Subject to GitHub's official API limits
- **CORS compliant**: Works with GitHub's API directly

### Production Checklist

- [ ] Use HTTPS everywhere
- [ ] Set up proper CORS headers
- [ ] Configure security headers
- [ ] Enable gzip compression
- [ ] Set up monitoring
- [ ] Regular security updates

## 📊 Monitoring and Health Checks

### Health Check Endpoint

```bash
# Check application health
curl http://your-domain.com/health
```

### Kubernetes Monitoring

```bash
# Check pod status
kubectl get pods -n github-version-comparator

# Check logs
kubectl logs -n github-version-comparator -l app=github-version-comparator

# Check events
kubectl get events -n github-version-comparator
```

### Prometheus Integration

The application exposes metrics at `/health` endpoint for Prometheus scraping.

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 20+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Docker Issues**
   - Ensure Docker daemon is running
   - Check image build logs
   - Verify port availability

3. **Kubernetes Issues**
   - Check cluster connectivity
   - Verify image is in registry
   - Check resource limits

4. **Static Hosting Issues**
   - Verify build output in `out/` directory
   - Check for client-side routing issues
   - Ensure proper redirects for SPA

### Debug Commands

```bash
# Local development
npm run dev

# Docker debugging
docker logs <container-id>

# Kubernetes debugging
kubectl describe pod <pod-name> -n github-version-comparator
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Docker Registry Push

```yaml
- name: Build and Push Docker Image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: |
      your-registry.com/github-version-comparator:latest
      your-registry.com/github-version-comparator:${{ github.sha }}
```

## 📈 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### Runtime Optimization

- **CDN**: Use global CDN for static assets
- **Compression**: Enable gzip/brotli compression
- **Caching**: Set proper cache headers
- **Images**: Optimize and use modern formats

### Kubernetes Optimization

- **Resource Limits**: Set appropriate CPU/Memory limits
- **HPA**: Configure auto-scaling
- **Pod Disruption Budgets**: Ensure availability
- **Network Policies**: Secure network traffic

## 🔧 Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update Next.js
npm install next@latest
```

### Kubernetes Maintenance

```bash
# Update deployment
kubectl set image deployment/github-version-comparator \
  github-version-comparator=your-registry.com/github-version-comparator:v1.1.0 \
  -n github-version-comparator

# Check rollout status
kubectl rollout status deployment/github-version-comparator -n github-version-comparator

# Rollback if needed
kubectl rollout undo deployment/github-version-comparator -n github-version-comparator
```

### Monitoring

- **Uptime**: Set up uptime monitoring
- **Performance**: Monitor response times
- **Errors**: Track error rates
- **Resources**: Monitor CPU/Memory usage

## 📞 Support

### Getting Help

- Check the troubleshooting section
- Review application logs
- Test locally first
- Check platform-specific documentation

### Useful Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Docker build
docker build -t github-version-comparator .

# Kubernetes deployment
kubectl apply -k k8s/

# Check status
kubectl get all -n github-version-comparator
```

---

**Happy Deploying! 🚀**

*This application is designed to be simple, secure, and scalable. Choose the deployment method that best fits your needs!*
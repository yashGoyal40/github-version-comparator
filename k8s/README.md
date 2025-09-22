# 🚀 Kubernetes Deployment for GitHub Version Comparator

This directory contains Kubernetes manifests for deploying the GitHub Version Comparator application.

## 📁 Files Overview

- **`namespace.yaml`** - Creates a dedicated namespace
- **`configmap.yaml`** - Nginx configuration
- **`deployment.yaml`** - Main application deployment
- **`service.yaml`** - ClusterIP service
- **`ingress.yaml`** - External access with TLS
- **`hpa.yaml`** - Horizontal Pod Autoscaler
- **`kustomization.yaml`** - Kustomize configuration

## 🚀 Quick Start

### Prerequisites

- Kubernetes cluster (v1.19+)
- kubectl configured
- Docker image built and pushed to registry

### 1. Build and Push Docker Image

```bash
# Build the image
docker build -t github-version-comparator:latest .

# Tag for your registry
docker tag github-version-comparator:latest your-registry/github-version-comparator:latest

# Push to registry
docker push your-registry/github-version-comparator:latest
```

### 2. Deploy to Kubernetes

```bash
# Using kubectl
kubectl apply -f k8s/

# Or using kustomize
kubectl apply -k k8s/
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -n github-version-comparator

# Check services
kubectl get svc -n github-version-comparator

# Check ingress
kubectl get ingress -n github-version-comparator
```

## 🔧 Configuration

### Environment Variables

The application runs as a static site, so no environment variables are required.

### Resource Limits

Default resource limits:
- **CPU**: 50m request, 100m limit
- **Memory**: 64Mi request, 128Mi limit

### Scaling

- **Min Replicas**: 2
- **Max Replicas**: 10
- **CPU Target**: 70%
- **Memory Target**: 80%

## 🌐 Access

### Local Access

```bash
# Port forward to local machine
kubectl port-forward -n github-version-comparator svc/github-version-comparator-service 8080:80

# Access at http://localhost:8080
```

### External Access

Update the ingress hostname in `ingress.yaml`:

```yaml
spec:
  rules:
  - host: your-domain.com  # Change this
```

## 🔒 Security Features

- **Non-root user**: Runs as user 1001
- **Read-only filesystem**: Enhanced security
- **Security headers**: XSS, CSRF protection
- **TLS encryption**: Automatic HTTPS
- **Resource limits**: Prevents resource exhaustion

## 📊 Monitoring

### Health Checks

- **Liveness Probe**: `/health` endpoint
- **Readiness Probe**: `/health` endpoint
- **Prometheus**: Metrics available at `/health`

### Logs

```bash
# View application logs
kubectl logs -n github-version-comparator -l app=github-version-comparator

# Follow logs
kubectl logs -n github-version-comparator -l app=github-version-comparator -f
```

## 🔄 Updates

### Rolling Updates

```bash
# Update image
kubectl set image deployment/github-version-comparator \
  github-version-comparator=your-registry/github-version-comparator:v1.1.0 \
  -n github-version-comparator

# Check rollout status
kubectl rollout status deployment/github-version-comparator -n github-version-comparator
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/github-version-comparator -n github-version-comparator
```

## 🧹 Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or using kustomize
kubectl delete -k k8s/
```

## 📈 Production Considerations

1. **Image Registry**: Use a private registry for production
2. **TLS Certificates**: Configure cert-manager for automatic TLS
3. **Monitoring**: Set up Prometheus and Grafana
4. **Logging**: Configure centralized logging (ELK stack)
5. **Backup**: Regular backup of configurations
6. **Security**: Regular security updates and scanning

## 🆘 Troubleshooting

### Common Issues

1. **Pod not starting**
   ```bash
   kubectl describe pod -n github-version-comparator -l app=github-version-comparator
   ```

2. **Service not accessible**
   ```bash
   kubectl get endpoints -n github-version-comparator
   ```

3. **Ingress not working**
   ```bash
   kubectl describe ingress -n github-version-comparator
   ```

### Debug Commands

```bash
# Get all resources
kubectl get all -n github-version-comparator

# Check events
kubectl get events -n github-version-comparator --sort-by='.lastTimestamp'

# Describe resources
kubectl describe deployment github-version-comparator -n github-version-comparator
```

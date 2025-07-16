# 🚀 PromptELT Deployment Guide - Google Cloud Platform

This guide will help you deploy your PromptELT application to Google Cloud Platform with the custom domain `promptelt.ai`.

## 📋 Prerequisites

### 1. Google Cloud Account
- [Create a Google Cloud account](https://cloud.google.com/)
- Enable billing for your project
- Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### 2. Domain Registration
- Purchase the domain `promptelt.ai` from a domain registrar (Google Domains, Namecheap, etc.)
- Ensure you have access to manage DNS records

### 3. Local Setup
- Install Docker (for container builds)
- Install Git (for version control)

## 🎯 Deployment Options

### Option 1: Google Cloud Run (Recommended)
**Best for**: Cost-effective, scalable, serverless deployment
**Cost**: ~$5-20/month for typical usage
**Features**: Auto-scaling, SSL, custom domains

### Option 2: Google App Engine
**Best for**: Static sites with automatic scaling
**Cost**: ~$10-30/month
**Features**: Managed platform, easy deployment

### Option 3: Google Cloud Storage + Cloud CDN
**Best for**: Static content only
**Cost**: ~$2-10/month
**Features**: Most cost-effective, global CDN

## 🚀 Quick Deployment (Cloud Run)

### Step 1: Prepare Your Environment

```bash
# Install Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install

# Authenticate with Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create promptelt-app --name="PromptELT Application"

# Set the project
gcloud config set project promptelt-app
```

### Step 2: Update Configuration

Edit `deploy.sh` and update the following variables:
```bash
PROJECT_ID="promptelt-app"  # Your actual project ID
DOMAIN="promptelt.ai"       # Your domain
```

### Step 3: Deploy

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

## 🌐 Domain Configuration

### Step 1: Verify Domain Ownership

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Security** > **Domain Verification**
3. Add your domain `promptelt.ai`
4. Follow the verification instructions (usually adding a TXT record)

### Step 2: Configure DNS Records

Add these records to your domain's DNS settings:

```
# A record for root domain
@  A  216.239.32.21
@  A  216.239.34.21
@  A  216.239.36.21
@  A  216.239.38.21

# CNAME for www subdomain
www  CNAME  promptelt.ai.

# TXT record for verification (Google will provide this)
@  TXT  google-site-verification=your-verification-code
```

### Step 3: Map Domain to Cloud Run

```bash
# Map the domain to your Cloud Run service
gcloud run domain-mappings create \
    --service=promptelt \
    --domain=promptelt.ai \
    --region=us-central1 \
    --force-override
```

## 🔧 Manual Deployment Steps

### Option 1: Cloud Run (Container)

```bash
# Build the container
docker build -t gcr.io/promptelt-app/promptelt .

# Push to Google Container Registry
docker push gcr.io/promptelt-app/promptelt

# Deploy to Cloud Run
gcloud run deploy promptelt \
    --image gcr.io/promptelt-app/promptelt \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 80
```

### Option 2: App Engine

```bash
# Deploy to App Engine
gcloud app deploy app.yaml
```

### Option 3: Cloud Storage

```bash
# Create a bucket
gsutil mb gs://promptelt-website

# Make it public
gsutil iam ch allUsers:objectViewer gs://promptelt-website

# Upload files
gsutil -m cp -r . gs://promptelt-website/

# Set website configuration
gsutil web set -m index.html -e 404.html gs://promptelt-website
```

## 🔒 SSL Certificate Setup

### Automatic SSL (Recommended)
Cloud Run automatically provisions SSL certificates for custom domains.

### Manual SSL Setup
If needed, you can use Google-managed SSL certificates:

```bash
# Create SSL certificate
gcloud compute ssl-certificates create promptelt-ssl \
    --domains=promptelt.ai,www.promptelt.ai \
    --global
```

## 📊 Monitoring & Analytics

### 1. Google Analytics
Add Google Analytics to your `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Cloud Monitoring
- Set up alerts in Google Cloud Console
- Monitor performance metrics
- Set up logging for debugging

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Google Cloud

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Google Cloud SDK
      uses: google-github-actions/setup-gcloud@v0
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud builds submit --config cloudbuild.yaml .
```

## 💰 Cost Optimization

### Cloud Run Pricing
- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests

### Estimated Monthly Costs
- **Low traffic** (< 1000 requests/day): $5-10/month
- **Medium traffic** (10,000 requests/day): $20-50/month
- **High traffic** (100,000+ requests/day): $100+/month

### Cost Optimization Tips
1. Set minimum instances to 0 (scale to zero)
2. Use appropriate memory allocation (512Mi is usually sufficient)
3. Enable request concurrency
4. Use Cloud CDN for static assets

## 🔧 Environment Variables

Set these in Cloud Run:

```bash
gcloud run services update promptelt \
    --set-env-vars NODE_ENV=production \
    --region us-central1
```

## 🚨 Troubleshooting

### Common Issues

1. **Domain not working**
   - Check DNS propagation (can take 24-48 hours)
   - Verify domain ownership in Google Cloud Console
   - Check SSL certificate status

2. **Deployment fails**
   - Check Cloud Build logs
   - Verify Dockerfile syntax
   - Ensure all files are present

3. **Performance issues**
   - Enable Cloud CDN
   - Optimize image sizes
   - Use appropriate caching headers

### Useful Commands

```bash
# Check service status
gcloud run services describe promptelt --region=us-central1

# View logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=promptelt"

# Update service
gcloud run services update promptelt --image gcr.io/promptelt-app/promptelt --region=us-central1
```

## 📈 Scaling Configuration

### Cloud Run Auto-scaling
```bash
gcloud run services update promptelt \
    --min-instances=0 \
    --max-instances=10 \
    --concurrency=80 \
    --cpu=1 \
    --memory=512Mi \
    --region=us-central1
```

## 🔐 Security Best Practices

1. **Enable Cloud Armor** for DDoS protection
2. **Set up IAM roles** with least privilege
3. **Enable audit logging**
4. **Use VPC connector** if needed
5. **Regular security updates**

## 📞 Support

- **Google Cloud Support**: https://cloud.google.com/support
- **Documentation**: https://cloud.google.com/run/docs
- **Community**: https://stackoverflow.com/questions/tagged/google-cloud-run

---

**Your PromptELT application will be live at: https://promptelt.ai** 
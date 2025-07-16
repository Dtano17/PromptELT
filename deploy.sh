#!/bin/bash

# PromptELT Deployment Script for Google Cloud Platform
# This script deploys the application to Google Cloud Run with custom domain

set -e

# Configuration
PROJECT_ID="your-gcp-project-id"
REGION="us-central1"
SERVICE_NAME="promptelt"
DOMAIN="promptelt.ai"

echo "🚀 Starting PromptELT deployment to Google Cloud Platform..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud:"
    gcloud auth login
fi

# Set the project
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable domains.googleapis.com
gcloud services enable dns.googleapis.com

# Build and deploy using Cloud Build
echo "🏗️ Building and deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

# Get the Cloud Run service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo "✅ Deployment successful!"
echo "🌐 Service URL: $SERVICE_URL"

# Domain mapping (if domain is provided)
if [ "$DOMAIN" != "your-domain.com" ]; then
    echo "🌍 Setting up custom domain: $DOMAIN"
    
    # Map custom domain to Cloud Run service
    gcloud run domain-mappings create \
        --service=$SERVICE_NAME \
        --domain=$DOMAIN \
        --region=$REGION \
        --force-override
    
    echo "✅ Custom domain mapped successfully!"
    echo "🌐 Your application is now available at: https://$DOMAIN"
else
    echo "ℹ️ To set up a custom domain, update the DOMAIN variable in this script"
fi

# Display deployment information
echo ""
echo "🎉 PromptELT deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"
echo "   Service URL: $SERVICE_URL"
if [ "$DOMAIN" != "your-domain.com" ]; then
    echo "   Custom Domain: https://$DOMAIN"
fi
echo ""
echo "🔧 Next steps:"
echo "   1. Update the PROJECT_ID variable in this script with your actual project ID"
echo "   2. Configure your domain DNS settings if using a custom domain"
echo "   3. Set up monitoring and logging in Google Cloud Console"
echo "   4. Configure SSL certificates (automatic with Cloud Run)"
echo ""
echo "📈 Monitor your deployment:"
echo "   https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME" 
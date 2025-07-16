# PromptELT Deployment Script for Windows PowerShell
# This script deploys the application to Google Cloud Run with custom domain

param(
    [string]$ProjectId = "your-gcp-project-id",
    [string]$Domain = "promptelt.ai",
    [string]$Region = "us-central1"
)

Write-Host "🚀 Starting PromptELT deployment to Google Cloud Platform..." -ForegroundColor Green

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version --format="value(basic.version)" 2>$null
    if (-not $gcloudVersion) {
        throw "gcloud not found"
    }
    Write-Host "✅ Google Cloud SDK found: $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Cloud SDK is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if user is authenticated
try {
    $authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
    if (-not $authStatus) {
        Write-Host "🔐 Please authenticate with Google Cloud..." -ForegroundColor Yellow
        gcloud auth login
    } else {
        Write-Host "✅ Authenticated as: $authStatus" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Authentication failed" -ForegroundColor Red
    exit 1
}

# Set the project
Write-Host "📋 Setting project to: $ProjectId" -ForegroundColor Cyan
try {
    gcloud config set project $ProjectId
    Write-Host "✅ Project set successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set project. Please check your project ID" -ForegroundColor Red
    exit 1
}

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Cyan
$apis = @(
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "domains.googleapis.com",
    "dns.googleapis.com"
)

foreach ($api in $apis) {
    try {
        gcloud services enable $api
        Write-Host "✅ Enabled: $api" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Failed to enable: $api" -ForegroundColor Yellow
    }
}

# Build and deploy using Cloud Build
Write-Host "🏗️ Building and deploying with Cloud Build..." -ForegroundColor Cyan
try {
    gcloud builds submit --config cloudbuild.yaml .
    Write-Host "✅ Build and deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed. Check the error messages above." -ForegroundColor Red
    exit 1
}

# Get the Cloud Run service URL
try {
    $serviceUrl = gcloud run services describe promptelt --region=$Region --format="value(status.url)" 2>$null
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Service URL: $serviceUrl" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ Could not retrieve service URL" -ForegroundColor Yellow
}

# Domain mapping (if domain is provided)
if ($Domain -ne "your-domain.com") {
    Write-Host "🌍 Setting up custom domain: $Domain" -ForegroundColor Cyan
    try {
        gcloud run domain-mappings create `
            --service=promptelt `
            --domain=$Domain `
            --region=$Region `
            --force-override
        
        Write-Host "✅ Custom domain mapped successfully!" -ForegroundColor Green
        Write-Host "🌐 Your application is now available at: https://$Domain" -ForegroundColor Cyan
    } catch {
        Write-Host "⚠️ Domain mapping failed. You may need to verify domain ownership first." -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️ To set up a custom domain, update the Domain parameter in this script" -ForegroundColor Yellow
}

# Display deployment information
Write-Host ""
Write-Host "🎉 PromptELT deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "   Project ID: $ProjectId"
Write-Host "   Region: $Region"
Write-Host "   Service: promptelt"
if ($serviceUrl) {
    Write-Host "   Service URL: $serviceUrl"
}
if ($Domain -ne "your-domain.com") {
    Write-Host "   Custom Domain: https://$Domain"
}
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Update the ProjectId parameter with your actual project ID"
Write-Host "   2. Configure your domain DNS settings if using a custom domain"
Write-Host "   3. Set up monitoring and logging in Google Cloud Console"
Write-Host "   4. Configure SSL certificates (automatic with Cloud Run)"
Write-Host ""
Write-Host "📈 Monitor your deployment:" -ForegroundColor Cyan
Write-Host "   https://console.cloud.google.com/run/detail/$Region/promptelt"
Write-Host ""

# Usage instructions
Write-Host "💡 Usage Examples:" -ForegroundColor Yellow
Write-Host "   .\deploy.ps1 -ProjectId 'my-project-id' -Domain 'promptelt.ai'"
Write-Host "   .\deploy.ps1 -ProjectId 'promptelt-app'"
Write-Host "" 
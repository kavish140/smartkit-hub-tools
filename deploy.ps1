# Quick Deployment Script for GitHub Pages
# Run this in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SmartKit Hub Tools - GitHub Pages Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "[1/6] Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "[1/6] Git already initialized ✓" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/6] Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files staged" -ForegroundColor Green

Write-Host ""
Write-Host "[3/6] Creating commit..." -ForegroundColor Yellow
git commit -m "feat: SmartKit Hub Tools - Complete with 29 functional tools"
Write-Host "✓ Commit created" -ForegroundColor Green

Write-Host ""
Write-Host "[4/6] Setting up remote repository..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Please enter your GitHub repository details:" -ForegroundColor Cyan
Write-Host "Example: https://github.com/username/repo-name.git" -ForegroundColor Gray
Write-Host ""
$repoUrl = Read-Host "Enter your GitHub repository URL"

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "Remote 'origin' already exists. Updating..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}
Write-Host "✓ Remote configured" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] Renaming branch to 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch renamed" -ForegroundColor Green

Write-Host ""
Write-Host "[6/6] Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your GitHub repository" -ForegroundColor White
    Write-Host "2. Click 'Settings' tab" -ForegroundColor White
    Write-Host "3. Click 'Pages' in the left sidebar" -ForegroundColor White
    Write-Host "4. Under 'Build and deployment', select 'GitHub Actions'" -ForegroundColor White
    Write-Host "5. Wait 2-3 minutes for deployment" -ForegroundColor White
    Write-Host "6. Your site will be live at:" -ForegroundColor White
    Write-Host ""
    
    # Extract username and repo from URL
    if ($repoUrl -match 'github\.com[:/](.+)/(.+?)(?:\.git)?$') {
        $username = $matches[1]
        $repoName = $matches[2]
        Write-Host "   https://$username.github.io/$repoName/" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Check deployment status at:" -ForegroundColor Cyan
    Write-Host "   $repoUrl/actions" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Push failed. Please check your credentials." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure you've created the repository on GitHub" -ForegroundColor White
    Write-Host "2. Check your GitHub credentials" -ForegroundColor White
    Write-Host "3. Ensure you have push permissions" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Code Signing Script for VideoDownloaderPro.exe
# Run this script after you get your code signing certificate

param(
    [Parameter(Mandatory=$true)]
    [string]$CertificatePath,

    [Parameter(Mandatory=$true)]
    [string]$CertificatePassword,

    [string]$ExePath = "S:\smartkit\smartkit-hub-tools-main\smartkit-hub-tools-main\public\VideoDownloaderPro.exe"
)

Write-Host "🔐 Code Signing Script for VideoDownloaderPro.exe" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if exe exists
if (-not (Test-Path $ExePath)) {
    Write-Host "❌ Error: VideoDownloaderPro.exe not found at: $ExePath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found exe file: $ExePath" -ForegroundColor Green

# Check if certificate exists
if (-not (Test-Path $CertificatePath)) {
    Write-Host "❌ Error: Certificate not found at: $CertificatePath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found certificate: $CertificatePath" -ForegroundColor Green
Write-Host ""

# Find signtool.exe
$possiblePaths = @(
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22000.0\x64\signtool.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64\signtool.exe",
    "C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.8 Tools\x64\signtool.exe"
)

$signtool = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $signtool = $path
        break
    }
}

if (-not $signtool) {
    Write-Host "❌ Error: signtool.exe not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Windows SDK from:" -ForegroundColor Yellow
    Write-Host "https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found signtool: $signtool" -ForegroundColor Green
Write-Host ""

# Sign the executable
Write-Host "🔏 Signing the executable..." -ForegroundColor Cyan

try {
    & $signtool sign `
        /f $CertificatePath `
        /p $CertificatePassword `
        /tr "http://timestamp.digicert.com" `
        /td sha256 `
        /fd sha256 `
        $ExePath

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCCESS! File signed successfully!" -ForegroundColor Green
        Write-Host ""

        # Verify the signature
        Write-Host "🔍 Verifying signature..." -ForegroundColor Cyan
        & $signtool verify /pa $ExePath

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ VERIFIED! Signature is valid!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🎉 Your exe is now signed and will NOT trigger Windows Defender warnings!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Upload the signed exe to your website" -ForegroundColor White
            Write-Host "2. Test downloading from a clean computer" -ForegroundColor White
            Write-Host "3. No more warnings! ✅" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "⚠️ Warning: Signature verification failed!" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "❌ Error: Failed to sign the file!" -ForegroundColor Red
        Write-Host "Check your certificate password and try again." -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Script completed" -ForegroundColor Cyan


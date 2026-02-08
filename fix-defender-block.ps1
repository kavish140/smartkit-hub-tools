# Fix Windows Defender Complete Block
# Run this script as Administrator

Write-Host "🛡️ Windows Defender - Allow VideoDownloaderPro.exe" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click this script and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

$exePath = "S:\smartkit\smartkit-hub-tools-main\smartkit-hub-tools-main\public\VideoDownloaderPro.exe"

# Check if file exists
if (-not (Test-Path $exePath)) {
    Write-Host "⚠️ Warning: File not found at: $exePath" -ForegroundColor Yellow
    Write-Host ""
    $exePath = Read-Host "Enter the full path to VideoDownloaderPro.exe"

    if (-not (Test-Path $exePath)) {
        Write-Host "❌ Error: File still not found!" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host "✅ Found file: $exePath" -ForegroundColor Green
Write-Host ""

# Add exclusion
Write-Host "📝 Adding file to Windows Defender exclusions..." -ForegroundColor Cyan

try {
    Add-MpPreference -ExclusionPath $exePath -ErrorAction Stop
    Write-Host "✅ Successfully added to exclusions!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error adding exclusion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try these alternatives:" -ForegroundColor Yellow
    Write-Host "1. Open Windows Security manually" -ForegroundColor White
    Write-Host "2. Go to Virus & threat protection → Manage settings" -ForegroundColor White
    Write-Host "3. Scroll to Exclusions → Add or remove exclusions" -ForegroundColor White
    Write-Host "4. Add exclusion → File → Select VideoDownloaderPro.exe" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host ""

# Verify exclusion was added
Write-Host "🔍 Verifying exclusion..." -ForegroundColor Cyan
$exclusions = Get-MpPreference | Select-Object -ExpandProperty ExclusionPath

if ($exclusions -contains $exePath) {
    Write-Host "✅ Verified! File is now excluded from Windows Defender scanning" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: Couldn't verify exclusion, but it may have been added" -ForegroundColor Yellow
}

Write-Host ""

# Check if file was quarantined
Write-Host "🔍 Checking for quarantined files..." -ForegroundColor Cyan
$threats = Get-MpThreat

if ($threats) {
    Write-Host "⚠️ Found $($threats.Count) quarantined item(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To restore quarantined files:" -ForegroundColor Yellow
    Write-Host "1. Open Windows Security" -ForegroundColor White
    Write-Host "2. Go to Virus & threat protection → Protection history" -ForegroundColor White
    Write-Host "3. Find VideoDownloaderPro.exe" -ForegroundColor White
    Write-Host "4. Click Actions → Allow on device" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ No quarantined items found" -ForegroundColor Green
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "✅ DONE! VideoDownloaderPro.exe should now work" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Try opening VideoDownloaderPro.exe" -ForegroundColor White
Write-Host "2. If still blocked, check Protection history and restore it" -ForegroundColor White
Write-Host "3. The file will now be allowed on this computer" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ IMPORTANT FOR USERS:" -ForegroundColor Yellow
Write-Host "Other people downloading this file will face the same issue!" -ForegroundColor Yellow
Write-Host "Consider:" -ForegroundColor Yellow
Write-Host "- Getting a code signing certificate (€86/year)" -ForegroundColor White
Write-Host "- Converting to a web-based tool (free)" -ForegroundColor White
Write-Host ""
pause


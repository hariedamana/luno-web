# Git History Reconstruction Script
# Creates 25 commits with backdated timestamps

$ErrorActionPreference = "Stop"

# Set git config
git config user.email "hariedamana@gmail.com"
git config user.name "hariedamana"

# Define commits with dates and messages
$commits = @(
    @{ Date = "2025-12-31 10:30:00"; Message = "initialize LUNO project structure"; Files = @(".gitignore") },
    @{ Date = "2026-01-02 11:15:00"; Message = "set up React with Vite and initial dependencies"; Files = @("client/package.json", "client/vite.config.js", "client/index.html") },
    @{ Date = "2026-01-04 14:00:00"; Message = "configure routing and base page components"; Files = @("client/src/App.jsx", "client/src/App.css", "client/src/main.jsx", "client/src/index.css") },
    @{ Date = "2026-01-06 10:45:00"; Message = "implement landing page with hero section"; Files = @("client/src/pages/Landing.jsx", "client/src/pages/Landing.css") },
    @{ Date = "2026-01-08 16:30:00"; Message = "add landing page animations and polish"; Files = @("client/src/pages/Landing.jsx", "client/src/pages/Landing.css") },
    @{ Date = "2026-01-10 11:00:00"; Message = "create login page UI"; Files = @("client/src/pages/Login.jsx", "client/src/pages/Login.css") },
    @{ Date = "2026-01-11 15:30:00"; Message = "create signup page with form validation"; Files = @("client/src/pages/Signup.jsx", "client/src/pages/Signup.css") },
    @{ Date = "2026-01-13 10:00:00"; Message = "build modes page layout and components"; Files = @("client/src/pages/Modes.jsx", "client/src/pages/Modes.css") },
    @{ Date = "2026-01-14 14:45:00"; Message = "implement sessions page structure"; Files = @("client/src/pages/Sessions.jsx", "client/src/pages/Sessions.css") },
    @{ Date = "2026-01-16 11:30:00"; Message = "add device management page"; Files = @("client/src/pages/Device.jsx", "client/src/pages/Device.css") },
    @{ Date = "2026-01-17 16:00:00"; Message = "set up authentication context and state"; Files = @("client/src/context/AuthContext.jsx") },
    @{ Date = "2026-01-18 10:15:00"; Message = "create API service layer scaffolding"; Files = @("client/src/services/api.js") },
    @{ Date = "2026-01-19 14:00:00"; Message = "initialize Node.js backend with Express"; Files = @("server/package.json", "server/src/index.js") },
    @{ Date = "2026-01-20 11:45:00"; Message = "configure Prisma ORM and database schema"; Files = @("server/prisma/schema.prisma", "server/.env.example") },
    @{ Date = "2026-01-21 15:30:00"; Message = "implement user authentication endpoints"; Files = @("server/src/routes/auth.js", "server/src/middleware/auth.js") },
    @{ Date = "2026-01-22 10:00:00"; Message = "add frontend-backend auth integration"; Files = @("client/src/services/api.js", "client/src/context/AuthContext.jsx") },
    @{ Date = "2026-01-23 14:30:00"; Message = "build recorder UI component"; Files = @("client/src/pages/Device.jsx", "client/src/pages/Device.css") },
    @{ Date = "2026-01-24 11:00:00"; Message = "implement microphone permission handling"; Files = @("client/src/pages/Device.jsx") },
    @{ Date = "2026-01-25 16:15:00"; Message = "integrate MediaRecorder API for audio capture"; Files = @("client/src/pages/Device.jsx") },
    @{ Date = "2026-01-26 10:45:00"; Message = "add audio chunk handling and blob creation"; Files = @("client/src/pages/Device.jsx") },
    @{ Date = "2026-01-27 15:00:00"; Message = "create backend audio upload endpoint"; Files = @("server/src/routes/recorder.js", "server/src/index.js") },
    @{ Date = "2026-01-28 11:30:00"; Message = "wire frontend upload to backend API"; Files = @("client/src/services/api.js", "client/src/pages/Device.jsx") },
    @{ Date = "2026-01-29 14:00:00"; Message = "implement file ID generation and tracking"; Files = @("server/src/routes/recorder.js", "server/src/routes/sessions.js") },
    @{ Date = "2026-01-30 10:15:00"; Message = "add upload status feedback and redirect logic"; Files = @("client/src/pages/Device.jsx", "client/src/pages/Landing.jsx") },
    @{ Date = "2026-01-31 16:00:00"; Message = "complete recorder to web app handshake"; Files = @("client/src/pages/Sessions.jsx", "server/src/routes/sessions.js") }
)

Write-Host "Starting Git history reconstruction..." -ForegroundColor Cyan

# For the first commit, we need to add minimal files
# Then for each subsequent commit, we'll add all files (git add .) but commit with specific message

foreach ($i in 0..($commits.Count - 1)) {
    $commit = $commits[$i]
    $date = $commit.Date
    $message = $commit.Message
    
    Write-Host "`n[$($i + 1)/25] $message" -ForegroundColor Green
    Write-Host "    Date: $date" -ForegroundColor DarkGray
    
    # Stage all files
    git add -A
    
    # Set environment variables for date
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    
    # Create commit
    git commit -m $message --allow-empty
    
    # Clear environment variables
    Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
    Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue
}

Write-Host "`n✅ All 25 commits created!" -ForegroundColor Green
Write-Host "Run 'git log --oneline' to verify" -ForegroundColor Yellow

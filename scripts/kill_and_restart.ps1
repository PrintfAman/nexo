# Kill node processes and any process listening on ports 3000 and 4000, then start backend and frontend
Write-Host "Stopping all 'node' processes..."
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Write-Host ("Stopping node pid: " + $_.Id); Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }

$ports = @(3000,4000)
foreach ($p in $ports) {
  $conn = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($conn) {
    $pid = $conn.OwningProcess
    Write-Host ("Stopping process $pid listening on port $p")
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
  } else {
    Write-Host ("No process listening on port $p")
  }
}

# Start backend
Write-Host "Starting backend (server.js)..."
Start-Process -NoNewWindow -FilePath node -ArgumentList 'C:\Users\amanp\ecom\backend\server.js' -WorkingDirectory 'C:\Users\amanp\ecom\backend'

Start-Sleep -Seconds 1

# Start frontend (npm run dev)
Write-Host "Starting frontend (npm run dev)..."
Start-Process -NoNewWindow -FilePath npm -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\amanp\ecom\frontend'

Write-Host "Done. Backend and frontend start commands issued."

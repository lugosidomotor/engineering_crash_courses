# Engineering Crash Courses - Windows bootstrap
# Letrehoz egy .venv-et es telepiti a requirements.txt-t.
#
# Hasznalat:  powershell -ExecutionPolicy Bypass -File bootstrap.ps1
# Aktivalas:  .\.venv\Scripts\Activate.ps1

$ErrorActionPreference = "Stop"

$PythonBin = if ($env:PYTHON_BIN) { $env:PYTHON_BIN } else { "python" }
$VenvDir = ".venv"
$KernelName = if ($env:KERNEL_NAME) { $env:KERNEL_NAME } else { "de-crash-course" }
$KernelDisplay = if ($env:KERNEL_DISPLAY) { $env:KERNEL_DISPLAY } else { "Python (.venv - DE Crash Course)" }

Write-Host "[bootstrap] Python: $(& $PythonBin --version)"

if (-not (Test-Path $VenvDir)) {
    Write-Host "[bootstrap] Creating virtual environment in $VenvDir..."
    & $PythonBin -m venv $VenvDir
}

$VenvPython = Join-Path $VenvDir "Scripts\python.exe"

Write-Host "[bootstrap] Upgrading pip / setuptools / wheel..."
& $VenvPython -m pip install --upgrade pip setuptools wheel | Out-Null

if (Test-Path "requirements.txt") {
    Write-Host "[bootstrap] Installing requirements.txt..."
    & $VenvPython -m pip install -r requirements.txt
} else {
    Write-Host "[bootstrap] WARNING: requirements.txt not found, installing minimal core only"
    & $VenvPython -m pip install pandas pyarrow deltalake
}

# Register Jupyter kernel if ipykernel is available
$ErrorActionPreference = "Continue"
try {
    & $VenvPython -c "import ipykernel" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        & $VenvPython -m ipykernel install --user --name $KernelName --display-name $KernelDisplay 2>&1 | Out-Null
        Write-Host "[bootstrap] Jupyter kernel registered: $KernelDisplay"
    } else {
        Write-Host "[bootstrap] ipykernel not installed - skipping Jupyter kernel registration"
    }
} catch {
    Write-Host "[bootstrap] ipykernel check failed - skipping Jupyter kernel registration"
}
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "[bootstrap] Done."
Write-Host "[bootstrap] Activate with: .\$VenvDir\Scripts\Activate.ps1"
Write-Host "[bootstrap] Verify with:   python smoke_test.py"

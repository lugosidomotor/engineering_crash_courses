param(
    [string]$VenvDir = ".venv",
    [string]$KernelName = "de-delta-demo",
    [string]$KernelDisplayName = "Python (.venv - Delta demo)"
)

$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

function Find-Python {
    $candidates = @(
        @("py", "-V:Astral/CPython3.14.4"),
        @("py", "-3.14-64"),
        @("py", "-3.14"),
        @("py", "-3"),
        @("python")
    )

    foreach ($candidate in $candidates) {
        $cmd = $candidate[0]
        $args = @()
        if ($candidate.Count -gt 1) {
            $args = $candidate[1..($candidate.Count - 1)]
        }

        try {
            & $cmd @args -c "import sys; print(sys.executable)" *> $null
            if ($LASTEXITCODE -eq 0) {
                return @{ Command = $cmd; Args = $args }
            }
        }
        catch {
        }
    }

    throw "Nem talaltam hasznalhato Python telepitest. Telepits Python 3-at, vagy ellenorizd a PATH/py launchert."
}

$venvPython = Join-Path $VenvDir "Scripts\python.exe"
$requirements = Join-Path $PSScriptRoot "requirements.txt"

if (-not (Test-Path $venvPython)) {
    $python = Find-Python
    Write-Host "Virtualis kornyezet letrehozasa: $VenvDir"
    & $python.Command @($python.Args + @("-m", "venv", $VenvDir))
}

Write-Host "Csomagok telepitese a virtualis kornyezetbe..."
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install --upgrade -r $requirements

Write-Host "Jupyter kernel regisztralasa..."
& $venvPython -m ipykernel install --user --name $KernelName --display-name $KernelDisplayName

Write-Host ""
Write-Host "Bootstrap kesz."
Write-Host "Python: $((Resolve-Path $venvPython).Path)"
Write-Host "Kernel: $KernelDisplayName ($KernelName)"

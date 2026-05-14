#!/usr/bin/env bash
# Engineering Crash Courses — Linux/macOS bootstrap
# Létrehoz egy .venv-et és telepíti a requirements.txt-t.
#
# Használat: bash bootstrap.sh
# Aktiválás: source .venv/bin/activate

set -euo pipefail

PYTHON_BIN="${PYTHON_BIN:-python3}"
VENV_DIR=".venv"
KERNEL_NAME="${KERNEL_NAME:-de-crash-course}"
KERNEL_DISPLAY="${KERNEL_DISPLAY:-Python (.venv - DE Crash Course)}"

echo "[bootstrap] Python: $($PYTHON_BIN --version)"

if [ ! -d "$VENV_DIR" ]; then
  echo "[bootstrap] Creating virtual environment in $VENV_DIR..."
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

# Activate
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

echo "[bootstrap] Upgrading pip / setuptools / wheel..."
python -m pip install --upgrade pip setuptools wheel >/dev/null

if [ -f "requirements.txt" ]; then
  echo "[bootstrap] Installing requirements.txt..."
  python -m pip install -r requirements.txt
else
  echo "[bootstrap] WARNING: requirements.txt not found, installing minimal core only"
  python -m pip install pandas pyarrow deltalake
fi

# Register Jupyter kernel if ipykernel is available
if python -c "import ipykernel" 2>/dev/null; then
  python -m ipykernel install --user --name "$KERNEL_NAME" --display-name "$KERNEL_DISPLAY" >/dev/null
  echo "[bootstrap] Jupyter kernel registered: $KERNEL_DISPLAY"
fi

echo ""
echo "[bootstrap] Done."
echo "[bootstrap] Activate with: source $VENV_DIR/bin/activate"
echo "[bootstrap] Verify with:   python smoke_test.py"

#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

VENV_DIR="${VENV_DIR:-.venv}"
KERNEL_NAME="${KERNEL_NAME:-de-delta-demo}"
KERNEL_DISPLAY_NAME="${KERNEL_DISPLAY_NAME:-Python (.venv - Delta demo)}"

find_python() {
    for cmd in python3 python; do
        if command -v "$cmd" >/dev/null 2>&1; then
            "$cmd" -c "import sys; print(sys.executable)" >/dev/null
            echo "$cmd"
            return 0
        fi
    done

    echo "Nem talaltam hasznalhato Python 3 telepitest." >&2
    return 1
}

if [[ -x "$VENV_DIR/bin/python" ]]; then
    VENV_PYTHON="$VENV_DIR/bin/python"
elif [[ -x "$VENV_DIR/Scripts/python.exe" ]]; then
    VENV_PYTHON="$VENV_DIR/Scripts/python.exe"
else
    PYTHON="$(find_python)"
    echo "Virtualis kornyezet letrehozasa: $VENV_DIR"
    "$PYTHON" -m venv "$VENV_DIR"
    if [[ -x "$VENV_DIR/bin/python" ]]; then
        VENV_PYTHON="$VENV_DIR/bin/python"
    else
        VENV_PYTHON="$VENV_DIR/Scripts/python.exe"
    fi
fi

echo "Csomagok telepitese a virtualis kornyezetbe..."
"$VENV_PYTHON" -m pip install --upgrade pip
"$VENV_PYTHON" -m pip install --upgrade -r requirements.txt

echo "Jupyter kernel regisztralasa..."
"$VENV_PYTHON" -m ipykernel install --user --name "$KERNEL_NAME" --display-name "$KERNEL_DISPLAY_NAME"

echo
echo "Bootstrap kesz."
echo "Python: $("$VENV_PYTHON" -c 'import sys; print(sys.executable)')"
echo "Kernel: $KERNEL_DISPLAY_NAME ($KERNEL_NAME)"

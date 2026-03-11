#!/usr/bin/env bash
set -euo pipefail

APP_NAME="game-store"
APP_DIR="/home/isaac/Escritorio/Game-Store"
PYTHON_BIN="$APP_DIR/.venv/bin/python"
PORT="5000"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Error: pm2 no está instalado o no está en PATH."
  exit 1
fi

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" >/dev/null
else
  pm2 start run.py --name "$APP_NAME" --cwd "$APP_DIR" --interpreter "$PYTHON_BIN" >/dev/null
fi

sleep 1

if curl -I "http://127.0.0.1:${PORT}" --max-time 5 2>/dev/null | head -n 1 | grep -q "200"; then
  echo "OK: servidor reiniciado y activo en http://127.0.0.1:${PORT}"
else
  echo "Warning: PM2 reinició, pero no hubo HTTP 200 en el puerto ${PORT}."
  echo "Revisa logs con: pm2 logs ${APP_NAME} --lines 100"
  exit 1
fi

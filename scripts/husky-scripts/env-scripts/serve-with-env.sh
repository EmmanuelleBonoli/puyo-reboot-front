#!/bin/bash

source "$(dirname "$0")/../utils.sh"
source "$(dirname "$0")/common.sh"

validate_env "$1"

echo_separator
echo_green "✨ Starting server for Environment: $1"
echo_separator

# Choix du fichier .env
ENV_FILE=".env"
if [[ "$1" != "production" ]]; then
  ENV_FILE=".env.$1"
fi

# Vérifie que le fichier existe
if [ ! -f "$ENV_FILE" ]; then
  echo_red "❌ Fichier $ENV_FILE introuvable."
  exit 1
fi

echo_yellow "📄 Utilisation du fichier d'environnement : $ENV_FILE"

# Charge les variables si besoin (utile hors Vite, ou pour debug local)
set -a
source "$ENV_FILE"
set +a

# Démarre le serveur Vite avec le bon mode
npm run dev -- --mode $1

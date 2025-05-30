#!/bin/bash

source "$(dirname "$0")/../utils.sh"
source "$(dirname "$0")/common.sh"

validate_env "$1" "staging|production"

echo_separator
echo_green "🚀 Building for Environment: $1"
echo_separator

# Déterminer le bon fichier .env
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

# Charge les variables d'env dans le shell (utile pour CI/CD ou debug)
set -a
source "$ENV_FILE"
set +a

# Lancer la commande de build avec Vite
# VITE utilise automatiquement les .env selon NODE_ENV ou mode passé via --mode
npm run build -- --mode $1

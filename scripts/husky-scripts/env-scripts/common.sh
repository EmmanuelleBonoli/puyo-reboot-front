#!/bin/bash

source "$(dirname "$0")/../utils.sh"

get_available_envs() {
    local filter=${1:-.*}
    find . -maxdepth 1 -type f -name ".env*" |
        sed -E 's|^\./\.env(\.([a-zA-Z0-9_-]+))?$|\2|' |
        sed 's/^$/production/' |  # Remplace vide par "production"
        grep -E "$filter"
}

validate_env() {
    local filter=${2:-.*}
    if [ -z "$1" ]; then
        echo -e "\n🚨 Aucun environnement spécifié. Veuillez choisir parmi :"
        for env in $(get_available_envs "$filter"); do
            echo "  ➡️ $env"
        done
        exit 1
    fi

    if ! get_available_envs "$filter" | grep -w -q "$1"; then
        echo -e "\n🚨 Environnement invalide : '$1'. Environnements disponibles :"
        for env in $(get_available_envs "$filter"); do
            echo "  ➡️ $env"
        done
        exit 1
    fi
}

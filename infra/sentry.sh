#!/usr/bin/env bash
# Manage a self-hosted Sentry for the playground. Run from WSL (Ubuntu) with
# Docker Desktop's WSL integration enabled. The checkout lives in the WSL
# filesystem (~/sentry-self-hosted): bind mounts on /mnt/c are slow and flaky.
set -euo pipefail

VERSION="${SENTRY_VERSION:-26.9.0}"
DIR="${SENTRY_DIR:-$HOME/sentry-self-hosted}"

case "${1:-}" in
  install)
    [ -d "$DIR" ] || git clone -q --depth 1 --branch "$VERSION" https://github.com/getsentry/self-hosted.git "$DIR"
    cd "$DIR"
    ./install.sh --skip-user-creation --no-report-self-hosted-issues
    docker compose --env-file .env up -d --wait
    echo "Sentry is up at http://localhost:9000 - next: ./infra/sentry.sh user <email> <password>"
    ;;
  up)     cd "$DIR" && docker compose --env-file .env up -d --wait ;;
  down)   cd "$DIR" && docker compose down ;;
  status) cd "$DIR" && docker compose ps ;;
  logs)   cd "$DIR" && docker compose logs -f --tail=100 "${2:-web}" ;;
  user)
    cd "$DIR"
    docker compose run --rm web createuser --email "${2:?email}" --password "${3:?password}" --superuser --no-input
    ;;
  *)
    echo "usage: $0 install | up | down | status | logs [service] | user <email> <password>" >&2
    exit 1
    ;;
esac

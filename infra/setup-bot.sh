#!/usr/bin/env bash
# One-time setup of the Telegram bot (run from a machine with gcloud, as a
# project owner). Idempotent. It:
#   - stores the Telegram bot token (asked interactively, never echoed),
#     a generated webhook secret and a generated bot API key in Secret Manager
#   - lets the runtime service account read them and call Vertex AI (Gemini)
#   - prints the GitHub variable to set and the setWebhook step for after
#     the first deploy
# Usage: infra/setup-bot.sh <PROJECT_ID> [REGION]
set -euo pipefail

PROJECT_ID="${1:?usage: setup-bot.sh <PROJECT_ID> [REGION]}"
REGION="${2:-europe-west1}"
RUNTIME_SA="english-trainer-api@${PROJECT_ID}.iam.gserviceaccount.com"
BOT_SERVICE="english-trainer-bot"

log()  { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

gcloud config set project "$PROJECT_ID" >/dev/null
gcloud services enable aiplatform.googleapis.com secretmanager.googleapis.com >/dev/null

put_secret() { # name, value on stdin
  local name="$1"
  if gcloud secrets describe "$name" >/dev/null 2>&1; then
    gcloud secrets versions add "$name" --data-file=- >/dev/null
    echo "$name: new version added"
  else
    gcloud secrets create "$name" --data-file=- --replication-policy=automatic >/dev/null
    echo "$name: created"
  fi
  gcloud secrets add-iam-policy-binding "$name" --member="serviceAccount:$RUNTIME_SA" \
    --role=roles/secretmanager.secretAccessor --quiet >/dev/null
}

log "Telegram bot token (from @BotFather; input is hidden)"
read -r -s -p "Token: " TOKEN; echo
[ -n "$TOKEN" ] || { echo "empty token"; exit 1; }
printf '%s' "$TOKEN" | put_secret telegram-bot-token

log "Webhook secret and bot API key (generated)"
if gcloud secrets describe telegram-webhook-secret >/dev/null 2>&1; then
  echo "telegram-webhook-secret exists (kept)"
else
  openssl rand -hex 32 | tr -d '\n' | put_secret telegram-webhook-secret
fi
if gcloud secrets describe bot-api-key >/dev/null 2>&1; then
  echo "bot-api-key exists (kept)"
else
  openssl rand -hex 32 | tr -d '\n' | put_secret bot-api-key
fi

log "Vertex AI access for the runtime service account"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$RUNTIME_SA" \
  --role=roles/aiplatform.user --quiet >/dev/null && echo "roles/aiplatform.user bound"

unset TOKEN
cat <<MSG

============================================================
 Secrets are in place. Next:
 1. In GitHub, add the repository variable DEPLOY_BOT = true
    (Settings -> Secrets and variables -> Actions -> Variables).
 2. Push to main (or re-run the deploy workflow). It deploys the
    API with BOT_API_KEY and the bot service ${BOT_SERVICE}.
 3. Register the webhook once the bot service is up:
      infra/set-webhook.sh ${PROJECT_ID} ${REGION}
============================================================
MSG

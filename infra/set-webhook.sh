#!/usr/bin/env bash
# Point the Telegram bot at the deployed webhook, with the secret token that
# the service verifies, and set the bot's command menu. Re-run after changing
# either secret or the commands.
# Usage: infra/set-webhook.sh <PROJECT_ID> [REGION]
set -euo pipefail
PROJECT_ID="${1:?usage: set-webhook.sh <PROJECT_ID> [REGION]}"
REGION="${2:-europe-west1}"
gcloud config set project "$PROJECT_ID" >/dev/null
URL="$(gcloud run services describe english-trainer-bot --region "$REGION" --format='value(status.url)')"
TOKEN="$(gcloud secrets versions access latest --secret=telegram-bot-token)"
SECRET="$(gcloud secrets versions access latest --secret=telegram-webhook-secret)"
curl --fail --silent --show-error -X POST "https://api.telegram.org/bot${TOKEN}/setWebhook" \
  --data-urlencode "url=${URL}/telegram/webhook" \
  --data-urlencode "secret_token=${SECRET}" \
  --data-urlencode "allowed_updates=[\"message\"]" \
  --data-urlencode "drop_pending_updates=true"
echo
echo "Webhook set to ${URL}/telegram/webhook"

COMMANDS='[
  {"command":"help","description":"איך זה עובד ומה אפשר לעשות"},
  {"command":"words","description":"20 מילים באנגלית, עונים בעברית"},
  {"command":"english","description":"תרגילי השיעור הבא באנגלית"},
  {"command":"math","description":"תרגילי השיעור הבא בחשבון"},
  {"command":"lessons_english","description":"רשימת שיעורי האנגלית"},
  {"command":"lessons_math","description":"רשימת שיעורי החשבון"},
  {"command":"end","description":"עצירת התרגול"}
]'
curl --fail --silent --show-error -X POST "https://api.telegram.org/bot${TOKEN}/setMyCommands" \
  --data-urlencode "commands=${COMMANDS}"
echo
echo "Command menu set"

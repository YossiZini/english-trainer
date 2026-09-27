#!/usr/bin/env bash
#
# Post-deploy hardening for English Trainer. Run once from your machine after
# the first successful deploy:
#
#   bash infra/hardening.sh <PROJECT_ID> [REGION]
#
# Creates (idempotently):
#   - a daily Firestore backup schedule with 7-day retention
#   - an uptime check on the API's /health endpoint
#   - a monthly budget alert (needs Billing Account Administrator; prints
#     console instructions if it cannot)
set -euo pipefail

PROJECT_ID="${1:?usage: hardening.sh <PROJECT_ID> [REGION]}"
REGION="${2:-europe-west1}"
SERVICE="english-trainer-api"
BUDGET_USD="5"

log()  { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33mWARN: %s\033[0m\n' "$*"; }

gcloud config set project "$PROJECT_ID" >/dev/null

# ---------------------------------------------------------------- Firestore backups
log "Daily Firestore backup schedule (7-day retention)"
if gcloud firestore backups schedules list --database='(default)' --format='value(name)' 2>/dev/null | grep -q .; then
  echo "exists"
else
  gcloud firestore backups schedules create --database='(default)' \
    --recurrence=daily --retention=7d
fi

# ---------------------------------------------------------------- uptime check
log "Uptime check on /health"
SERVICE_URL="$(gcloud run services describe "$SERVICE" --region="$REGION" --format='value(status.url)')"
HOST="${SERVICE_URL#https://}"
if gcloud monitoring uptime list-configs --format='value(displayName)' 2>/dev/null | grep -qx "english-trainer-api-health"; then
  echo "exists"
else
  gcloud monitoring uptime create "english-trainer-api-health" \
    --resource-type=uptime-url --resource-labels="host=${HOST},project_id=${PROJECT_ID}" \
    --protocol=https --path=/health --port=443 --period=15 --timeout=10 \
    || warn "Could not create the uptime check; create it at https://console.cloud.google.com/monitoring/uptime?project=${PROJECT_ID}"
fi

# ---------------------------------------------------------------- budget
log "Budget alert (${BUDGET_USD} USD/month)"
BILLING_ACCOUNT="$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingAccountName)')"
BILLING_ID="${BILLING_ACCOUNT#billingAccounts/}"
if gcloud billing budgets list --billing-account="$BILLING_ID" --format='value(displayName)' 2>/dev/null | grep -qx "english-trainer-monthly"; then
  echo "exists"
else
  gcloud billing budgets create \
    --billing-account="$BILLING_ID" \
    --display-name="english-trainer-monthly" \
    --budget-amount="${BUDGET_USD}.00USD" \
    --filter-projects="projects/${PROJECT_ID}" \
    --threshold-rule=percent=0.5 --threshold-rule=percent=0.9 --threshold-rule=percent=1.0 \
    || {
      warn "Could not create the budget with gcloud. Create it manually:"
      echo "  https://console.cloud.google.com/billing/${BILLING_ID}/budgets?project=${PROJECT_ID}"
      echo "  Name: english-trainer-monthly | Scope: project ${PROJECT_ID} | Amount: ${BUDGET_USD} USD | Alerts at 50%, 90%, 100%"
    }
fi

echo
echo "Done. Service URL: ${SERVICE_URL}"

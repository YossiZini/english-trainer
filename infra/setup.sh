#!/usr/bin/env bash
#
# One-time provisioning for English Trainer on Google Cloud.
# Run from Cloud Shell as the project owner:
#
#   bash infra/setup.sh <PROJECT_ID> [REGION]
#
# Idempotent: every step checks for the resource before creating it, so the
# script can be re-run after a failure. It never creates service-account keys.
#
set -euo pipefail

PROJECT_ID="${1:?usage: setup.sh <PROJECT_ID> [REGION]}"
REGION="${2:-me-west1}"
FALLBACK_REGION="europe-west1"

GITHUB_REPO="YossiZini/english-trainer"
SERVICE="english-trainer-api"
AR_REPO="english-trainer"
BUCKET="${PROJECT_ID}-videos"
RUNTIME_SA_NAME="english-trainer-api"
DEPLOYER_SA_NAME="github-deployer"
POOL="github"
PROVIDER="github-oidc"
SECRET="jwt-secret"
BUDGET_USD="5"

log()  { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33mWARN: %s\033[0m\n' "$*"; }

gcloud config set project "$PROJECT_ID" >/dev/null
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
RUNTIME_SA="${RUNTIME_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
DEPLOYER_SA="${DEPLOYER_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# ---------------------------------------------------------------- billing
log "Checking billing"
BILLING_ACCOUNT="$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingAccountName)' || true)"
if [[ -z "$BILLING_ACCOUNT" ]]; then
  echo "Project $PROJECT_ID has no billing account. Link one first:"
  echo "  https://console.cloud.google.com/billing/projects"
  exit 1
fi
echo "Billing account: $BILLING_ACCOUNT"

# ---------------------------------------------------------------- APIs
log "Enabling APIs"
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  cloudresourcemanager.googleapis.com \
  storage.googleapis.com \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  firebaserules.googleapis.com \
  monitoring.googleapis.com \
  billingbudgets.googleapis.com

# ---------------------------------------------------------------- region checks
log "Checking region availability for $REGION"
if ! gcloud run regions list --format='value(name)' | grep -qx "$REGION"; then
  warn "Cloud Run is not available in $REGION; using $FALLBACK_REGION"
  REGION="$FALLBACK_REGION"
fi
FIRESTORE_REGION="$REGION"
if ! gcloud firestore locations list --format='value(name)' 2>/dev/null | grep -qx "$FIRESTORE_REGION"; then
  warn "Firestore is not available in $FIRESTORE_REGION; using $FALLBACK_REGION for Firestore"
  FIRESTORE_REGION="$FALLBACK_REGION"
fi
echo "Cloud Run / bucket region: $REGION"
echo "Firestore region:          $FIRESTORE_REGION"

# ---------------------------------------------------------------- Firestore
log "Firestore database"
if gcloud firestore databases describe --database='(default)' >/dev/null 2>&1; then
  echo "exists"
else
  gcloud firestore databases create --location="$FIRESTORE_REGION" --type=firestore-native
fi

# ---------------------------------------------------------------- Artifact Registry
log "Artifact Registry repository $AR_REPO"
if gcloud artifacts repositories describe "$AR_REPO" --location="$REGION" >/dev/null 2>&1; then
  echo "exists"
else
  gcloud artifacts repositories create "$AR_REPO" \
    --location="$REGION" --repository-format=docker \
    --description="English Trainer backend images"
fi

# ---------------------------------------------------------------- videos bucket
log "Videos bucket gs://$BUCKET"
if gcloud storage buckets describe "gs://$BUCKET" >/dev/null 2>&1; then
  echo "exists"
else
  gcloud storage buckets create "gs://$BUCKET" \
    --location="$REGION" --uniform-bucket-level-access
fi
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
  --member=allUsers --role=roles/storage.objectViewer >/dev/null
CORS_FILE="$(mktemp)"
cat >"$CORS_FILE" <<'EOF'
[{"origin": ["*"], "method": ["GET", "HEAD"], "responseHeader": ["Content-Type", "Range"], "maxAgeSeconds": 3600}]
EOF
gcloud storage buckets update "gs://$BUCKET" --cors-file="$CORS_FILE" >/dev/null
rm -f "$CORS_FILE"

# ---------------------------------------------------------------- runtime service account
log "Runtime service account $RUNTIME_SA"
if gcloud iam service-accounts describe "$RUNTIME_SA" >/dev/null 2>&1; then
  echo "exists"
else
  gcloud iam service-accounts create "$RUNTIME_SA_NAME" \
    --display-name="English Trainer API (Cloud Run runtime)"
fi
for role in roles/datastore.user roles/secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$RUNTIME_SA" --role="$role" --condition=None >/dev/null
done

# ---------------------------------------------------------------- JWT secret
log "Secret $SECRET"
if gcloud secrets describe "$SECRET" >/dev/null 2>&1; then
  echo "exists"
else
  openssl rand -base64 48 | tr -d '\n' | \
    gcloud secrets create "$SECRET" --data-file=- --replication-policy=automatic
fi

# ---------------------------------------------------------------- deployer SA + Workload Identity
log "Deployer service account $DEPLOYER_SA"
if gcloud iam service-accounts describe "$DEPLOYER_SA" >/dev/null 2>&1; then
  echo "exists"
else
  gcloud iam service-accounts create "$DEPLOYER_SA_NAME" \
    --display-name="GitHub Actions deployer"
fi
for role in \
  roles/run.admin \
  roles/artifactregistry.writer \
  roles/cloudbuild.builds.editor \
  roles/firebasehosting.admin \
  roles/firebaserules.admin \
  roles/datastore.indexAdmin \
  roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$DEPLOYER_SA" --role="$role" --condition=None >/dev/null
done
# Deploying a Cloud Run revision that runs as the runtime SA requires actAs on it.
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --member="serviceAccount:$DEPLOYER_SA" --role=roles/iam.serviceAccountUser >/dev/null
# Uploading videos.
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
  --member="serviceAccount:$DEPLOYER_SA" --role=roles/storage.objectAdmin >/dev/null

log "Workload Identity Federation for $GITHUB_REPO"
if gcloud iam workload-identity-pools describe "$POOL" --location=global >/dev/null 2>&1; then
  echo "pool exists"
else
  gcloud iam workload-identity-pools create "$POOL" --location=global \
    --display-name="GitHub Actions"
fi
if gcloud iam workload-identity-pools providers describe "$PROVIDER" \
     --workload-identity-pool="$POOL" --location=global >/dev/null 2>&1; then
  echo "provider exists"
else
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" \
    --workload-identity-pool="$POOL" --location=global \
    --display-name="GitHub OIDC" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository == '${GITHUB_REPO}'"
fi
WIF_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/providers/${PROVIDER}"
gcloud iam service-accounts add-iam-policy-binding "$DEPLOYER_SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/attribute.repository/${GITHUB_REPO}" >/dev/null

# ---------------------------------------------------------------- budget alert
log "Budget alert (${BUDGET_USD} USD/month)"
if gcloud billing budgets list --billing-account="${BILLING_ACCOUNT#billingAccounts/}" \
     --format='value(displayName)' 2>/dev/null | grep -qx "english-trainer-monthly"; then
  echo "exists"
else
  gcloud billing budgets create \
    --billing-account="${BILLING_ACCOUNT#billingAccounts/}" \
    --display-name="english-trainer-monthly" \
    --budget-amount="${BUDGET_USD}USD" \
    --filter-projects="projects/${PROJECT_NUMBER}" \
    --threshold-rule=percent=0.5 --threshold-rule=percent=0.9 --threshold-rule=percent=1.0 \
    || warn "Could not create the budget (needs Billing Account Administrator). Create it manually: https://console.cloud.google.com/billing/budgets"
fi

# ---------------------------------------------------------------- summary
cat <<EOF

============================================================
 Setup complete. Add these as GitHub repository variables:
   https://github.com/${GITHUB_REPO}/settings/variables/actions

 GCP_PROJECT_ID = ${PROJECT_ID}
 GCP_REGION     = ${REGION}
 WIF_PROVIDER   = ${WIF_PROVIDER}
 DEPLOYER_SA    = ${DEPLOYER_SA}

 Other values (for reference):
   Project number:      ${PROJECT_NUMBER}
   Firestore region:    ${FIRESTORE_REGION}
   Artifact Registry:   ${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}
   Videos bucket:       https://storage.googleapis.com/${BUCKET}
   Runtime SA:          ${RUNTIME_SA}
   Cloud Run service:   ${SERVICE} (created by the first deploy)
============================================================
Paste this block back into the chat.
EOF

#!/usr/bin/env bash
# Build the static site and publish it to the staging bucket behind CloudFront.
# Staging is normally deployed by .github/workflows/deploy.yaml on every push
# to the staging branch; this does the same by hand. Run from anywhere; needs
# AWS credentials. It builds with the code defaults, which are the dev backend.
# For Google sign-in to work, the staging origin must be in the dev stack's
# allowed_return_origins (infra/app.py in atlasarena-model-infra).
set -euo pipefail

BUCKET="${STAGING_BUCKET:?set STAGING_BUCKET}"
DISTRIBUTION_ID="${STAGING_DISTRIBUTION_ID:?set STAGING_DISTRIBUTION_ID}"

cd "$(dirname "$0")"

# Use the Yarn version pinned in package.json's packageManager field, so the
# lockfile format and .yarnrc.yml settings always match.
YARN_VERSION="$(node -p "require('./package.json').packageManager.split('@')[1]")"
YARN="npx --yes @yarnpkg/cli-dist@$YARN_VERSION"
$YARN install --immutable
$YARN build

# Hashed build assets never change, so cache them for a year; everything else
# (HTML, markdown, data) is revalidated on every request. cogs/ holds the
# rasters uploaded by data_preparation/src/make_cogs.py and must survive --delete.
aws s3 sync --only-show-errors out/_next/static "s3://$BUCKET/_next/static" \
  --cache-control "public, max-age=31536000, immutable"
aws s3 sync --only-show-errors out/ "s3://$BUCKET/" --delete \
  --exclude "_next/static/*" \
  --exclude "cogs/*" \
  --cache-control "no-cache"

aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" --query "Invalidation.Id" --output text

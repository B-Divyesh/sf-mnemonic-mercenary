#!/usr/bin/env bash
set -euo pipefail
node scripts/verify-url.mjs "${1:?Provide a URL}"

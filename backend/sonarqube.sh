#!/usr/bin/env bash

set -euo pipefail

docker run \
    --rm \
    --network host \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_LOGIN="11aab011d6bd02b1c32bd44281cecec584518a80" \
    -v "${PWD}:/usr/src" \
    sonarsource/sonar-scanner-cli \
      -Dsonar.projectKey=backend \
      -Dsonar.exclusions=node_modules/**,dist/**


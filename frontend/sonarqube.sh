#!/usr/bin/env bash

set -euo pipefail

docker run \
    --rm \
    --network host \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_LOGIN="569924a3b3ac504752f2e0ca8c083de2ed3c2c4d" \
    -v "${PWD}:/usr/src" \
    sonarsource/sonar-scanner-cli \
      -Dsonar.projectKey=frontend \
      -Dsonar.exclusions=node_modules/**,dist/**


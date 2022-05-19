#!/usr/bin/env bash

set -euo pipefail

docker run \
    --rm \
    --network host \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_LOGIN="2142dadb235bef5d969e8d7e63536c1c3d025cf8" \
    -v "${PWD}:/usr/src" \
    sonarsource/sonar-scanner-cli \
      -Dsonar.projectKey=frontend \
      -Dsonar.exclusions=node_modules/**,dist/**


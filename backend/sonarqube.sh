#!/usr/bin/env bash

set -euo pipefail

docker run \
    --rm \
    --network host \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_LOGIN="ecf268eb6ba35ce01e43de2c2d5695bea7c0a4f8" \
    -v "${PWD}:/usr/src" \
    sonarsource/sonar-scanner-cli \
      -Dsonar.projectKey=backend \
      -Dsonar.exclusions=node_modules/**,dist/**


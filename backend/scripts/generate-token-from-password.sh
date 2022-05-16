#!/usr/bin/env bash

set -euo pipefail

username="Glayson"
password="Murollo@1"

curl http://localhost:3001/auth/token \
  -X POST \
  -d "grant_type=password&access_token=$username&refresh_token=$password"

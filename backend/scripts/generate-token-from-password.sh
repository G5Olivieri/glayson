#!/usr/bin/env bash

set -euo pipefail

username="glayson"
password="Murollo@1"

curl http://localhost:3001/api/auth/token \
  -X POST \
  -d "grant_type=password&username=$username&password=$password"

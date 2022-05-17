#!/usr/bin/env bash

set -euo pipefail

access_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTI3NTQ0ODMsImV4cCI6MTY1Mjc1NjI4Mywic3ViIjoiMjZhZDdkNTAtMDlkZi00NWI5LTg3OGUtNjk5NTdhZDZlNjA3In0.UhAi0aBIaSARhHgOeaE-bCKxKcIlhpYD__iuukReZP8"
refresh_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTI3NTQ0ODMsImV4cCI6MTY1Mjg0MDg4Mywic3ViIjoiWWd5Rzk5Q0h5ZTdDTzhMSDRWOVZ4VmIyVERLOG5pS1FZZHBhQ3J2cWRwRSJ9.-FnopdSsIJSfccT4-fXjGRl-9CHZ1zztjz2nVGBry0U"

curl http://localhost:3001/api/auth/token \
  -X POST \
  -d "grant_type=refresh_token&access_token=$access_token&refresh_token=$refresh_token"

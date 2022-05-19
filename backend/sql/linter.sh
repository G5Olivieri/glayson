#!/usr/bin/env bash

set -eou pipefail

docker run --rm -v $PWD:/app -w /app sqlfluff lint *.sql --dialect postgres

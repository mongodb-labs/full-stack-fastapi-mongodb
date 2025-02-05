#! /usr/bin/env bash
set -e

hatch run python /app/app/tests_pre_start.py

bash ./scripts/test.sh "$@"

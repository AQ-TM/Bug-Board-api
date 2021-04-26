#!/bin/sh

API="http://localhost:4741"
URL_PATH="/projects"

curl "${API}${URL_PATH}/${ID}/issues/${ID2}" \
  --include \
  --request GET

echo

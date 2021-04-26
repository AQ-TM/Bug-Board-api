#!/bin/bash

API="http://localhost:4741"
URL_PATH="/cases"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
  "cases": {
    "summary": "'"${SUM}"'",
    "identifiedDate": "'"${IDD}"'",
    "targetResolutionDate": "'"${TRD}"'",
    "resolutionSummary": "'"${RS}"'",
    "status": "'"${STAT}"'"
  }
}'

echo

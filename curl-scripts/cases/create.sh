#!/bin/bash

curl "http://localhost:4741/cases" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "case": {
      "summary": "'"${SUM}"'",
      "identifiedDate": "'"${IDD}"'",
      "targetResolutionDate": "'"${TRD}"'",
      "resolutionSummary": "'"${RS}"'",
      "status": "'"${STAT}"'"
    }
  }'

echo

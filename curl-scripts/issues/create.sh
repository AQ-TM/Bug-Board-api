#!/bin/bash

curl "http://localhost:4741/projects/${ID}/issues" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "issue": {
      "summary": "'"${SUM}"'",
      "identifiedDate": "'"${IDD}"'",
      "targetResolutionDate": "'"${TRD}"'",
      "resolutionSummary": "'"${RS}"'",
      "status": "'"${STAT}"'"
    }
  }'

echo

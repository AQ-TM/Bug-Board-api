API="http://localhost:4741"
URL_PATH="/projects"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
  "project": {
    "name": "'"${N}"'",
    "targetStartDate": "'"${TSD}"'",
    "targetEndDate": "'"${TED}"'"
    }
  }'

echo

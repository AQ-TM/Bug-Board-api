#!/bin/bash

API="http://localhost:4741"
URL_PATH="/sign-up"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "'"${EMAIL}"'",
      "username": "'"${UN}"'",
      "password": "'"${PW}"'",
      "password_confirmation": "'"${PW}"'"
    }
  }'

echo

#!/bin/bash

curl -H "Accept: application/json" -H "Content-Type: application/json" https://YOURNIGHTSCOUTHERE.herokuapp.com/api/v1/entries/sgv/ | jq '.' > sgv.json;

curl -H "Accept: application/json" -H "Content-Type: application/json" https://YOURNIGHTSCOUTHERE.herokuapp.com/api/v1/treatments/ | jq '.' > entries.json;

node fetch-basal-compute-iob.js;

node fetch-basalA-compute-iob.js;

node fetch-mealtime-compute-iob.js;


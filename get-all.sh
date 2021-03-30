#!/bin/bash

curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl1.herokuapp.com/api/v1/entries/sgv/ | jq '.' > sgv.json;

curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl1.herokuapp.com/api/v1/treatments/ | jq '.' > entries.json;

curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl1.herokuapp.com/api/v1/profile/ | jq '.' > profile.json;

node computeBolusIOB.js;
node computeBasalIOB.js;
node basal-det.js;
node basal-gla.js;
node detemir.js;
node glargine.js;
node all_insulin.js;
node carbs.js;
node arrows.js;


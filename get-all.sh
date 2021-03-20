#!/bin/bash

curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl-freeaps.herokuapp.com/api/v1/entries/sgv/ | jq '.' > sgv.json;

curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl-freeaps.herokuapp.com/api/v1/treatments/ | jq '.' > entries.json;

node computeBolusIOB.js;
node computeBasalIOB.js;
node basal-det.js;
node basal-gla.js;
node detemir.js;
node glargine.js;
node all_insulin.js;


: '
node carbs.js;
node addition.js;
'


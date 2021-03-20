#!/bin/bash
curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl1.herokuapp.com/api/v1/entries/sgv/ | jq '.' > sgv1.json;
node sgv_start.js
curl -H "Content-Type: application/json" -H "api-secret:72ed4e79dec288f4b3e85466f1f92330771154ac" -XPOST 'https://dmpkl1.herokuapp.com/api/v1/entries/' -d @cgmsim-sgv.json

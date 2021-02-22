#!/bin/bash
curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl-freeaps.herokuapp.com/api/v1/treatments/ -o treatments.json

curl -H -s "Accept: application/json" -H "Content-Type: application/json" https://dmpkl-freeaps.herokuapp.com/api/v1/treatments/ | jq '.'

wget 'https://dmpkl-freeaps.herokuapp.com/api/v1/treatments/' -O food.json;

wget 'https://pplantnightscout.herokuapp.com/api/v1/treatments/' -O treatmentspaul.json;

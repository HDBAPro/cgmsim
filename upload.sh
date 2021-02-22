#!/bin/bash
node times.js;
node bolusiob.js
# curl -H "Content-Type: application/json" -H "api-secret:72ed4e79dec288f4b3e85466f1f92330771154ac" -XPOST 'https://dmpkl-freeaps.herokuapp.com/api/v1/entries/' -d @test-sgv.json
curl -H "Content-Type: application/json" -H "api-secret:72ed4e79dec288f4b3e85466f1f92330771154ac" -XPOST 'https://dmpkl-freeaps.herokuapp.com/api/v1/entries/' -d @iobcalc-sgv.json
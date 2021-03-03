#!/bin/bash
node times.js;
node bolusiob.js
# curl -H "Content-Type: application/json" -H "api-secret:72ed4e79d_YOUR_HASHED SECRET_f92330771154ac" -XPOST 'https://YOURNIGHTSCOUTHERE.herokuapp.com/api/v1/entries/' -d @test-sgv.json
curl -H "Content-Type: application/json" -H "api-secret:72ed4e79d_YOUR_HASHED SECRET_f92330771154ac" -XPOST 'https://YOURNIGHTSCOUTHERE.herokuapp.com/api/v1/entries/' -d @iobcalc-sgv.json

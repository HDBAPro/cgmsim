curl -H "Accept: application/json" -H "Content-Type: application/json" https://munhaima.herokuapp.com/api/v1/treatments/ | jq '.' > jenni_treatments.json;
curl -H "Accept: application/json" -H "Content-Type: application/json" https://munhaima.herokuapp.com/api/v1/profile.json | jq '.' > jenni_profile.json;
node jenni.js;



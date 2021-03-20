
const sgvs = require('./sgv1.json');
var jsonsgvs = JSON.stringify(sgvs);
var sgvValues = JSON.parse(jsonsgvs);
console.log(sgvValues);

const ISF = 1.5;  //mmol/l/U

var NR = require('./last_mealtime.json');
var jsonNR = JSON.stringify(NR);
var NRAct = JSON.parse(jsonNR);

var GLA = require('./last_glargine_aggrACT.json');
var jsonGLA = JSON.stringify(GLA);
var glaAct = JSON.parse(jsonGLA);

var DET = require('./last_detemir_aggrACT.json');
var jsonDET = JSON.stringify(DET);
var detAct = JSON.parse(jsonDET);


let globalBasalAct = glaAct + detAct;
let globalMealtimeAct = NRAct[0];

let globlalInsulinAct = globalBasalAct + globalMealtimeAct;

let BGI_ins = globlalInsulinAct *ISF * -90;

console.log('-------------------------------------------');
console.log('glaAct:',glaAct,'detAct:',detAct,'total basal act:', globalBasalAct);
console.log('-------------------------------------------');
console.log('total mealtime insulin activity:',globalMealtimeAct);
console.log('-------------------------------------------');
console.log('total insulin activity:',globlalInsulinAct);

console.log('-------------------------------------------');
console.log('total BG impact of insulin for 5 minutes:',BGI_ins);

// here is the liver BG impact
// 1 mmol/l/h is 0.083333 mmol/l/5 min
var liver_bgi = 0.0833;



// create JSON
var dict = {"sgv" : sgvValues[0].sgv + BGI_ins + (liver_bgi * 18), "type" : "sgv", "direction": "Flat", "date" : Date.now(), 
     };

var dictstring = JSON.stringify(dict);

var fs = require('fs');
fs.writeFile("cgmsim-sgv.json", dictstring, function(err, result) {
    if(err) console.log('error', err);
});




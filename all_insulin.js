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

let BGI_ins = globlalInsulinAct *ISF * -5;

console.log('-------------------------------------------');
console.log('glaAct:',glaAct,'detAct:',detAct,'total basal act:', globalBasalAct);
console.log('-------------------------------------------');
console.log('total mealtime insulin activity:',globalMealtimeAct);
console.log('-------------------------------------------');
console.log('total insulin activity:',globlalInsulinAct);

console.log('-------------------------------------------');
console.log('total BG impact of insulin for 5 minutes:',BGI_ins);




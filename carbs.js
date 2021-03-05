//from file (string) to object or json array
const entries = require('./entries.json');
const carbs = entries.filter(e => e.carbs).map(e => ({ time: e.created_at, carbs: e.carbs , enteredBy: e.enteredBy}));
const datacarbs = JSON.stringify(carbs, null, 4);
const carbAbsTime = 180; // meal absoption time in min
const ISF = 2; // insulin sensitivity factor in mmol/l/U
const CR = 10; // carb ration in g/U
const CSF = ISF/CR; // carb effect on BG concentration in mmol/L/g
const fs = require('fs');
const { timeStamp } = require('console');
fs.writeFile('carbs.json', datacarbs, (err) => {
    if (err) {
        throw err;
    }
    //console.log("JSON carbs data is saved.");
});

//get the newest or first entry in the object (array?) named "carbs" 
var latesttime = carbs [0];
// define the time of the latest carbs
var latestcarbs = latesttime.time;
// define the amount of last carbs
var latestcarbs_g = latesttime.carbs;
console.log('time of last carbs:', latestcarbs,', amount of last carbs:',latestcarbs_g);
console.log(carbs[0]);


//use moment.js to convert a date format from ISO 8601 to UNIX timestamp
var moment = require('moment'); // require
var x = moment(latestcarbs).format("x");
console.log('time of last carbs in timestamp format: ',x);
console.log('time right now: ', Date.now());

var timeSinceLastCarbs = Date.now() - x;
console.log('time since last carbs in mills: ',timeSinceLastCarbs);
var timeSinceLastCarbs_min = timeSinceLastCarbs/(1000*60);
console.log('time since last carbs in minutes: ',timeSinceLastCarbs_min);

if ((timeSinceLastCarbs_min) < (carbAbsTime/2)) {
    var AT2 = Math.pow(carbAbsTime,2);
    var carbrate = (latestcarbs_g * 4 * timeSinceLastCarbs_min)/AT2;
    var COB = (latestcarbs_g*2*Math.pow(timeSinceLastCarbs_min,2))/AT2;
    } else if ((timeSinceLastCarbs_min) >= (carbAbsTime/2)){
    var carbrate = (latestcarbs_g * 4 / carbAbsTime)*(1 -(timeSinceLastCarbs_min/carbAbsTime));
    var AAA = (4*latestcarbs_g/carbAbsTime);
    var BBB = Math.pow(timeSinceLastCarbs_min,2)/(2*carbAbsTime);
    var COB = (AAA * (timeSinceLastCarbs_min-BBB)) - latestcarbs_g;
    } else if ((timeSinceLastCarbs_min) > (carbAbsTime)){
    var carbrate = 0;
    var COB = 0;
    console.log('carb absorption rate:', carbrate);
    }
var BGC = COB * ISF / CR; // change in blood glucos from carbs mmol/l
console.log(timeSinceLastCarbs_min, latestcarbs_g);
console.log('carb absorption rate:', carbrate,'g/min, and since 1 g/min * ISF/CR (2/10), this means 0.2mmol/l/min');
console.log('the change in BG in 5 minutes is:', 5*carbrate*ISF/CR,'mmol/l');
console.log('COB:', COB,'grams');
console.log('Total change in blood glucose from carbs:',BGC,'(is COB * ISF/CR)');

let COBString = JSON.stringify(COB);
let carbrateString = JSON.stringify(carbrate.toFixed(2));

fs.writeFile("latest_carbs.json", COBString, function(err, result) {
if(err) console.log('error', err);
});
fs.appendFile("latest_carbs.json", carbrateString, function(err, result) {
    if(err) console.log('error', err);
});
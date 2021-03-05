//from file (string) to object or json array
const entries = require('./entries.json');
const notes = entries.filter(e => e.notes).map(e => ({ notes: e.notes, time: e.created_at, enteredBy: e.enteredBy}));
const datanotes = JSON.stringify(notes, null, 4);
const fs = require('fs');
const { timeStamp } = require('console');
fs.writeFile('notes.json', datanotes, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON notes data is saved.");
});

//get the newest or first entry in the object (array?) named "notes" 
var latesttimeofnoteb = notes[2];
console.log('this is latesttimeofnote b: ', latesttimeofnoteb);

// define the time of the latest note
var latestnoteb = latesttimeofnoteb.time;
console.log('this is latestnote b:',latestnoteb);

// define the amount written in the note
var latestBasalb = latesttimeofnoteb.notes;
console.log('this is latestbasal b:',latestBasalb);

console.log('time of last basal b:', latestnoteb,', amount of last basal b:',latestBasalb);
console.log(notes[2]);

console.log('----------------');

//use moment.js to convert a date format from ISO 8601 to UNIX timestamp
// y will be the time of last basal in UNIX format
var moment = require('moment'); // require
let yb = moment(latestnoteb).format("x");
console.log('time of last basal b in ISO format: ',latestnoteb);
console.log('time of last basal b in timestamp format: ',yb);
console.log('time right now: ', Date.now());

var timeSinceLastBasalb = (Date.now() - yb);
console.log('time since last basal b in mills: ',timeSinceLastBasalb);
var timeSinceLastBasal_minb = timeSinceLastBasalb/(1000*60*60);
console.log('time since last basal b in hours: ',timeSinceLastBasal_minb);

var basalDoseb = parseInt(latestBasalb.slice(8), 10);
var basalTypeb = latestBasalb.slice(0,3);
console.log('basal b dose as number:',basalDoseb);
console.log('basal b type:',basalTypeb);





// now compute iob of basal insulin detemir

if (basalTypeb.includes('det'))

    {

const { pi } = require("mathjs");
const weight = 70;
// let the duration be a linear function of dose/weight;
const duration = (16 + (20*basalDoseb/weight))*60;
console.log('dose/kg is :', (basalDoseb/weight).toFixed(2),'U/kg');
const ISF = 1.5; //(mmol/l/U)
let time0 = yb;
const { number } = require("mathjs");

    if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
    }

{
//var x = (Date.now() - timeSinceLastBasal)/(60*60*1000);
var basalActivityb = basalDoseb*(Math.PI/(duration*2))*(Math.sin(timeSinceLastBasal_minb*60*Math.PI/duration));
}
console.log('dose b: ',basalDoseb, 'duration: ', duration, 'time since injection b: ',timeSinceLastBasalb, 'time since injection b in hours:', timeSinceLastBasal_minb, 'basal detemir b activity: ',basalActivityb);
}  

    else

{

    // compute the insulin activity of glargine after a single injection;

const { pi } = require("mathjs");
const dose = basalDoseb; 
const duration = 27;  // let's assume an action of 27 hours
const ISF = 1.5; //(mmol/l/U)
let time0 = yb;
// the area of an ellipse is pi * a * b;
// the AUC of the dose of insulin is half the area of the ellipse
// so for 24 units, 12 = pi * (duration/2) * b
// calculating b is (2*dose)/(pi*duration)
let b = (2*basalDoseb)/(Math.PI*duration);

const { number } = require("mathjs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//timestamp in milliseconds;
//console.log (Date.now())
// x will be the time since injection in hours
let xb = (Date.now() - time0)/(60*60*1000);
let g = xb-(duration/2);
let gg = Math.pow(g,2);
let h = duration/2;
let hh= Math.pow(h,2);
let z = (x-gg)/hh;
let bb = Math.pow(b,2);

// compute activity only for the duration time, so it wont' get negative

if (timeSinceLastBasalb < duration) {
// the insulin activity is glargine 100 is:
var basalActivityb = 2*Math.sqrt(bb*(1+z));

results = {
    time0: yb,
    basalActivityb: basalActivityb,
}

console.log('time now is:', Date.now(), ', time at injection b was:', yb, 'b is:',b, ', x (elapsed time) is:', xb,'hours, and z is: ',z, ', the activity of basal glargine now is:', basalActivityb); 
    };
};


if (basalActivityb > 0) {
    var basalActivityb = basalActivityb;
} else {basalActivityb = 0};
var basalActivitybString = JSON.stringify(basalActivityb);
console.log('one last time after the negative value is reduced to 0: the basal activity of dose b is:',basalActivityb)
fs.writeFile("latest_basalb.json", basalActivitybString, function(err, result) {
if(err) console.log('error', err);
});



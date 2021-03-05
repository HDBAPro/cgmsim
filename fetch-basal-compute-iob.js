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
var latesttimeofnote = notes[0];
console.log('this is latesttimeofnote: ', latesttimeofnote);

// define the time of the latest note
var latestnote = latesttimeofnote.time;
console.log('this is latestnote:',latestnote);

// define the amount written in the note
var latestBasal = latesttimeofnote.notes;
console.log('this is latestbasal:',latestBasal);

console.log('time of last basal:', latestnote,', amount of last basal:',latestBasal);
console.log(notes[0]);

console.log('----------------');

//use moment.js to convert a date format from ISO 8601 to UNIX timestamp
// y will be the time of last basal in UNIX format
var moment = require('moment'); // require
let y = moment(latestnote).format("x");
console.log('time of last basal in ISO format: ',latestnote);
console.log('time of last basal in timestamp format: ',y);
console.log('time right now: ', Date.now());

var timeSinceLastBasal = (Date.now() - y);
console.log('time since last basal in mills: ',timeSinceLastBasal);
var timeSinceLastBasal_min = timeSinceLastBasal/(1000*60*60);
console.log('time since last basal in hours: ',timeSinceLastBasal_min);

var basalDose = parseInt(latestBasal.slice(8), 10);
var basalType = latestBasal.slice(0,3);
console.log('basal dose as number:',basalDose);
console.log('basal type:',basalType);





// now compute iob of basal insulin detemir

if (basalType.includes('det'))

    {

const { pi } = require("mathjs");
const weight = 70;
// let the duration be a linear function of dose/weight;
const duration = (16 + (20*basalDose/weight))*60;
console.log('dose/kg is :', (basalDose/weight).toFixed(2),'U/kg');
const ISF = 1.5; //(mmol/l/U)
let time0 = y;
const { number } = require("mathjs");

    if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
    }

{
//var x = (Date.now() - timeSinceLastBasal)/(60*60*1000);
var basalActivity = basalDose*(Math.PI/(duration*2))*(Math.sin(timeSinceLastBasal_min*60*Math.PI/duration));

}
console.log('dose:',basalDose, 'duration in min:', duration, 'duration in h:',(duration/60), 'since injection:',timeSinceLastBasal, 'time since injection in hours:', timeSinceLastBasal_min, 'basal detemir activity:',basalActivity);

}

    
    else

{

    // compute the insulin activity of glargine after a single injection;

const { pi } = require("mathjs");
const dose = basalDose; 
const duration = 27;  // let's assume an action of 27 hours
const ISF = 1.5; //(mmol/l/U)
let time0 = y;
// the area of an ellipse is pi * a * b;
// the AUC of the dose of insulin is half the area of the ellipse
// so for 24 units, 12 = pi * (duration/2) * b
// calculating b is (2*dose)/(pi*duration)
let b = (2*basalDose)/(Math.PI*duration);

const { number } = require("mathjs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//timestamp in milliseconds;
//console.log (Date.now())
// x will be the time since injection in hours
let x = (Date.now() - time0)/(60*60*1000);
let g = x-(duration/2);
let gg = Math.pow(g,2);
let h = duration/2;
let hh= Math.pow(h,2);
let z = (x-gg)/hh;
let bb = Math.pow(b,2);

// compute activity only for the duration time, so it wont' get negative

if (timeSinceLastBasal < duration) {
// the insulin activity is glargine 100 is:
var basalActivity = 2*Math.sqrt(bb*(1+z));

results = {
    time0: y,
    basalActivity: basalActivity,
}

console.log('time now is:', Date.now(), ', time at injection was:', y, 'b is:',b, ', x (elapsed time) is:', x,'hours, and z is: ',z, ', the activity of basal glargine now is:', basalActivity, ' and BG impact og gbasal glargine:',basalImpact,'mmol/l/h'); 
    };
};



if (basalActivity > 0) {
    var basalActivity = basalActivity;
} else {basalActivity = 0};
var basalActivityString = JSON.stringify(basalActivity);
console.log('one last time after the negative value is reduced to 0: the basal activity of dose a is:',basalActivity)
fs.writeFile("latest_basal.json", basalActivityString, function(err, result) {
if(err) console.log('error', err);
});




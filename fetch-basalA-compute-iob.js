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
var latesttimeofnotea = notes[1];
console.log('this is latesttimeofnote a: ', latesttimeofnotea);

// define the time of the latest note
var latestnotea = latesttimeofnotea.time;
console.log('this is latestnote a:',latestnotea);

// define the amount written in the note
var latestBasala = latesttimeofnotea.notes;
console.log('this is latestbasal a:',latestBasala);

console.log('time of last basal a:', latestnotea,', amount of last basal a:',latestBasala);
console.log(notes[1]);

console.log('----------------');

//use moment.js to convert a date format from ISO 8601 to UNIX timestamp
// y will be the time of last basal in UNIX format
var moment = require('moment'); // require
var ya = moment(latestnotea).format("x");
console.log('time of last basal a in ISO format: ',latestnotea);
console.log('time of last basal a in timestamp format: ',ya);
console.log('time right now: ', Date.now());

var timeSinceLastBasala = Date.now() - ya;
console.log('time since last basal a in mills: ',timeSinceLastBasala);
var timeSinceLastBasal_mina = timeSinceLastBasala/(1000*60*60);
console.log('time since last basal a in hours: ',timeSinceLastBasal_mina);

var basalDosea = parseInt(latestBasala.slice(8), 10);
var basalTypea = latestBasala.slice(0,3);
console.log('basal dose a as number:',basalDosea);
console.log('basal type a:',basalTypea);





// now compute iob of basal insulin detemir

if (basalTypea.includes('det'))

    {

const { pi } = require("mathjs");
const weight = 70;
// let the duration be a linear function of dose/weight;
const duration = 16 + (20*basalDosea/weight);
console.log('dose/kg is :', (basalDosea/weight).toFixed(2),'U/kg');
const ISF = 1.5; //(mmol/l/U)
let time0a = ya;
const { number } = require("mathjs");

    if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
    }
    
//timestamp in milliseconds;
console.log (Date.now())
// x will be the time since injection in hours

// compute activity only for the duration time, so it wont' get negative !!

if (timeSinceLastBasala < duration) {
let xa = (Date.now() - ya)/(60*60*1000);
// idet is the impact of detemir, or activity of detemir;
var basalActivitya = 0;
var basalImpacta = 0;
var basalActivitya = basalDosea*(Math.PI/(duration*2))*(Math.sin(xa*Math.PI/duration));
var basalImpacta = -basalActivitya*ISF;
console.log('dose: ',basalDosea, 'duration: ', duration, 'time since injection: ',xa, 'basal detemir activity: ',basalActivitya,'BG impact of basal detemir: ',basalImpacta);
}}  

    else

{

    // compute the insulin activity of glargine after a single injection;

const { pi } = require("mathjs");
const dose = basalDosea; 
const duration = 27;  // let's assume an action of 27 hours
const ISF = 1.5; //(mmol/l/U)
let time0a = ya;
// the area of an ellipse is pi * a * b;
// the AUC of the dose of insulin is half the area of the ellipse
// so for 24 units, 12 = pi * (duration/2) * b
// calculating b is (2*dose)/(pi*duration)
let b = (2*basalDosea)/(Math.PI*duration);

const { number } = require("mathjs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//timestamp in milliseconds;
//console.log (Date.now())
// x will be the time since injection in hours
let xa = (Date.now() - time0a)/(60*60*1000);
let g = xa-(duration/2);
let gg = Math.pow(g,2);
let h = duration/2;
let hh= Math.pow(h,2);
let z = (xa-gg)/hh;
let bb = Math.pow(b,2);

// compute activity only for the duration time, so it wont' get negative

if (timeSinceLastBasala < duration) {
// the insulin activity is glargine 100 is:
let basalActivitya = 2*Math.sqrt(bb*(1+z));
// the BG impact of glargine is:
let basalImpacta = -basalActivitya * ISF;

results = {
    time0a: ya,
    igla100a: basalActivitya,
}};
console.log('time now is:', Date.now(), ', time at injection of bolus a was:', ya, 'b is:',b, ', x (elapsed time) is:', xa,'hours, and z is: ',z, ', the activity of basal glargine now is:', basalActivitya, ' and BG impact of basal glargine:',basalImpacta,'mmol/l/h'); 
    }
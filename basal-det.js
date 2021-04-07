const patient = require('./patient.json');
const ISF = patient[0].ISF;  //mmol/l/U
const weight = patient[0].weight; //kg 

console.log('your patient´s ISF is:', patient[0].ISF,'mmol/l/U');
console.log('your patient´s weight is', patient[0].weight,'kg');


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
const { duration } = require('moment');
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
    //const weight = 70;
    // let the duration be a linear function of dose/weight;
    const duration = 16 + (20*basalDose/weight);
    console.log('dose/kg is :', (basalDose/weight).toFixed(2),'U/kg');
    //const ISF = 1.5; //(mmol/l/U)
    let time0 = y;
    const { number } = require("mathjs");

    if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
    }

{
//var x = (Date.now() - timeSinceLastBasal)/(60*60*1000);
var basalActivity = basalDose*(Math.PI/(duration*2))*(Math.sin(timeSinceLastBasal_min*Math.PI/duration));

}
console.log('dose: ',basalDose, 'duration: ', duration, 'time since injection: ',timeSinceLastBasal, 'time since injection in hours:', timeSinceLastBasal_min, 'basal detemir activity: ',basalActivity);
}
var basalActivityString = JSON.stringify(basalActivity);

fs.writeFile("latest_basal.json", basalActivityString, function(err, result) {
if(err) console.log('error', err);
});
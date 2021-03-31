// this computes a sinusoidal curve from midnight to midnight, oscillating between 5 and 6 mmol/l

const { number } = require("mathjs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//timestamp in milliseconds;
console.log ('timestamp in milliseconds',Date.now())

// timestamp in days;
console.log ('timestamp in days',Date.now() / 86400000)

// timestamp in days rounded;
console.log ('timestamp in days rounded',Math.floor(Date.now() / 86400000))

//timestamp in fraction of a day;
console.log ('timestamp in fraction of a day',(Date.now()/86400000) - (Math.floor(Date.now() / 86400000)))

//fraction of a day in hours;
console.log ('fraction of a day in hours',((Date.now()/86400000) - (Math.floor(Date.now() / 86400000))) * 24)

//fraction of a day in hours adding 2 for UTC+2;
console.log ('fraction of a day in hours adding 2 for UTC+2',(((Date.now()/86400000) - (Math.floor(Date.now() / 86400000))) * 24) + 2)

// time of the day in hours - decimals, not minutes
var hours = ((((Date.now()/86400000) - (Math.floor(Date.now() / 86400000))) * 24) + 2);
console.log ('time of the day in hours - decimals, not minutes',hours.toFixed(2));

// express minutes also;
var hoursabs = Math.floor(hours);
var minutes = (hours - hoursabs) * 60;
console.log ('express minutes also', minutes.toFixed());

// time of the day in 2 pi cycle;
var daycycle = ((hours * Math.PI) / 12);
console.log ('time of the day in 2 pi cycle',daycycle.toFixed(2));

// time of the day in 360 deg cycle;
var daycycledeg = ((hours * 360) / 24);
console.log ('time of the day in 360 deg cycle', daycycledeg.toFixed(2));

// value of the sin function according to hours;
var CGM = Math.sin(daycycledeg * Math.PI / 180); 
console.log ('value of the sin function according to hours',CGM.toFixed(2));



// ADD FUNCTION PERLIN NOISE HERE

const perls = require('./perlin.json');
var jsonperls = JSON.stringify(perls);
var perlValues = JSON.parse(jsonperls);
var moment = require('moment'); 
var timeSincePerlin = perlValues.map(entry => ({ ...entry, time: (Date.now() - moment(entry.time).valueOf())/(1000*60)}));
//console.log(perlValues);
//console.log(timeSincePerlin);

let lastPerls = timeSincePerlin.filter(function (e) {
    return e.time >=0 && e.time <= 5; // keep only the latest noise value
});
console.log('this is the last perlin noise value:', lastPerls);
console.log('this is the last perlin noise value:', lastPerls[0].noise);

// END OF PERLIN NOISE SECTION




// value of the sin function according to hours;
var CGMmayhem = Math.sin(daycycledeg * Math.PI / 18); 
console.log ('value of the sin function according to hours',CGM.toFixed(2));

// value of the sin function oscillating between 0 and 2;
var CGMinterm = (Math.sin(daycycledeg * Math.PI / 180) + 1); 
console.log (CGMinterm.toFixed(2));

// value of the sin function oscillating between 0 and 1, starting from 0.5 and ending in 0.5
var CGMcorr = ((Math.sin(daycycledeg * Math.PI / 180) + 1) / 2); 
console.log (CGMcorr.toFixed(2));

// value of the sin function oscillating between 0 and 1, starting from 5.5 and ending in 5.5
var CGMcorr5 = (CGMcorr + 5); 
console.log (CGMcorr5.toFixed(2));

// value of the sin function oscillating between 0 and 1, starting from 99 and ending in 99
var sgv = ((CGMcorr + 5) * 18) + (lastPerls[0].noise * 18 * 2); 
console.log (sgv.toFixed());

console.log ("When the time of day is " + hours.toFixed() + " hours and " + minutes.toFixed() + " minutes, the sinusoidal value of CGM is " + CGMcorr5.toFixed(1) +" mmol/l."); 
console.log ("When the time of day is " + hours.toFixed() + " hours and " + minutes.toFixed() + " minutes, the sinusoidal value of CGM is " + sgv.toFixed() +" mg/dl."); 


// create JSON
var dict = {"sgv" : sgv, "type" : "sgv", "direction": "Flat", "date" : Date.now(), 
     };

var dictstring = JSON.stringify(dict);

var fs = require('fs');
fs.writeFile("test-sgv.json", dictstring, function(err, result) {
    if(err) console.log('error', err);
});

const { number } = require("mathjs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//timestamp in milliseconds;
console.log (Date.now())

// timestamp in days;
console.log (Date.now() / 86400000)

// timestamp in days rounded;
console.log (Math.floor(Date.now() / 86400000))

//timestamp in fraction of a day;
console.log ((Date.now()/86400000) - (Math.floor(Date.now() / 86400000)))

//fraction of a day in hours;
console.log (((Date.now()/86400000) - (Math.floor(Date.now() / 86400000))) * 24)

//fraction of a day in hours adding 2 for UTC+2;
console.log ((((Date.now()/86400000) - (Math.floor(Date.now() / 86400000))) * 24) + 2)

// time of the day in hours (decimals, not minutes!)
var hours = ((((Date.now()/86400000) - (Math.floor(Date.now() / 86400000))) * 24) + 2);
console.log (hours.toFixed(2));

// express minutes also;
var hoursabs = Math.floor(hours);
var minutes = (hours - hoursabs) * 60;
console.log (minutes.toFixed());

// time of the day in 2 pi cycle;
var daycycle = ((hours * Math.PI) / 12);
console.log (daycycle.toFixed(2));

// time of the day in 360 deg cycle;
var daycycledeg = ((hours * 360) / 24);
console.log (daycycledeg.toFixed(2));

// value of the sin function according to hours;
var CGM = Math.sin(daycycledeg * Math.PI / 180); 
console.log (CGM.toFixed(2));

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
var sgv = ((CGMcorr + 5) * 18); 
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

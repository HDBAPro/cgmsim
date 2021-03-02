//from file (string) to object or json array
const entries = require('./entries.json');
const insulin = entries.filter(e => e.insulin).map(e => ({ time: e.created_at, insulin: e.insulin , enteredBy: e.enteredBy}));
console.log(insulin);

var fs = require('fs');
const datainsulin = JSON.stringify(insulin, null, 4);

fs.writeFile('insulin.json', datainsulin, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON insulin data is saved.");
});



//get the newest or first entry in the object (array?) named "insulin" 
var latesttimeofinsulin = insulin[0];
console.log('this is latesttimeofinsulin: ', latesttimeofinsulin);

// define the time of the latest note
var latestinsulin = latesttimeofinsulin.time;
console.log('this is latestinsulin:',latestinsulin);
console.log('----------------');

//use moment.js to convert a date format from ISO 8601 to UNIX timestamp
// y will be the time of last basal in UNIX format
var moment = require('moment'); // require
var r = moment(latestinsulin).format("x");
console.log('time of last bolus in ISO format: ',latestinsulin);
console.log('time of last bolus in timestamp format: ',r);
console.log('time right now: ', Date.now());

var timeSinceLastBolus = Date.now() - r;
console.log('time since last bolus in mills: ',timeSinceLastBolus);
var timeSinceLastBolus_min = timeSinceLastBolus/(1000*60*60);
console.log('time since last bolus in hours: ',timeSinceLastBolus_min);


let bolustime = r;
//var time = new Date();
// for mealtime insulin, let's choose a 75 min peak time and 300 min DIA;
var time = Date.now();
var dia = 5;
var td = dia * 60;
var tp = 75;

// bolustime here is just an example, and time is expressed in min, not hours
var bolusTime = r;
    var t = Math.round((time - bolusTime) / 1000 / 60);

    var activityContrib = 0;
    var iobContrib = 0;
    var biobContrib = 0;

    // force the IOB to 0 if over 5 hours have passed
    if (t < td) {

        var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
        var a = 2 * tau / td;
        var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));
       
        // original line is : activityContrib = treatment.insulin * (S / Math.pow(tau, 2) etc etc...
        activityContrib = 10 * (S / Math.pow(tau, 2)) * t * (1 - t / td) * Math.exp(-t / tau);
        iobContrib = 10 * (1 - S * (1 - a) * ((Math.pow(t, 2) / (tau * td * (1 - a)) - t / tau - 1) * Math.exp(-t / tau) + 1));
    }

    results = {
        iobContrib: iobContrib,
        activityContrib: activityContrib,
        bolusTime: bolusTime,
        time: r,
        t: t,
        //biobContrib: biobContrib
    };

    var iobcalc = {"sgv" : iobContrib, "type" : "sgv", "direction": "Flat", "date" : Date.now(), 
     };
     var iobcalcstring = JSON.stringify(iobcalc);

     var fs = require('fs');
    fs.writeFile("iobcalc-sgv.json", iobcalcstring, function(err, result) {
    if(err) console.log('error', err);
let bolusActivity = activityContrib; 
console.log(results, 'a' , a, 'tau' ,tau, 'S' ,S,'bolusActivity:',bolusActivity);
    return results;

});


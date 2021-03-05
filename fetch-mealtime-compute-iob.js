//from file (string) to object or json array
const entries = require('./entries.json');
const insulin = entries.filter(e => e.insulin).map(e => ({ time: e.created_at, insulin: e.insulin , enteredBy: e.enteredBy}));
//console.log(insulin);

var fs = require('fs');
const datainsulin = JSON.stringify(insulin, null, 4);

fs.writeFile('insulin.json', datainsulin, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON insulin data is saved.");
});

//get the newest or first entry in the object (array?) named "insulin",
// and then get the previous 4 boluses
var latesttimeofinsulin = insulin[0];
var latesttimeofinsulina = insulin[1];
var latesttimeofinsulinb = insulin[2];
var latesttimeofinsulinc = insulin[3];
var latesttimeofinsulind = insulin[4];

console.log('this is latesttimeofinsulin: ', latesttimeofinsulin);
console.log('and this is the time of bolus a:',latesttimeofinsulina);
console.log('and this is the time of bolus b:',latesttimeofinsulinb);
console.log('and this is the time of bolus c:',latesttimeofinsulinc);
console.log('and this is the time of bolus d:',latesttimeofinsulind);

// define the time of the latest boluses
var latestinsulin = latesttimeofinsulin.time;
var latestinsulina = latesttimeofinsulina.time;
var latestinsulinb = latesttimeofinsulinb.time;
var latestinsulinc = latesttimeofinsulinc.time;
var latestinsulind = latesttimeofinsulind.time;
console.log('this is latestinsulin:',latestinsulin);
console.log('----------------');

// define the dose of the latest boluses
var latestinsulindose = latesttimeofinsulin.insulin;
var latestinsulindosea = latesttimeofinsulina.insulin;
var latestinsulindoseb = latesttimeofinsulinb.insulin;
var latestinsulindosec = latesttimeofinsulinc.insulin;
var latestinsulindosed = latesttimeofinsulind.insulin;
console.log('this is latestinsulin dose:',latestinsulindose);
console.log('this is bolus a dose:',latestinsulindosea);
console.log('this is bolus b dose:',latestinsulindoseb);
console.log('this is bolus c dose:',latestinsulindosec);
console.log('this is bolus d dose:',latestinsulindosed);
console.log('----------------');

//use moment.js to convert a date format from ISO 8601 to UNIX timestamp
// y will be the time of last basal in UNIX format
var moment = require('moment'); // require
var r = moment(latestinsulin).format("x");
var ga = moment(latestinsulina).format("x");
var gb = moment(latestinsulinb).format("x");
var gc = moment(latestinsulinc).format("x");
var gd = moment(latestinsulind).format("x");

console.log('time of last bolus in ISO format: ',latestinsulin);
console.log('time of last bolus in timestamp format: ',r);
console.log('time of bolus a in timestamp format: ',ga);
console.log('time of bolus b in timestamp format: ',gb);
console.log('time of bolus c in timestamp format: ',gc);
console.log('time of bolus d in timestamp format: ',gd);
//
console.log('time right now: ', Date.now());
//
var timeSinceLastBolus = Date.now() - r;
console.log('time since last bolus in mills: ',timeSinceLastBolus);
var timeSinceLastBolus_min = timeSinceLastBolus/(1000*60*60);
console.log('time since last bolus in hours: ',timeSinceLastBolus_min);
//
var timeSinceLastBolusa = Date.now() - ga;
console.log('time since bolus a in mills: ',timeSinceLastBolusa);
var timeSinceLastBolus_mina = timeSinceLastBolusa/(1000*60*60);
console.log('time since bolus a in hours: ',timeSinceLastBolus_mina);
//
var timeSinceLastBolusb = Date.now() - gb;
console.log('time since bolus b in mills: ',timeSinceLastBolusb);
var timeSinceLastBolus_minb = timeSinceLastBolusb/(1000*60*60);
console.log('time since bolus b in hours: ',timeSinceLastBolus_minb);
//
var timeSinceLastBolusc= Date.now() - gc;
console.log('time since bolus c in mills: ',timeSinceLastBolusc);
var timeSinceLastBolus_minc = timeSinceLastBolusc/(1000*60*60);
console.log('time since bolus c in hours: ',timeSinceLastBolus_minc);
//
var timeSinceLastBolusd = Date.now() - gd;
console.log('time since bolus d in mills: ',timeSinceLastBolusd);
var timeSinceLastBolus_mind = timeSinceLastBolusd/(1000*60*60);
console.log('time since bolus d in hours: ',timeSinceLastBolus_mind);

//

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
    var taa = Math.round((time - ga) / 1000 / 60);
    var tbb = Math.round((time - gb) / 1000 / 60);
    var tcc = Math.round((time - gc) / 1000 / 60);
    var tdd = Math.round((time - gd) / 1000 / 60);
    var activityContrib = 0;
    var iobContrib = 0;
    var activityContribaa = 0;
    var iobContribaa = 0;
    var activityContribbb = 0;
    var iobContribbb = 0;
    var activityContribcc = 0;
    var iobContribcc = 0;
    var activityContribdd = 0;
    var iobContribdd = 0;
 
    // force the IOB to 0 if over 5 hours have passed
    if (t < td) {

        var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
        var a = 2 * tau / td;
        var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));
       
        // original line is : activityContrib = treatment.insulin * (S / Math.pow(tau, 2) etc etc...
        activityContrib = latestinsulindose * (S / Math.pow(tau, 2)) * t * (1 - t / td) * Math.exp(-t / tau);
        iobContrib = latestinsulindose * (1 - S * (1 - a) * ((Math.pow(t, 2) / (tau * td * (1 - a)) - t / tau - 1) * Math.exp(-t / tau) + 1));
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


 // force the IOB to 0 if over 5 hours have passed for bolus a
 if (taa < td) {

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));
   
    // original line is : activityContrib = treatment.insulin * (S / Math.pow(tau, 2) etc etc...
    activityContribaa = latestinsulindosea * (S / Math.pow(tau, 2)) * taa * (1 - taa / td) * Math.exp(-taa / tau);
    iobContribaa = latestinsulindosea * (1 - S * (1 - a) * ((Math.pow(taa, 2) / (tau * td * (1 - a)) - taa / tau - 1) * Math.exp(-taa / tau) + 1));
}

results = {
    iobContribaa: iobContribaa,
    activityContribaa: activityContribaa,
    bolusTime: ga,
    time: ga,
    t: taa,
};


 // force the IOB to 0 if over 5 hours have passed for bolus a
 if (tbb < td) {

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));
   
    // original line is : activityContrib = treatment.insulin * (S / Math.pow(tau, 2) etc etc...
    activityContribbb = latestinsulindoseb * (S / Math.pow(tau, 2)) * tbb * (1 - tbb / td) * Math.exp(-tbb / tau);
    iobContribbb = latestinsulindoseb * (1 - S * (1 - a) * ((Math.pow(tbb, 2) / (tau * td * (1 - a)) - tbb / tau - 1) * Math.exp(-tbb / tau) + 1));
}

results = {
    iobContribbb: iobContribbb,
    activityContribbb: activityContribbb,
    bolusTime: gb,
    time: gb,
    t: tbb,
};

 // force the IOB to 0 if over 5 hours have passed for bolus a
 if (tcc < td) {

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));
   
    // original line is : activityContrib = treatment.insulin * (S / Math.pow(tau, 2) etc etc...
    activityContribcc = latestinsulindosec * (S / Math.pow(tau, 2)) * tcc * (1 - tcc / td) * Math.exp(-tcc / tau);
    iobContribcc = latestinsulindosec * (1 - S * (1 - a) * ((Math.pow(tcc, 2) / (tau * td * (1 - a)) - tcc / tau - 1) * Math.exp(-tcc / tau) + 1));
}

results = {
    iobContribcc: iobContribcc,
    activityContribcc: activityContribcc,
    bolusTime: gc,
    time: gc,
    t: tcc,
};


 // force the IOB to 0 if over 5 hours have passed for bolus a
 if (tdd < td) {

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));
   
    // original line is : activityContrib = treatment.insulin * (S / Math.pow(tau, 2) etc etc...
    activityContribdd = latestinsulindosed * (S / Math.pow(tau, 2)) * tdd * (1 - tdd / td) * Math.exp(-tdd / tau);
    iobContribdd = latestinsulindosed * (1 - S * (1 - a) * ((Math.pow(tdd, 2) / (tau * td * (1 - a)) - tdd / tau - 1) * Math.exp(-tdd / tau) + 1));
}

results = {
    iobContribdd: iobContribdd,
    activityContribdd: activityContribdd,
    bolusTime: gd,
    time: gd,
    t: tdd,
};

var totalBolusActivity = (activityContrib + activityContribaa + activityContribbb + activityContribcc + activityContribdd);
var totalBolusIOB = (iobContrib + iobContribaa + iobContribbb + iobContribcc + iobContribdd);
//
console.log('activity of latest bolus:',activityContrib);
console.log('activity of bolus a:',activityContribaa);
console.log('activity of bolus b:',activityContribbb);
console.log('activity of bolus c:',activityContribcc);
console.log('activity of bolus d:',activityContribdd);
console.log('Total bolus activity of latest 5 boluses: ',totalBolusActivity);
console.log('--------------------------------');
console.log('activity of latest bolus:',iobContrib);
console.log('activity of bolus a:',iobContribaa);
console.log('activity of bolus b:',iobContribbb);
console.log('activity of bolus c:',iobContribcc);
console.log('activity of bolus d:',iobContribdd);
console.log('Total bolus iob of latest 5 boluses: ',totalBolusIOB);


let totalBolusIOBString = JSON.stringify(totalBolusIOB);
console.log('this is the total bolusIOB:',totalBolusIOB)
fs.writeFile("latest_bolus_total.json", totalBolusIOBString, function(err, result) {
if(err) console.log('error', err);
});
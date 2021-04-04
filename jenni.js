// THANK YOU JENNI FOR LETTING ME USE YOUR NS DATA FOR DEVELOPING THIS SCRIPT !!!
//===============================================================================


const { floor } = require('mathjs');
const jenni_profile = require('./jenni_profile.json');
const jenni_treatments = require('./jenni_treatments.json');



// here we start gathering the tempBasals from the default profile.json file
//==========================================================================

const list1 = jenni_profile.filter(e => e._id).map(e => ({_id: e._id, defaultProfile: e.defaultProfile, store: e.store, startDate: e.startDate, mills: e.mills, units: e.units, created_at: e.created_at}));
console.log(list1);

let lastlist1 = list1.filter(function (e) {
    return e.mills >= (Date.now()-86400000);
});
//console.log('this is the latest profiles in the 24 h:',lastlist1);

const profileDefault = lastlist1.map(entry => entry.store).map(entry => ({ Default: entry.Default }));
//console.log('latest Default profile:', profileDefault);

const basalProfileDefArr = profileDefault.map(entry => entry.Default).map(entry => ({ basal: entry.basal}));
//console.log('this is the array of basal in Default profile:', basalProfileDefArr);

const defaultProfile = basalProfileDefArr.map(entry => entry.basal);
console.log('this is the latest Default profile details:', defaultProfile);

const profileAutoSync = lastlist1.map(entry => entry.store).map(entry => ({ OpenAPS_Autosync: entry['OpenAPS Autosync'] }));
//console.log('latest AutoSync profile:', profileAutoSync);

const basalProfileAutoSyncArr = profileAutoSync.map(entry => entry.OpenAPS_Autosync).map(entry => ({ basal: entry.basal}));
//console.log('this is the array of basal in AutoSync profile:', basalProfileAutoSyncArr);

const autoSyncProfiles = basalProfileAutoSyncArr.map(entry => entry.basal);
console.log('this is the latest AutoSync profile details:', autoSyncProfiles);


const autoSyncProfile_z = autoSyncProfiles[0];
var autoSyncProfile = autoSyncProfile_z.map(entry => ({ ...entry, time: parseFloat(entry.time), value: parseFloat(entry.value), timeAsSeconds: parseInt(entry.timeAsSeconds.slice(0))}));
console.log('this is the trimmed down insulin and time since injection data:',autoSyncProfile); 




// here we start gathering the tempBasals from the treatment.json file
//====================================================================

const allTempBasals = jenni_treatments.filter(e => e._id).map(e => ({duration: e.duration, timestamp: e.timestamp, absolute: e.absolute, eventType: e.eventType, created_at: e.created_at, mills: e.mills}));

let tempBasals = allTempBasals.filter(function (e) {
    return e.mills >= (Date.now()-10800000); // temps basals set in the last 3 hours
});
//console.log('these are the tempBasals from the last 3 hours:', tempBasals);

let tempBasals2 = tempBasals.filter(function (e) {
    return e.eventType = 'Temp Basal'; // temps basals set in the last 3 hours
});
console.log('these are the filtered tempBasals from the last 3 hours:', tempBasals2);

let tempBasals3 = tempBasals2.filter(function (e) {
    return e.duration != 0; // temps basals set in the last 3 hours
});
console.log('these are the filtered tempBasals from the last 3 hours:', tempBasals3);




// Now let's start to compute the insulin from profile first and temp basals
//==========================================================================
let days = (Date.now() / 86400000);
let relativeTimeOfDay = (days - Math.floor(days)) * 24 + 3;
let relativeTimeOfDaySecs = ((days - Math.floor(days)) * 24 + 3) * 60 * 60;

console.log('relative time of day since midnight in UTC time + 3h in hours:', relativeTimeOfDay);
console.log('relative time of day since midnight in UTC time + 3h in seconds:', relativeTimeOfDaySecs);


// let's detect the current basal from Autosync profile (TO DO : also minutes !)
//==============================================================================
const j = floor(relativeTimeOfDay);
console.log(j);
var currentAutoSyncBasal = autoSyncProfile[j].value;
console.log('current basal according to AutoSync profile', currentAutoSyncBasal);

// let's detect the current basal from Temp Basals
//================================================
const k = tempBasals3[0];
var tempBasalEnd = tempBasals3[1].mills + tempBasals3[0].duration * 60 * 1000;
var tempBasal = tempBasals3[0].absolute;
console.log('current Temp Basal entry:',k);



// if a temp basal is set, override the AutoSync Basal 
//====================================================
if (Date.now() < tempBasalEnd) {
    var currentTempBasal = tempBasal;
} else {
    currentTempBasal = currentAutoSyncBasal;
};
console.log('This is the final value for the basal rate now:',currentTempBasal);


// let's compute a delivery of 5 minutes of current basal, as if it were a 
// bolus, then create an array of data similar to the "entries.json" file
//========================================================================

const basalAsBoluses = require('./basalAsBoluses.json');
console.log('this is the retrieved jason:', basalAsBoluses);

let value = { 'time': Date.now(), 'insulin' : currentTempBasal/12 }
basalAsBoluses.unshift(value);
console.log('new bolusAsBoluses to be saved', basalAsBoluses);

const new_babValues = JSON.stringify(basalAsBoluses, null, 4);

const fs = require('fs');
fs.writeFile('basalAsBoluses.json', new_babValues, (err) => {
    if (err) {
        throw err;
    }
});











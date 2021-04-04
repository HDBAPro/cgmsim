// THANK YOU JENNI FOR LETTING ME USE YOUR NS DATA FOR DEVELOPING THIS SCRIPT !!!
//===============================================================================


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

const autoSyncProfile = basalProfileAutoSyncArr.map(entry => entry.basal);
console.log('this is the latest AutoSync profile details:', autoSyncProfile);





// here we start gathering the tempBasals from the treatment.json file
//====================================================================

const allTempBasals = jenni_treatments.filter(e => e._id).map(e => ({duration: e.duration, timestamp: e.timestamp, absolute: e.absolute, eventType: e.eventType, created_at: e.created_at, mills: e.mills}));

let tempBasals = allTempBasals.filter(function (e) {
    return e.mills >= (Date.now()-10800000); // temps basals set in the last 3 hours
});
console.log('these are the tempBasals from the last 3 hours:', tempBasals);



// Now let's start to compute the insulin from profile first and temp basals
//==========================================================================

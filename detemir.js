require('json.date-extensions');
JSON.useDateParser();
var resultDetAct =0;
const weight = 70;
const detemirs = require('./last_detemir.json');
var jsondet = JSON.stringify(detemirs);
var detemir_data = JSON.parseWithDate(jsondet);
console.log(detemir_data);

// activities be expressed as U/min !!!
let timeSinceDetemirAct = detemir_data.map(entry => {
    var time = entry.time;
    var dose = entry.dose;
    var duration = (16 + (20*dose/weight));
    return { ...entry, time: time, duration: duration, detemirActivity: (dose * (Math.PI/(duration*2))*(Math.sin(time*Math.PI/duration)))/60};
});
console.log('these are the detemir activities:',timeSinceDetemirAct);

// compute the aggregated activity of last detemirs in 30 hours

let lastDetemirs = timeSinceDetemirAct.filter(function (e) {
    return e.time <= 30;
});
console.log('these are the last detemirs and activities:',lastDetemirs);

var resultDetAct = lastDetemirs.reduce(function(tot, arr) { 
    return tot + arr.detemirActivity;
  },0);

console.log(resultDetAct);
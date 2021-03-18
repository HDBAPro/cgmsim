require('json.date-extensions');
JSON.useDateParser();

const weight = 70;
const detemirs = require('./last_detemir.json');
var jsondet = JSON.stringify(detemirs);
var detemir_data = JSON.parseWithDate(jsondet);
console.log(detemir_data);


let timeSinceDetemirAct = detemir_data.map(entry => {
    var time = entry.time;
    var dose = entry.dose;
    var duration = (16 + (20*dose/weight));
    return { ...entry, time: time, duration: duration, detemirActivity: dose * (Math.PI/(duration*2))*(Math.sin(time*Math.PI/duration))};
});
console.log(timeSinceDetemirAct);
const ISF = 1.5;

const latestbasals = require('./latest_basal.json');
const latestbasalsa = require('./latest_basala.json');
const latestbasalsb = require('./latest_basala.json');

const mealtimes = require('./latest_bolus_total.json');

let addedBasalActivities = latestbasals + latestbasalsa + latestbasalsb;

let totalInsulinActivity = addedBasalActivities + mealtimes;

// If the ISF is 2 mmol/l/U, this means a total decrease of glucose of 2 mmol/l per unit of insulin, over a period of DIA = 300 min.
// in other words, it means a decrease of blood glucose 2 mmol/l/U*min*300 or 0.00666667 mmol/l/U*min

// The blood glucose impact of the active insulin is insulin * ISF

let insulinBGI = -ISF * totalInsulinActivity;

console.log('total mealtime insulin activity:', mealtimes);
console.log('total basal activity:', addedBasalActivities);
console.log('total insulin activity', totalInsulinActivity);
console.log('the insulin BGI is', insulinBGI, 'mmol/l over 300 min');
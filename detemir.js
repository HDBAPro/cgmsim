// compute the insulin activity of detemir after a single injection;
//let's assume a sinusoidal activity curve
// the AUC of a sinusoidal curve from 0 to Pi is 1.
// the integral of f(x) = sin(x) from 0 to (pi/24) is 48/pi = around 15.58
// https://www.integral-calculator.com/#expr=sin%28x%2Api%2F24%29&lbound=0&ubound=24&simplify=1

// the AUC for a dose of 12 U and a duration of 18 hours (0.1U/kg) is 12 !
// and the function of "time since injection" is dose *(pi/(2*duration))*sin(x*(pi/duration))
// or activity of detemir = dose*(pi/(2*duration))*sin(x*(pi/duration))

const { pi } = require("mathjs");

//
const dose = 24;  // a basic dose 
const duration = 24;  // let's assume an action of 27 hours
const ISF = 1.5; //(mmol/l/U)
let time0 = 1613959403336
const { number } = require("mathjs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//timestamp in milliseconds;
console.log (Date.now())
// x will be the time since injection in hours
let x = (Date.now() - time0)/(60*60*1000);
let idet = dose*(Math.PI/(duration*2))*(Math.sin(x*Math.PI/duration));
let bgidet = -idet*ISF;
console.log('dose: ',dose, 'duration: ', duration, 'time since injection: ',x, 'detemir activity: ',idet,'BG impact of det: ',bgidet);


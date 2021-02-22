// compute the insulin activity of glargine 100 after a single injection;

const { pi } = require("mathjs");

//
const dose = 24;  // a basic dose 
const duration = 27;  // let's assume an action of 27 hours
const ISF = 1.5; //(mmol/l/U)
let time0 = 1613979351942
// the area of an ellipse is pi * a * b;
// the AUC of the dose of insulin is half the area of the ellipse
// so for 24 units, 12 = pi * (duration/2) * b
// calculating b is (2*dose)/(pi*duration)
let b = (2*dose)/(Math.PI*duration);
console.log(b);

const { number } = require("mathjs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//timestamp in milliseconds;
console.log (Date.now())
// x will be the time since injection in hours
let x = (Date.now() - time0)/(60*60*1000);
let g = x-(duration/2);
let gg = Math.pow(g,2);
let h = duration/2;
let hh= Math.pow(h,2);
let z = (x-gg)/hh;
let bb = Math.pow(b,2);
// the insulin activity is glargine 100 is:
let igla100 = 2*Math.sqrt(bb*(1+z));
// the BG impact of glargine is:
let bgigla100 = -igla100 * ISF
console.log('time now is:', Date.now(), ', time at injection was:', time0, 'b is:',b, ', x (elapsed time) is:', x,'hours, and z is: ',z, ', the igla now is:', igla100, ' and BGI of gla100:',bgigla100,'mmol/l/h');
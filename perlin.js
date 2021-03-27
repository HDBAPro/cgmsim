var time = Date.now();
console.log(time);
var perlin = require('perlin-noise');

var noise = perlin.generatePerlinNoise(17, 17);
// noise is an array with length 17 * 17 = 289;
//console.log(noise);
const myObject = [];
var i = 0;
for (i=0; i<noise.length; i++) {
    myObject.push(
        {noise: noise[i], order: (i), time : time + (i)*1000*60*5})
    }
console.log(myObject); 

const datamyObject = JSON.stringify(myObject, null, 4);
const fs = require('fs');
fs.writeFile('perlin.json', datamyObject, (err) => {
    if (err) {
        throw err;
    }
});

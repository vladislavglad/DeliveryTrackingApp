const lasership = require("./laser");
const USPS = require("./usps");
const UPS = require("./ups");
const determineCourier = require("./determine-courier");

const trackingNumUSPS = "YOURTRACKINGNUMBER";
const trackingNumUPS = "YOURTRACKINGNUMBER";
const trackingNumLasership = "YOURTRACKINGNUMBER";

console.log(determineCourier(trackingNumUSPS));
console.log(determineCourier(trackingNumUPS));
console.log(determineCourier(trackingNumLasership));

//console.log("When you have valid tracking numbers:");
lasership(trackingNumLasership).then(res => {
    console.log("tracking through lasership");
    console.log(res);
});
USPS(trackingNumUSPS).then(res => {
    console.log("tracking through USPS");
    console.log(res);
});
UPS(trackingNumUPS).then(res => {
    console.log("tracking through UPS");
    console.log(res);
});

//console.log("When you don't have valid tracking numbers:");
lasership("YOURTRACKINGNUMBER").then(res => {
    console.log("incorrect number through lasership");
    console.log(res);
});
USPS("YOURTRACKINGNUMBER").then(res => {
    console.log("incorrect number through USPS");
    console.log(res);
});
UPS("YOURTRACKINGNUMBER").then(res => {
    console.log("incorrect number through through UPS");
    console.log(res);
});

const lasership = require("./laser");
const USPS = require("./usps");
const UPS = require("./ups");
const _LASERSHIP = "Lasership";
const _USPS = "USPS";
const _UPS = "UPS";

function determineCourier(trackingNum) {
    let courier;
    const len = trackingNum.length;

    switch (len) {
        case 10:
            if (trackingNum.charAt(0).match(/[a-z]/i) && trackingNum.charAt(1).match(/[a-z]/i))
                courier = _LASERSHIP;
            break;
        case 18:
            if (trackingNum.charAt(0) === "1" && trackingNum.charAt(1).toLowerCase() === "z")
                courier = _UPS;
            break;
        case 22:
            courier = _USPS;
            break;

        default:
            //console.log("Cannot determine corier!");
            courier = null;
            break;
    }

    return courier;
}

async function checkDelivery(trackingNum, courier = null) {
    if (!courier)
        courier = determineCourier(trackingNum);
    let delivery = {
        courier
    };

    switch (courier) {
        case _LASERSHIP:
            delivery.delivered = (await lasership(trackingNum)).status;
            break;
        case _USPS:
            delivery.delivered = (await USPS(trackingNum)).status;
            break;
        case _UPS:
            delivery.delivered = (await UPS(trackingNum)).status;
            break;
        default:
            delivery.delivered = null;
            break;
    }

    return delivery;
}

//checkDelivery("9361289727009065855945").then(res => console.log(res));

module.exports = {
    determineCourier, 
    checkDelivery
};
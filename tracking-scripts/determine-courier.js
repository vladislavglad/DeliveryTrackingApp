const LASERSHIP = "Lasership";
const USPS = "USPS";
const UPS = "UPS";

function determineCourier(trackingNum) {
    let courier;
    const len = trackingNum.length;

    switch (len) {
        case 10:
            if (trackingNum.charAt(0).match(/[a-z]/i) && trackingNum.charAt(1).match(/[a-z]/i))
                courier = LASERSHIP;
            break;
        case 18:
            if (trackingNum.charAt(0) === "1" && trackingNum.charAt(1).toLowerCase() === "z")
                courier = UPS;
            break;
        case 22:
            courier = USPS;
            break;

        default:
            //console.log("Cannot determine corier!");
            courier = null;
            break;
    }

    return courier;
}

module.exports = determineCourier;
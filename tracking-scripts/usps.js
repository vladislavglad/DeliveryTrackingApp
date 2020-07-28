const fetch = require("node-fetch");
const cheerio = require("cheerio");
const URL = "https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=YOURTRACKINGNUMBER";

async function checkDeliveryStatus(trackingNum) {

    const trackingURL = URL.replace("YOURTRACKINGNUMBER", trackingNum);
    //console.log(trackingURL);
    
    const res = await fetch(trackingURL);
    const text = await res.text();
    //console.log(text);

    const $ = cheerio.load(text);
    const statusContainer = $(".delivery_status"); // Container that holds all the details.

    const currentStatus = statusContainer.find("strong").text().toLowerCase();
    const description = statusContainer.find(".important").text().toLowerCase();
    //console.log(`currentStatus: ${currentStatus}\ndescription: ${description}`);

    let delivery = {status: null};
    if (currentStatus.includes("status not available"))  { //|| description.includes("delivered"))
        //console.log("Your tracking number is invalid!");
        return delivery;
    } else if (currentStatus.includes("delivered")) {
        //console.log("Your package has been delivered!");
        delivery.status = true;
    } else {
        //console.log("Your package has not been delivered.")
        delivery.status = false;
    }

    return delivery;
}

let trackingNum = "YOURTRACKINGNUMBER";
//checkDeliveryStatus(trackingNum).then(res => console.log(res));
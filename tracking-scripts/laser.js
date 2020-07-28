const fetch = require('node-fetch');

// Use official lasership API to check the status.
const laserAPI = `http://www.lasership.com/track/YOURTRACKINGNUMBER/json`;

async function checkDeliveryStatus(trackingNum) {
    const trackingURL = laserAPI.replace("YOURTRACKINGNUMBER", trackingNum);
    let delivery = {};

    //console.log("Fetching response...");
    const response = await fetch(trackingURL);
    //console.log("Fetching has finished!")

    //console.log("Parsing response into JSON...");
    const jsonData = await response.json();
    if (jsonData.Error) {
        //console.error("Failed to parse: " + jsonData.ErrorMessage);
        delivery.status = null;
        return delivery;
    }
    //console.log("Finished Parsing!");
    //console.log(jsonData);

    jsonData.Events.forEach(event => {
        if (event.EventType.toLowerCase() === "delivered") {
            delivery.status = true;
            return;
        }
    });

    if (delivery.status) {
        //console.log("---\nYour package was delivered!\n");
        return delivery;
    } else {
        //console.log("---\nYour package was not delivered...\n");
        delivery.status = false;
        return delivery;
    }
}

function startTracking(trackingNum) {
    let id = setTimeout(() => {
        if(checkDeliveryStatus(trackingNum).status)
            clearTimeout(id);
    }, 30 * 1000);
}

//let trackingNum = "YOURTRACKINGNUMBER";
//checkDeliveryStatus(trackingNum).then(res => console.log(res));

module.exports = checkDeliveryStatus;
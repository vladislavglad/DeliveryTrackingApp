const fetch = require('node-fetch');
const open = require('open');

// Use official lasership API to check the status.
const laserAPI = `http://www.lasership.com/track/YOURTRACKINGNUMBER/json`;

async function checkDeliveryStatus(trackingNum) {
    let trackingURL = laserAPI.replace("YOURTRACKINGNUMBER", trackingNum);

    console.log("Fetching response...");
    const response = await fetch(trackingURL);
    console.log("Fetching has finished!")

    console.log("Parsing response into JSON...");
    const jsonData = await response.json();
    if (jsonData.Error) {
        console.error("Failed to parse: " + jsonData.ErrorMessage);
        return;
    }
    console.log("Finished Parsing!");
    //console.log(jsonData);

    let isDelivered = false;
    jsonData.Events.forEach(event => {
        if (event.EventType === "Delivered") {
            isDelivered = true;
            return;
        }
    });

    if (isDelivered) {
        console.log("---\nYour package was delivered!\n");

        // Opens the url in the default browser as proof of delivery. 
        open(`http://www.lasership.com/track/${trackingNum}`);
        return isDelivered;

    } else {
        console.log("---\nYour package was not delivered...\n");
        return isDelivered;
    }
}

function startTracking(trackingNum) {
    let id = setInterval(() => {
        if(checkDeliveryStatus(trackingNum))
            clearInterval(id);
    }, 30 * 1000);
}

// Provide your own tracking number.
let trackingNum = "YOURTRACKINGNUMBER";
// startTracking(trackingNum);
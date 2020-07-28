/* 
 Use webscraping to get details about shipment. 
 Since their API is minified and it may take a lot of time 
 to figure out things. It is easier to just scrape.
*/
const Nightmare = require("nightmare");
//const cheerio = require("cheerio");
const URL = "https://www.ups.com/track?loc=en_US&tracknum=YOURTRACKINGNUMBER";

async function checkDeliveryStatus(trackingNum) {

    const trackingURL = URL.replace("YOURTRACKINGNUMBER", trackingNum);
    //console.log(trackingURL);

    const nightmare = Nightmare();
    let delivery = {};

    try {
        const res = await nightmare
        .goto(trackingURL)
        .wait("div.ups-card_content")
        .evaluate(() => document.querySelector("#stApp_txtPackageStatus").innerHTML)
        .end();

        if (res.toLowerCase() === "delivered")
            delivery.status = true;
        else 
            delivery.status = false;

    } catch (err) {
        delivery.status = null;
    }

    return delivery;
}

// function processResponse(response) {
//     const $ = cheerio.load(response);
//     console.log($(response).text().replace(/\s\s+/g, " ").toLowerCase());
// }

//let trackingNum = "YOURTRACKINGNUMBER";
//checkDeliveryStatus(trackingNum).then(res => console.log(res));

module.exports = checkDeliveryStatus;
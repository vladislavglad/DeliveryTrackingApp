const form = document.querySelector("form");
const textField = document.getElementById("trackingNum");
const statusReportDiv = document.getElementById("report-delivery-status");
const API = "http://localhost:3000/lookup/:trackingNum";

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const trackingNum = textField.value;
    //console.log(trackingNum);

    fetch(API.replace(":trackingNum", trackingNum))
    .then((res) => res.json())
    .then((res) => {
        if (res.trackingNum) { // if the server found a valid entry.
            if (res.isDelivered) {
                statusReportDiv.innerHTML = "Your Package has been Delivered!";
                statusReportDiv.style.color = "#00FF7F";
            } else {
                statusReportDiv.innerHTML = "Your Package has not been Delivered!";
                statusReportDiv.style.color = "#FF6347";
            }
        } else {
            statusReportDiv.innerHTML = "Invalid Tracking Number!";
            statusReportDiv.style.color = "#FF6347";
        }
        statusReportDiv.style.display = "block";
    })
    .catch((err) => {
        console.log(err);
        statusReportDiv.innerHTML = "Something went wrong! Please, try again.";
        statusReportDiv.style.color = "#FF6347";
        statusReportDiv.style.display = "block";
    });
});
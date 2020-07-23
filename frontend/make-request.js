const form = document.querySelector("form");
const requestStatus = document.getElementById("requestStatus");
const anotherRequest = document.getElementById("anotherRequest");
const API = "http://localhost:3000/requestTracking";

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let data = {       
        username: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        trackingNum: document.getElementById("userTrackingNumber").value,
        isDelivered: false,
        shouldNotify: document.getElementById("userNotification").checked
    }

    //console.log(data);

    fetch(API, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
    })
    .then( (response) => response.json())
    .then( (jsonData) => {
        //console.log(jsonData);

        if (jsonData.msg === "recieved successfully!") {
            requestStatus.innerHTML = "Your request was proccessed!"
            requestStatus.style.color = "#00FF7F";
            form.style.display = "none";
            requestStatus.style.display = "block";
            anotherRequest.style.display = "block";
        } else {
            requestStatus.innerHTML = "Invalid tracking number! Try again."
            requestStatus.style.color = "#FF6347";
            requestStatus.style.display = "block"
        }
    })
    .catch((err) => {
        console.log(err);
        requestStatus.innerHTML = "Unable to proccess your request! Try again."
        requestStatus.style.color = "#FF6347";
        requestStatus.style.display = "block"
    });
});
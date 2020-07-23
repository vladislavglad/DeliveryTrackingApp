const form = document.querySelector("form");
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
    .then( (jsonData) => console.log(jsonData))
    .catch((err) => console.log(err));
});
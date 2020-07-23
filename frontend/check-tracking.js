const form = document.querySelector("form");
const textField = document.getElementById("trackingNum");
const API = "http://localhost:3000/lookup/:trackingNum";

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const trackingNum = textField.value;
    console.log(trackingNum);

    fetch(API.replace(":trackingNum", trackingNum))
    .then((res) => res.json())
    .then((jsonData) => console.log(jsonData))
    .catch((err) => console.log(err));

});
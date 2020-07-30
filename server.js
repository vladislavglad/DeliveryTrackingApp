const fs = require("fs");
const cors = require("cors");
const express = require("express");

require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

let db; // Temporary non-persistent database (will later use MongoDB)
fs.readFile("./db.json", "utf8",  (err, data) => {
    console.log("reading db. . .");
    if (err)
        console.log("unable to read db!");
    else {
        db = JSON.parse(data);
        console.log("reading db complete:"); 
        console.log(db);      
    }
});

app.use(cors());

// Built-in middleware to support JSON-encoded bodies.
app.use(express.json()); 

// To support URL-encoded bodies.
app.use(express.urlencoded()); 

app.get("/", (req, res) => {
    res.send({msg: "Hello Customer!"});
});

app.get("/all", (req, res) => {
    res.send(db);
});

app.get("/lookup/:trackingNum", (req, res) => {
    
    for (let i = 0; i < db.length; i++) {
        if (db[i].trackingNum === req.params.trackingNum) {
            res.send(db[i]);
            return;
        }
    }

    res.send({msg: "invalid tracking number!"});

});

app.post("/requestTracking", (req, res) => {
    console.log("\nrecieved new POST request:");
    console.log(req.body);
    db.push(req.body);
    console.log('"Added" to db');

    // fs.appendFile("./db.json", JSON.stringify(req.body, null, 2), () => {
    //     console.log("Added to db");
    // });

    res.send({msg: "recieved successfully!"});
});

app.post("/update/:trackingNum/", (req, res) => {

    for (let i = 0; i < db.length; i++) {
        if (db[i].trackingNum === req.params.trackingNum) {
            db[i] = req.body;
            res.send({msg: "updated successfully!"});
            return;
        }
    }

    res.send({msg: "invalid tracking number!"});
});

app.delete("/delete/:trackingNum", (req, res) => {

    for (let i = 0; i < db.length; i++) {
        if (db[i].trackingNum === req.params.trackingNum) {
            db.splice(i, 1);
            res.send({msg: "delited successfully!", trackingNum: req.params.trackingNum});
            return;
        }
    }

    res.send({msg: "invalid tracking number!"});
});

app.listen(port, () => console.log(`Server's URL is ${process.env.SERVER_URL}`));
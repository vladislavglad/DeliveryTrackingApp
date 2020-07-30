const fs = require("fs");
const cors = require("cors");
const express = require("express");
const mongoose = require('mongoose');
const determineCourier = require("./tracking-scripts/determine-courier");

require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Establish connection.
mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'connection error:'));
mongoDB.once('open', function() {
    console.log("Connection to MongoDB has been established successfylly!");
});

let db; // Temporary non-persistent database (will later use MongoDB)
fs.readFile("./db.json", "utf8",  (err, data) => {
    console.log("reading db. . .");
    if (err)
        console.log("unable to read db!");
    else {
        db = JSON.parse(data);
        console.log("reading db complete:"); 
        //console.log(db);      
    }
});

app.use(cors());
app.use(express.urlencoded()); // To support URL-encoded bodies.
app.use(express.json()); // Built-in middleware to support JSON-encoded bodies.

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

    if (req.body.email === "")
        res.send({msg: "Please provide valid email!"});
    else if (req.body.trackingNum === "")
        res.send({msg: 'Please provide a tracking number!'});
    else if (determineCourier(req.body.trackingNum) === null)
        res.send({msg: "Your tracking number is invalid!"});
    else {
        db.push(req.body);
        console.log('"Added" to db');
        res.send({msg: "Recieved successfully!"});
    }

    // fs.appendFile("./db.json", JSON.stringify(req.body, null, 2), () => {
    //     console.log("Added to db");
    // });

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
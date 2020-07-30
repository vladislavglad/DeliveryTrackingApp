const cors = require("cors");
const express = require("express");
const mongoose = require('mongoose');
const Request = require("./models/request.model");
const determineCourier = require("./tracking-scripts/determine-courier");

require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Establish connection.
mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connection to MongoDB has been established successfylly!");
});

app.use(cors());
app.use(express.urlencoded()); // To support URL-encoded bodies.
app.use(express.json()); // Built-in middleware to support JSON-encoded bodies.

app.get("/", (req, res) => {
    res.send({msg: "Server is running!"});
});

// Everything you retrieve from MongoDB is in JavaScript object format (not JSON).
app.get("/all", async (req, res) => {
    try {
        const allRequests = await Request.find();
        //console.log(allRequests);
        res.json(allRequests);
    } catch(err){
        console.log(err);
        res.status(400).send({msg: "Error: " + err})
    }
});

app.get("/lookup/:trackingNum", async (req, res) => {
    const recievedNum = req.params.trackingNum;
    //console.log("Recieved from user: " + recievedNum);
    try {
        const requestEntry = await Request.findOne( {trackingNum: recievedNum} ).exec();
        //console.log("Found in DB: " + requestEntry);
        if (!requestEntry) // in case nothing was found -> null
            res.send({msg: "No such entry found!"});
        else 
            res.send(requestEntry);
    } catch(err) {
        //console.log(err);
        res.status(400).send({msg: err});
    }
});

app.post("/requestTracking", (req, res) => {
    // console.log("\nrecieved new POST request:");
    // console.log(req.body);

    if (req.body.email === "")
        res.send({msg: "Please provide valid email!"});
    else if (req.body.trackingNum === "")
        res.send({msg: 'Please provide a tracking number!'});
    else if (determineCourier(req.body.trackingNum) === null)
        res.send({msg: "Your tracking number is invalid!"});
    else {
        const newEntry = new Request({
            username: req.body.username,
            email: req.body.email,
            trackingNum: req.body.trackingNum,
            courier: determineCourier(req.body.trackingNum),
            isDelivered: false
        })
        .save((err, entry) => {
            if (err) {
                //console.log(err);
                res.send({msg: err});
            } else {
                // console.log("New entry has been added:");
                // console.log(entry);
                res.send({msg: "Recieved successfully!"});
            }
        });
    }

});

app.post("/update/:trackingNum/", async (req, res) => {
    const {username, email, trackingNum} = req.body;
    //console.log(username, email, trackingNum);

    try {
        const entry = await Request.findOneAndUpdate( {trackingNum: req.params.trackingNum});

        if (entry.length === 0)
            res.send({msg: "No such entry found!"});
        else {
            entry.username = username;
            entry.email = email;
            entry.trackingNum = trackingNum;
            entry.save( (err, updatedEntry) => {
                if (err) {
                    //console.log(err);
                    res.send({msg: err});
                } else {
                    //console.log(updatedEntry);
                    res.send({msg: "Successfully updated!"});
                }
            });
        }
    } catch(err) {
        //console.log(err);
        res.send({msg: err});
    }

});

app.delete("/delete/:trackingNum", async (req, res) => {
    // console.log("Recieved from user" : req.params.trackingNum);

    try {
        const entry = Request.findOneAndDelete( {trackingNum: req.body.trackingNum});
        // console.log(entry);

        if (entry.length === 0)
            res.send({msg: "No such entry found!"});
        else
            res.send({msg: "Request was succesfully delited!"});
    } catch(err) {
        // console.log(err);
        res.send({msg: err});
    }

});

app.listen(port, () => console.log(`Server's URL is ${process.env.SERVER_URL}`));

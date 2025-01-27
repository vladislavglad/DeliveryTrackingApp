require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const serviceAccount = require(process.env.SERVICE_ACCOUNT);
const Request = require("./models/request.model");
const Tracking = require("./tracking-scripts/tracking");
const sendEmail = require("./email/send-email");
const PUSH_NOTIFY = true;

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Establish connection.
mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connection to MongoDB has been established successfylly!");
});

// Firebase initialization.
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

// Firebase message payload.
const payload = {
    data: {
        someKey: "someValue" // Sending optional data.
    },
    notification: {
        body: "Your package has been delivered!"
    }
};

// Firebase message options.
const options = {
    priority: "High",
    timeToLive: 60 * 60 * 24,
    userInteraction: true
};

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

app.get("/checkStatus/:trackingNum", async (req, res) => {
    const number = req.params.trackingNum;
    const status = await Tracking.checkDelivery(number);
    // console.log(status);

    if (!status.courier) 
        res.send({msg: "Your tracking number is invalid!"});
    else if (status.delivered) 
        res.send({msg: "Your package has been delivered!"});
    else if (status.delivered === null) 
        res.send({msg: "Cannot determine delivery status!"});
    else 
        res.send({msg: "Your package has not been delivered!"});

});

app.post("/requestTracking", (req, res) => {
    // console.log("\nrecieved new POST request:");
    // console.log(req.body);

    if (req.body.email === "" && !PUSH_NOTIFY) // If notification option is through email.
        res.send({msg: "Please provide valid email!"});
    else if (Tracking.determineCourier(req.body.trackingNum) === null)
        res.send({msg: "Your tracking number is invalid!"});
    else {
        const newEntry = new Request({
            username: req.body.username,
            email: req.body.email,
            trackingNum: req.body.trackingNum,
            courier: Tracking.determineCourier(req.body.trackingNum),
            token: req.body.token
            // isDelivered: false // Already, taken care by the 'default' attribute in DB Schema.
        })
        .save((err, entry) => {
            if (err) {
                //console.log(err);
                res.send({msg: "Duplicate record detected!"}); // Causes crashing if sending err directly.
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

async function runSingleDeliveryCheck() {
    const entries = await Request.find(); // Gets all entries from DB.
    //console.log(entries);

    entries.forEach(async entry => {
        const {email, username, token} = entry;

        if (!entry.isDelivered) {
            const status = await Tracking.checkDelivery(entry.trackingNum, entry.courier);
            //console.log(`email: ${email}, status: ${status}`);

            if (status.delivered) {
                entry.isDelivered = true;
                // entry.save();
                // console.log("Sending notification to the client. . .");

                if (PUSH_NOTIFY) {
                    admin.messaging().sendToDevice(token, payload, options)
                        .then((res) => {
                            // console.log("Sent succsessfully!");
                            // console.log(res);
                            entry.sentNotification = true;
                            entry.save();
                    })
                    .catch((err) => {
                        // console.log("Error sending message: ");
                        // console.log(err);
                        entry.save();
                    });                
                } else {
                    sendEmail(email, username)
                    .then(() => {
                        // console.log("Email has been sent!");
                        entry.sentNotification = true;
                        entry.save();
                    })
                    .catch(err => {
                        // console.log(err);
                        entry.save();
                    });
                }
            }

        } else if (!entry.sentNotification) {
            // console.log("Sending notification to the client. . .");

            if (PUSH_NOTIFY) {
                admin.messaging().sendToDevice(token, payload, options)
                    .then((res) => {
                        // console.log("Sent succsessfully!");
                        // console.log(res);
                        entry.sentNotification = true;
                        entry.save();
                    })
                    .catch((err) => {
                        // console.log("Error sending message: ");
                        // console.log(err);
                        entry.save();
                    });
            } else {
                sendEmail(email, username)
                    .then(() => {
                        // console.log("Email has been sent!");
                        entry.sentNotification = true;
                        entry.save();
                    })
                    .catch(err => {
                        // console.log(err);
                        entry.save();
                    });
            }
        }
    });

    console.log("All delivery checks are done!");
}

function runDeliveryChecks(interval = 180 * 1000) {
    setInterval(() => {
        runSingleDeliveryCheck();
    }, interval);
}

app.listen(port, () => {
    console.log(`Server is ready and running on ${process.env.SERVER_URL}`);
    runDeliveryChecks();
});

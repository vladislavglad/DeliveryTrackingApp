const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: false
    },
    trackingNum : {
        type: String,
        unique: true,
        minlength: 10,
        required: true
    },
    courier: {
        type: String
    },
    token: {
        type: String,
        required: true,
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    sentNotification: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Request", requestSchema);

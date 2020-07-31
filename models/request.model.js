const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
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
    isDelivered: {
        type: Boolean,
        default: false
    },
    sentEmail: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Request", requestSchema);

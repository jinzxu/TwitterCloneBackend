const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        reqruied: true,
        trim: true
    },
    lastName: {
        type: String,
        reqruied: true,
        trim: true
    },
    username: {
        type: String,
        reqruied: true,
        trim: true,
        unique: true

    },
    email: {
        type: String,
        reqruied: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        reqruied: true
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.jpeg"
    },
}, { timestamps: true })
var User = mongoose.model("User", userSchema);
module.exports = User;
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(db)
            .then(() => {
                console.log("Database connected")
            })
            .catch((err) => {
                console.log(err)
            })
    }

}

module.exports = new Database();
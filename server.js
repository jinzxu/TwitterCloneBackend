const express = require("express");
const app = express();
//Connect Database
app.use(express.json({ extended: false }));
const mongoose = require("./db/database")
app.get("/", (req, res) => res.send("API Running"));
//Define Routes
app.use("/register", require("./routes/registerRoutes"));
app.use("/login", require("./routes/loginRoutes"));
app.use("/tweet", require("./routes/tweetRoutes"));
module.exports = app;
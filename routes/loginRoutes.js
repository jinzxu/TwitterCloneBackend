const express = require('express');
const router = express.Router();
const User = require("../schemas/UserSchema")
const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("config");

// Get a user by token
router.get('/', auth, async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Login a user
router.post("/", async (req, res) => {
    var { logUsername, logPassword } = req.body
    if (logUsername && logPassword) {
        try {
            var user = await User.findOne({
                $or: [
                    { username: logUsername },
                    { email: logUsername }
                ]
            })
            if (user != null) {
                var result = await bcrypt.compare(logPassword, user.password);
                if (result === true) {
                    // Return jsonwebtoken
                    const payload = {
                        user: {
                            id: user.id
                        }
                    }
                    jwt.sign(
                        payload,
                        config.get("jwtSecret"),
                        { expiresIn: "5 days" },
                        (err, token) => {
                            if (err) throw err;
                            res.json({ token });
                        }
                    );
                    return res.status(200).json(`${user.username} succesfully logged in!`)
                }
            }
            return res.status(400).json("Login credentials invalid");
        } catch (err) {
            console.log(err.message)
            res.status(500).send("Server error")
        }
    }
    return res.status(400).json("Login credentials invalid.");
})
module.exports = router;
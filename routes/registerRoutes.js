const express = require('express');
const router = express.Router();
const User = require("../schemas/UserSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("config");
const { check, validationResult } = require("express-validator");
// Get all registered users
router.get("/getall", async (req, res) => {
    try {
        User.find({}, function (err, users) {
            var userMap = {};
            users.forEach((user) => {
                userMap[user._id] = user;
            });
            res.send(userMap);
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message)
    }
})
// remove all users
router.delete('/deleteall', async (req, res) => {
    await User.deleteMany({});
    res.status(200).send({ message: "All users are deleted" });
});
// Register a user
router.post("/", [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last Name is required").not().isEmpty(),
    check("username", "UserName is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "please enter a password with 6 or more chacraters").isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    var { firstName, lastName, username, email, password } = req.body
    if (firstName && lastName && username && email && password) {
        try {
            let user = await User.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            })
            if (user) {
                // User already exists
                if (email == user.email) {
                    // console.log("Email already exists")
                    return res.status(400).json({ errors: [{ msg: `Email already exists: ${email}` }] });
                }
                else {
                    // console.log("Username already exists")
                    return res.status(400).json({ errors: [{ msg: `Username already exists: ${username}` }] });
                }
            } else {
                // User does not exist
                // console.log("No same user found and will register new user")
                var data = req.body;
                data.password = await bcrypt.hash(password, 10)
                User.create(data)
                    .then((user) => {
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
                                res.json([user, token]);
                            }
                        );
                        // console.log(user)
                    })
            }
        } catch (err) {
            console.log(err.message)
            res.status(500).send("Server error")
        }
    }
})

module.exports = router;
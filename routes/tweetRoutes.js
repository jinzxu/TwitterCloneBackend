const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser")
const User = require('../schemas/UserSchema');
const Tweet = require('../schemas/TweetSchema');
const auth = require("../middleware/auth")

// Delete all tweets
router.delete("/deleteall", async (req, res) => {
    try {
        await Tweet.deleteMany({});
        res.status(200).send({ message: "All tweets are deleted" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message)
    }
})
// Read all tweets
router.get("/", auth, async (req, res) => {
    try {
        const tweets = await Tweet.find().sort({ updatedAt: -1 });
        res.json(tweets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// Create a post
router.post("/", [auth,
    check("content", "Content is required").not().isEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findById(req.user.id).select("-password");
        var tweetData = {
            content: req.body.content,
            tweetedBy: user
        }
        Tweet.create(tweetData)
            .then(async newTweet => {
                newTweet = await User.populate(newTweet, { path: "tweetedBy" })
                res.status(200).json(newTweet);
            })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Update a post
router.put("/:id", auth, async (req, res) => {
    try {
        const post = await Tweet.findById(req.params.id)
        post.content = req.body.content
        //Check post
        if (!post) {
            return res.status(404).json({ msg: "Tweet not found" })
        }
        //Check user
        if (post.tweetedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Delete a post
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Tweet.findById(req.params.id);
        //Check post
        if (!post) {
            return res.status(404).json({ msg: "Tweet not found" })
        }
        //Check user
        if (post.tweetedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await post.remove();
        res.json({ msg: "Tweet removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})
module.exports = router;
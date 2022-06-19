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

// Create a tweet
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

// Update a tweet
router.put("/:id", auth, async (req, res) => {
    try {
        const updatedTweet = await Tweet.findById(req.params.id)
        updatedTweet.content = req.body.content
        //Check post
        if (!updatedTweet) {
            return res.status(404).json({ msg: "Tweet not found" })
        }
        //Check user
        if (updatedTweet.tweetedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await updatedTweet.save();
        res.status(200).json(updatedTweet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Delete a tweet
router.delete("/:id", auth, async (req, res) => {
    try {
        const deletedTweet = await Tweet.findById(req.params.id);
        //Check tweet
        if (!deletedTweet) {
            return res.status(404).json({ msg: "Tweet not found" })
        }
        //Check user
        if (deletedTweet.tweetedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await deletedTweet.remove();
        res.json({ msg: "Tweet removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Like a tweet
router.put("/like/:id", auth, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        //Check if the tweet has already been liked
        if (tweet.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" })
        }
        tweet.likes.unshift({ user: req.user.id });
        await tweet.save();
        console.log("tweet", tweet)
        res.json(tweet.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Unlike a tweet
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        //Check if the post has already been liked
        if (tweet.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not yet been liked" })
        }
        // Get remove index
        const removeIndex = tweet.likes.map(like => like.user.toString()).indexOf(req.user.id);
        tweet.likes.splice(removeIndex, 1);
        await tweet.save();
        console.log("tweet", tweet)
        res.json(tweet.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})
module.exports = router;
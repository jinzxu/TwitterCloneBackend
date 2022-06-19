const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser")
const User = require('../schemas/UserSchema');
const Post = require('../schemas/PostSchema');
const auth = require("../middleware/auth")

// Delete all posts
router.delete("/deleteall", async (req, res) => {
    try {
        await Post.deleteMany({});
        res.status(200).send({ message: "All posts are deleted" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message)
    }
})
// Read all posts
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.json(posts);
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
        var postData = {
            content: req.body.content,
            postedBy: user
        }
        Post.create(postData)
            .then(async newPost => {
                newPost = await User.populate(newPost, { path: "postedBy" })
                res.status(200).json(newPost);
            })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Update a post
router.put("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        post.content = req.body.content
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
        const post = await Post.findById(req.params.id);
        console.log(post)
        //Check post
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }
        //Check user
        if (post.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await post.remove();
        res.json({ msg: "Post removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})
module.exports = router;
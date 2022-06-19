const express = require('express');
const router = express.Router();
const User = require('../schemas/UserSchema');
const Chat = require('../schemas/ChatSchema');
const config = require("config");
const { check, validationResult } = require("express-validator");
const Message = require('../schemas/MessageSchema');
const auth = require("../middleware/auth")
// Delete all chat groups and messages
router.delete("/deleteall", async (req, res) => {
    try {
        await Chat.deleteMany({});
        await Message.deleteMany({});
        res.status(200).send({ message: "All chat groups and messages are deleted" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message)
    }
})

// Create group test
router.post("/", auth, async (req, res) => {
    try {
        if (!req.body) {
            console.log("Users param not sent with request");
            return res.status(400).json("Users param not sent with request");
        }
        var users = req.body;
        if (users.length == 0) {
            console.log("Users are empty");
            return res.status(400).json("Users are empty");
        }
        var chatData = {
            users: users,
            isGroupChat: true
        };
        Chat.create(chatData)
            .then(results => res.status(200).json(results))
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})
// Get all group chats
router.get("/", auth, async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users")
            .sort({ updatedAt: -1 })
            .then(results => {
                res.status(200).send(results)
            })
            .catch(error => {
                console.log(error);
                res.status(400).json(errors);
            })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})
// Get group chat by chatid
router.get("/:chatId", auth, async (req, res) => {
    try {
        var chat = await Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users");
        if (chat == null) {
            return res.status(400).json("Chat does not exist or the user is not authorized to read the message in this chat.");
        } else {
            Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.user.id } } })
                .populate("users")
                .then(results => {
                    res.status(200).send(results)
                })
                .catch(error => {
                    console.log(error);
                    res.status(400).json(errors);
                })
        }

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }

})
// Create Message
router.post("/:chatId/messages", auth, async (req, res) => {
    try {

        if (req.body.content.trim() == "") {
            return res.status(400).json("Empty message is not allowed");
        }
        var chat = await Chat.findOne({ _id: req.body.chatId, users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users");
        if (chat == null) {
            return res.status(400).json("Chat does not exist or the user is not authorized to create the message in this chat.");
        } else {
            var newMessage = {
                sender: req.user.id,
                content: req.body.content,
                chat: req.body.chatId
            };
            Message.create(newMessage)
                .then(async message => {
                    message = await message.populate("sender");
                    message = await message.populate("chat");
                    Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
                        .catch(error => console.log(error));
                    res.status(200).send(message);
                })
                .catch(error => {
                    console.log(error);
                    res.sendStatus(400);
                })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})
// Read message
router.get("/:chatId/messages", auth, async (req, res) => {
    try {
        var chat = await Chat.findOne({ _id: req.body.chatId, users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users");
        if (chat == null) {
            return res.status(400).json("Chat does not exist or the user is not authorized to read the message in this chat.");
        } else {
            res.status(200).json({ "chatPage": chat });
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})
module.exports = router;
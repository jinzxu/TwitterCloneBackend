const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    content: { type: String, trim: true },
    tweetedBy: { type: Schema.Types.ObjectId },
    retweetedBy: { type: Schema.Types.ObjectId },
    originTweetId: { type: Schema.Types.ObjectId },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users"
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    threads: [
        {
            threadedBy: {
                type: Schema.Types.ObjectId
            },
            content: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    retweets: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users"
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
}, { timestamps: true });

var Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
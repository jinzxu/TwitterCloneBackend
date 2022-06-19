const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    content: { type: String, trim: true },
    tweetedBy: { type: Schema.Types.ObjectId },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users"
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
}, { timestamps: true });

var Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
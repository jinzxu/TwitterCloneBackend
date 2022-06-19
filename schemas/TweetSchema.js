const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    content: { type: String, trim: true },
    tweetedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean
}, { timestamps: true });

var Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messagesSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
        timestamps: true // save timestamps into the message database
    });

module.exports = mongoose.model('Messages', messagesSchema);
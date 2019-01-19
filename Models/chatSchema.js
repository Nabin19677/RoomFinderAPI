const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants : [ { type: Schema.Types.ObjectId, ref: 'User' } ]
});

module.exports = mongoose.model('Chat',chatSchema);
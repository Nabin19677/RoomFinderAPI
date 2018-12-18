const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    owner : {type : String},
    owneremail : {type : String},
    ownerphone : {type : String},
    location : {type : String}
});

module.exports = mongoose.model('Room',roomSchema);
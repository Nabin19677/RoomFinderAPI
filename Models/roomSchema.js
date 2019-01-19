const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    ownerId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ownerPhone : {type : String},
    ownerName : { type : String},
    typeOfRent : {
        type : String
    },
    numberOfRoom : { // 1-5 rooms
        type : String,
        // min : 1,
        // max : 5
    },
    facilitiesAvailable : {type : Object},
    additionalFeatures : {
        type : String
    },  
    description : {
        type : String
    },
    price : {
        type : Number,
        // min : 100
    },
    location : {type : String },
    roomImage : [
        { type : String }
    ]
});

module.exports = mongoose.model('Room',roomSchema);
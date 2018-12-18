const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname : {type : String},
    email : {type : String},
    phone : {type : String},
    password : {type : String}
});

module.exports = mongoose.model('User',userSchema);
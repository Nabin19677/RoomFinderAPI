//Run Server of port number 3000
//Dependencies
const express = require('express');
const mongoose = require('mongoose');

//Others
const config = require('./config/config');

const app = express(); // creating express app

//Mongo Connect
mongoose.Promise = global.Promise;
mongoose.connect(
    config.url,
    { useNewUrlParser : true}
);

//Parse to JSON
app.use(express.json());

//Routing to User
var userRoute = require('./Routes/user');
app.use('/user',userRoute);

//Routing to rooms


//Listen to port
app.listen(3000,() => {
    console.log('Server started at 3000');
});


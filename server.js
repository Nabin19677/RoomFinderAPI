const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const logger = require('morgan');
const helpers = require('./Helpers/helpers');
const httpCodes = require('http-status-codes');
const cors = require('cors');
const config = require('./config/config');

const app = express(); // creating express app

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


//Cross origin resource sharing 
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT', 'OPTIONS');
    res.header(
        'Acess-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});
app.use(passport.initialize());
//Parse to JSON
app.use(bodyParser.json({ limit : '50mb'}));

app.use(logger('dev'));

//Mongo Connect
mongoose.Promise = global.Promise;
mongoose.connect(
    // config.url,
    config.mongoOnCloudUrl,
    { useNewUrlParser: true }
);

//Bring the passport strategy
require('./config/userPassport')(passport);
protection = passport.authenticate('jwt', { session: false }); // auth

//Parsing token to user object and adding that user object to the request in express.js middleware
var sendUserObjectToRequest = function (req, res, next) {
    req.userObject = helpers.parseJwtDataToUserObject(req.headers.token);
    next();
}

//Room-Image-Route
app.use('/room-finder/RoomImage', express.static('RoomImageUploads'));

//Routing to Authentication //update change from /room-finder/user to /room-finder/auth cause we will open only this route for authentication and all other route will be protected 
var authRoute = require('./Routes/auth');
app.use('/room-finder/auth', authRoute);

//Routing to User Related routes
var userRoute = require('./Routes/user');
app.use('/room-finder/user', protection, sendUserObjectToRequest, userRoute);

//Routing to rooms
var roomRoute = require('./Routes/rooms');
app.use('/room-finder/rooms', protection, sendUserObjectToRequest, roomRoute);

//Socket logic goes here
require('./socket/streams')(io);
//Socket login ened here

//Routing to chat
var chatRoute = require('./Routes/chat');
app.use('/room-finder/chat',protection, sendUserObjectToRequest ,chatRoute);

//Welcome
app.get('/room-finder', (req, res) => {
    res.send({
        'statusCode': httpCodes.CONTINUE,
        'statusMessage': 'Its working, WELCOME TO ROOMFINDER'
    });
});

//Listen to port 3000
server.listen(config.port, () => {
    console.log(`Server started at ${config.port}`);
});


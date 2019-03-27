var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../Models/userSchema');
var config = require('../config/config');

module.exports = (passport) => {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromHeader('token');
    opts.secretOrKey = config.jwtSecret;
    passport.use(
        new jwtStrategy( opts , (jwt_payload, done) => { // Java Web Token Strategy
            User.findOne({ id : jwt_payload.id } , (err , userData) => {
                if(err){
                    return done(err,false);
                }
                if(userData){
                    return done(null,userData);
                } else {
                    return done(null,false);
                }
            });
        })
    );
}


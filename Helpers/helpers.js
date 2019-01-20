//Helpers for various tasks

//Dependencies
var crypto = require('crypto');
var config = require('../config/config');
const dateTime = require('date-and-time'); //date time format module
var querystring = require('querystring');
var jwt = require('jsonwebtoken');
//Container for all the helpers
var helpers = {};

//Create a SHA256 Hash
helpers.hash = function (str) {
  if (typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  }catch(e){
    return {};
  }
};

//Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    //Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    //Start the final string
    var str = '';
    for(i = 1; i<=strLength; i++){
      //Get a random character from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      //Append this character to the final string
      str += randomCharacter;
    }
    //Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.parseJwtDataToUserObject = function(token){
  return jwt.decode(token);
}

helpers.roomImageFileDescriptor = function(req){
  filename = req.userObject.data.phone +'-'+ this.createRandomString(15) +'-'+ ( dateTime.format( new Date(), 'YYYYMMMDDdddHHmss'));
  return './RoomImageUploads/' + filename + '.jpeg';
}

helpers.baseToImage = function(baseData , callback ){
  if (baseData){
    callback(null,baseData.replace(/^data:image\/jpeg;base64,/, ""));
  } else {
    callback(new Error('No Image'));
  }
}

helpers.splitAndGet = function(string , splitter , index ){
  return string.split(splitter)[index];
}

helpers.escapeRegex = function(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//export
module.exports = helpers;

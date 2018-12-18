//Dependencies
const User = require('../Models/userSchema');
const helpers = require('../Helpers/helpers');

//user controller
user = {};

//user - POST METHOD
//required - fullname,email,phone,password
user.post = function(req,res){
    let data = req.body;

    //Leave validation if it is in client side but do a low level validation though.

    //hashing password using helpers
    data.password = helpers.hash(data.password);

    User.create(data)
        .then((data) => { //if sucessful
            res.send({
            'statusCode' : 201,
            'statusMessage' : 'User added successfully' ,
            'data' : data,
            'Date': Date.now()
            });
        })
        .catch((err) => {res.send({ //if error, probably something wrong with server mongodb
            'statusCode' : 500,
            'statusMessage' : 'SERVER ERROR'
        })});

   
};

//user - GET METHOD
user.get = async function(req,res){
    //req.query.phone to get from query
    //re.params.phone if it is passed as parameters
    // phone from query and search in database
    //mongodb part here and send status
    await User.findOne({ phone : req.query.phone})
        .then((data) => {
            res.send({
                'statusCode' : 200,
                'statusMessage' : 'Found the user',
                'data' : data
            });
        })
        .catch((err) => {
            res.send({
                'statusCode' : 500,
                'statusMessage' : 'Cannot find the user'
            });
        });   
};

//user - PUT METHOD
//Update needs a form to fill up
//Can update anything else password here
//first needs to verify user
//Do something from session later 
//leave for now
//somehow we need to make sure user gets his unique id set by mongodb for processes like put and delete
user.put = async function(req,res){
    let data = req.body;
    
    await User.findByIdAndUpdate({ _id : data._id }, data)
        .then((data) => {
            res.send( {
                'statusCode' : 200,
                'statusMessage' : 'Updated successfully'
            })
        })
        .catch((err) => {
            res.send( {
                'statusCode' : 500,
                'statusMessage' : 'Cannot update the user'
            })
        });
};

//user - DELETE METHOD
//needs to verify user
user.delete = async function(req,res){
    // phone from query and delete from  database

    //verify the user who is going to delete this user
    //Do something from session

    //Delete user
    await User.deleteOne({  phone : req.query.phone })
        .then((data) => res.send({
            'statusCode' : 200,
            'statusMessage' : 'User deleted'
         })
        )
        .catch((err) => res.send({
            'statusCode' : 500,
            'statusMessage' : 'Cannot delete the user'
         })
        );
    
};

module.exports = user;
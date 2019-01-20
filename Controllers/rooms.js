const httpCodes = require('http-status-codes');
const helpers = require('../Helpers/helpers');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Room = require('../Models/roomSchema');
const User = require('../Models/userSchema');
rooms = {}

rooms.addRoom = async (req, res) => {
    var roomData;
    if (req.body.typeOfRent && req.body.numberOfRoom && req.body.facilitiesAvailable && req.body.price && req.body.location && (req.body.RoomImage.length > 0)) {
        await Room.create({
            ownerId: req.userObject.data._id,
            ownerPhone: req.userObject.data.phone,
            ownerName: req.userObject.data.fullname,
            typeOfRent: req.body.typeOfRent,
            numberOfRoom: req.body.numberOfRoom,
            facilitiesAvailable: req.body.facilitiesAvailable,
            additionalFeatures: req.body.additionalFeatures,
            price: req.body.price,
            location: req.body.location
        }).then(data => {
            roomData = data ;
            req.body.RoomImage.forEach(image => {
                roomImageFileDescriptor = helpers.roomImageFileDescriptor(req);//working upto here
                helpers.baseToImage(image, (err, imageData) => {
                    if (err) {
                        res.send({
                            'statusCode': 500,
                            'statusMessage': 'Image cannot be converted'
                        });
                    } else {
                        fs.writeFile(roomImageFileDescriptor, imageData, 'base64', (err) => {
                            if (err) {
                                res.send({
                                    'statusCode': 500,
                                    'statusMessage': 'Image cannot be written'
                                });
                            } else {
                                Room.updateOne({
                                    _id: data._id
                                }, {
                                        $push: {
                                            roomImage: helpers.splitAndGet(roomImageFileDescriptor, '/', 2)
                                        }
                                    })
                                    .then(updated => {
                                        console.log('updated');
                                    })
                                    .catch(err => {
                                        res.send({
                                            'statusCode': 500,
                                            'statusMessage': 'Image cannot be saved'
                                        });
                                    });
                            }
                        });
                    }
                });
            });
        })
            .catch(err => {
                res.send({
                    'statusCode': 500,
                    'statusMessage': 'Something fissy wmith server'
                });
            })

        console.log('When will I come here')
        User.updateMany({
            _id: { $nin: [req.userObject.data._id] },
            personalDetails: {
                typeOfRent : roomData.typeOfRent,
                // food: req.userObject.data.personalDetails.food,
                // smoking: req.userObject.data.personalDetails.smoking,
                // drinking: req.userObject.data.personalDetails.drinking,
                // cleanliness: req.userObject.data.personalDetails.cleanliness
            }
        }, {
                $push: {
                    notifications: {
                        type: 'room',
                        pusherId: req.userObject.data._id,
                        pusherName: req.userObject.data.fullname,
                        message: `${req.userObject.data.fullname} added new Room of your interest.`,
                        roomId: roomData._id
                    }
                }
            }, (err, raw) => {
                if (err) {
                    console.log('user update error');
                    res.send({
                        'statusCode': 500,
                        'statusMessage': 'Something fissy with server'
                    });
                } else {
                    console.log('user updated');
                    res.send({
                        'statusCode': 200,
                        'statusMessage': 'Room Added'
                    });
                }
            })
    } else {
        console.log("WHy here????");
        res.send({
            'statusCode': 400,
            'statusMessage': 'Fill all the form please'
        });
    }
}

rooms.getRoomsByOwner = (req, res) => {
    Room.find({ ownerPhone: req.params.ownerPhone }, (err, data) => {
        if (err) {
            res.send({
                'statusCode': httpCodes.NOT_FOUND,
                'statusMessage': 'No room posted by ...'
            });
        } else {
            res.send({
                'statusCode': httpCodes.OK,
                'statusMessage': 'Got rooms of this owner',
                'rooms': data // object of room objects owned by someone
            });
        }
    });
}

rooms.getRoomsPosts = (req, res) => {
    Room.find({ ownerId: req.userObject.data._id }, (err, data) => {
        if (err) {
            res.send({
                'statusCode': httpCodes.NOT_FOUND,
                'statusMessage': 'No room posted by ...'
            });
        } else {
            res.send({
                'statusCode': httpCodes.OK,
                'statusMessage': 'Got rooms of this owner',
                'rooms': data // object of room objects owned by someone
            });
        }
    });
}

rooms.getRoomsByOwnerId = (req, res) => {
    Room.find({ ownerId: req.params.ownerId }, (err, data) => {
        if (err) {
            res.send({
                'statusCode': httpCodes.NOT_FOUND,
                'statusMessage': 'No room posted by ...'
            });
        } else {
            res.send({
                'statusCode': httpCodes.OK,
                'statusMessage': 'Got rooms of this owner',
                'rooms': data // object of room objects owned by someone
            });
        }
    });
}


//Navigation
rooms.getRoomForHome = (req, res) => {
    Room.find({ ownerId: { $nin: [req.userObject.data._id] } }, (err, data) => {
        if (err) {
            res.send({
                'statusCode': httpCodes.NOT_FOUND,
                'statusMessage': 'No rooms found'
            });
        } else {
            res.send({
                'statusCode': httpCodes.OK,
                'statusMessage': 'Found some rooms',
                'rooms': data // object of room objects at some ....blah...blah ...blah place
            });
        }
    })
}

rooms.search = (req, res) => {

    const regex = new RegExp(helpers.escapeRegex(req.body.searchParam), 'i');

    Room.find(
        {
            $and: [
                { $or: [{ location: regex }, { typeOfRent: regex }, { description: regex }] },
                { $and: [{ price: { $gt: req.body.min || 999 } }, { price: { $lt: req.body.max || 100000 } }] },
                { ownerId: { $nin: [req.userObject.data._id] } }
            ]
        }
        , (err, data) => {
            if (err) {
                res.send(500);
            } else {
                res.send(data);
            }
        });
}

rooms.deleteRoom = (req, res) => {
    Room.deleteOne({ _id: req.params.id }, err => {
        if (err) {
            res.send({ err });
        } else {
            res.send({ error: false });
        }
    });
}

module.exports = rooms;
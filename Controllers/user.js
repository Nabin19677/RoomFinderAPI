const httpCodes = require('http-status-codes');
const helpers = require('../Helpers/helpers');
const User = require('../Models/userSchema');
const Room = require('../Models/roomSchema');

var userCtrl = {}


userCtrl.profile = (req, res) => {
    User.findOne({ phone: req.userObject.data.phone })
        .then(userData => {
            userData.password = null;
            Room.find({ ownerPhone: req.userObject.data.phone }, (err, data) => {
                if (err) {
                    res.send({
                        'statusCode': httpCodes.NOT_FOUND,
                        'statusMessage': 'No room posted by ...'
                    });
                } else {
                    res.send({
                        'statusCode': httpCodes.OK,
                        'statusMessage': 'Got rooms you owned',
                        'user': userData,
                        'rooms': data
                    });
                }
            });
        })
        .catch(err => {
            res.send({
                'statusCode': httpCodes.CONFLICT,
                'statusMessage': 'Some error idk',
            });
        });
}

userCtrl.editInfo = (req, res) => {
    if (req.body.fullname || req.body.email) {
        User.updateOne({ phone: req.userObject.data.phone }, req.body, function (err) {
            if (err) {
                res.send({
                    'statusCode': httpCodes.CONFLICT,
                    'statusMessage': 'Could not modify data'
                });
            } else {
                res.send({
                    'statusCode': httpCodes.OK,
                    'statusMessage': 'Modified',
                })
            }
        });
    } else {
        res.send({
            'statusCode': httpCodes.NO_CONTENT,
            'statusMessage': 'Please send contents to modify'
        });
    }
}

// @todo take three fields : currentPassword , password 
//check confirm password in client side
//check current password in database and update password #dont forget to hash password
userCtrl.changePassword = (req, res) => {
    if (req.body.currentPassword || req.body.newPassword) {
        User.findOne({ phone: req.userObject.data.phone })
            .then(userData => {
                if (helpers.hash(req.body.currentPassword) == userData.phone) {
                    User.updateOne({ phone: req.userObject.data.phone }, req.body, (err) => {
                        if (err) {
                            res.send({
                                'statusCode': httpCodes.CONFLICT,
                                'statusMessage': 'Error changing password'
                            });
                        } else {
                            res.send({
                                'statusCode': httpCodes.OK,
                                'statusMessage': 'Password Changed'
                            });
                        }
                    });
                } else {
                    res.send({
                        'statusCode': httpCodes.CONFLICT,
                        'statusMessage': 'Password did not matched'
                    });
                }
            })
            .catch(err => {
                res.send({
                    'statusCode': httpCodes.NO_CONTENT,
                    'statusMessage': 'Nothing Found'
                });
            });
    } else {
        res.send({
            'statusCode': httpCodes.CONFLICT,
            'statusMessage': 'No Fields'
        });
    }
}

userCtrl.getNotifications = (req, res) => {
    User.findOne({ _id: req.userObject.data._id }, (err, userData) => {
        if (err) {
            res.send({
                'statusCode': httpCodes.CONFLICT,
                'statusMessage': 'Something fissy with our call back hell server',
                'ERROR': err || 'Any'
            })
        } else {
            res.send({
                'statusCode': httpCodes.OK,
                'statusMessage': 'Got your notifications',
                'notifications': userData.notifications
            })
        }
    })
}

userCtrl.viewNotification = (req, res) => {
    User.updateOne(
        {
            _id: req.userObject.data._id,
            'notifications._id': req.body._id
        },
        {
            $set: { 'notifications.$.viewed': true }
        }
    )
        .then(() => {
            if (req.body.type == "room") {
                Room.findOne({ _id: req.body.roomId }, (err, data) => {
                    if (err) {
                        res.send({
                            err
                        })
                    } else {
                        res.send({
                            'statusCode': httpCodes.OK,
                            'statusMessage': 'Viewing your notification',
                            'room': data
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.send({
                err
            })
        })
}

userCtrl.notifiedNotification = (req, res) => {
    User.updateOne(
        {
            _id: req.userObject.data._id,
            'notifications._id': req.body._id
        },
        {
            $set: { 'notifications.$.notified': true }
        }
    )
        .then(() => {
            if (req.body.type == "room") {
                Room.findOne({ _id: req.body.roomId }, (err, data) => {
                    if (err) {
                        res.send({
                            err
                        })
                    } else {
                        res.send({
                            'statusCode': httpCodes.OK,
                            'statusMessage': 'Viewing your notification',
                            'room': data
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.send({
                err
            })
        })
}


userCtrl.updatePersonalInfo = (req, res) => {
    User.updateOne({ _id: req.userObject.data._id }, { personalDetails: req.body }, (err, raw) => {
        if (err) {
            res.send(
                {
                    'statusCode': httpCodes.CONFLICT,
                    'statusMessage': 'Error updating personal details',
                }
            );
        } else {
            res.send(
                {
                    'statusCode': httpCodes.OK,
                    'statusMessage': 'Updated personal details',
                }
            );
        }
    })
}

userCtrl.getPersonalInfo = (req, res) => {
    User.findOne({
        _id: req.userObject.data._id
    }, (err, data) => {
        if (err) {
            res.send(
                {
                    'statusCode': httpCodes.CONFLICT,
                    'statusMessage': 'Couldnot get your personal details',
                }
            );
        } else {
            res.send(
                {
                    'statusCode': httpCodes.OK,
                    'statusMessage': 'Got your personal details',
                    yourInfo: data.personalDetails
                }
            );
        }
    })
}

module.exports = userCtrl;
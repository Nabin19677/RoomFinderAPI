const mongoose = require('mongoose');

//Models
const Chat = require('../Models/chatSchema');
const Messages = require('../Models/messagesSchema');
const User = require('../Models/userSchema');
const httpCodes = require('http-status-codes');

var chat = {};

// chat.newChat Alternative
chat.newChatMessage = (req, res) => {
    if (!req.body.ownerId) {
        res.send({
            'statusCode': httpCodes.NOT_FOUND,
            'statusMessage': 'No Owner'
        });
    } else {
        User.findOne({ _id: req.body.ownerId })
            .then(
                userData => {
                    Chat.findOne({
                        participants: [req.userObject.data._id, userData._id]
                    }).then(data => {
                        if (data != null) {
                            res.send({
                                conversation: data,
                                recipient: userData
                            });
                        } else {
                            const chat = new Chat({
                                participants: [req.userObject.data._id, userData._id]
                            });
                            chat.save((err, newChat) => {
                                if (err) {
                                    res.send({
                                        err
                                    })
                                } else {
                                    res.send({
                                        conversation: newChat,
                                        recipient: userData
                                    });
                                }
                            })
                        }
                    }).catch(err => {
                        res.send({ err });
                    })
                }
            )
            .catch(err => {
                res.send({
                    err
                })
            })
    }
}

chat.getConversations = (req, res) => {
    Chat.find({
        participants: req.userObject.data._id
    })
        .then(chats => {
            let fullChats = [];
            if (chats.length == 0) { // Check if the person have chats or not
                res.send({
                    fullChats
                });
            }
            chats.forEach((chat) => {
                Messages.find({ 'conversationId': chat._id })
                    .sort('-createdAt')
                    .limit(1)
                    .populate(
                        {
                            path: "recipient",
                            select: "fullname _id phone"
                        }
                    )
                    .populate(
                        {
                            path: "author",
                            select: "fullname _id phone"
                        }
                    )
                    .exec((err, message) => {
                        if (err) {
                            res.send({ err });
                        } else {
                            fullChats.push(message);
                            if (fullChats.length === chats.length) {
                                return res.send({ fullChats });
                            }
                        }
                    });
            });
        })
        .catch(err => {
            res.send({ "error": "Error" });
        })
}

chat.getConversation = (req, res) => {
    Messages.find({ conversationId: req.params.conversationId })
        .sort('createdAt')
        .then(data => {
            res.send({
                data
            })
        })
        .catch(err => {
            res.send({
                err
            })
        })
}

chat.sendReply = (req, res) => {
    const reply = new Messages({
        conversationId: req.body.conversationId,
        body: req.body.message,
        author: req.userObject.data._id,
        recipient: req.body.recipient
    });

    reply.save((err, sentReply) => {
        if (err) {
            res.send({ err });
        } else {
            res.send({
                sentReply
            })
        }
    });
}

//exports

module.exports = chat;
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    personalDetails: {
        typeOfRent: { type: String },
        gender: { type: String },
        food: { type: String },
        smoking: { type: String },
        drinking: { type: String  },
        cleanliness: { type: String }
    },
    notifications: [
        {
            type: { type: String, required: true }, // type room or chat if chat goto conversations if room??
            pusherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            pusherName: { type: String, required: true },
            roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
            chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
            message: { type: String, required: true },
            viewed: { type: Boolean, default: false },
            notified: { type: Boolean, default: false }
        }
    ]
}, {
        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
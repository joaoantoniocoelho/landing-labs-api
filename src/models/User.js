const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAT: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date
    },
    lastPasswordChange: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('User', userSchema);
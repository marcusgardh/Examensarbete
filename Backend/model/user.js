// schema for users

const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaUser = new Schema({
    email: {
        type: String,
        minlength: 2,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});
    

const userModel = mongoose.model('User', schemaUser);

module.exports = userModel;
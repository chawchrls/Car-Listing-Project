const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
    fName:{
        type: String,
        required: true,
    },
    lName:{
        type: String,
        required: true,
    },
    userName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },


})

const Users = mongoose.model('Users', userListSchema);

module.exports = Users;
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    course:{
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    phoneNo: {
        type: Number,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const staff = mongoose.model('staff', staffSchema);
module.exports = staff;
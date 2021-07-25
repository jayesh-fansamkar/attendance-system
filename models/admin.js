const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        enum:['male' , 'female' , 'other']
    },
    phoneNo:{
        type: Number,
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    }
})

const admin = mongoose.model('admin', adminSchema);
module.exports = admin;
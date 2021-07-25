const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    age: {
        type: Number,
        // required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    rollno: {
        type: Number,
        // required: true
    },
    year: {
        type: String,
        // required: true
    },
    division: {
        type: String,
        // required: true
    },
    course: {
        type: String,
        // required: true
    },
    phoneNo: {
        type: Number,
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    attendance: [

        {
            sub: {
                type: String,
                enum: ['SIC' , 'GIS' , 'BI' , 'SQA']
            }, 
            when: Date, 
            status: {
                type: String,
                enum: ['present', 'absent'],
                default: 'absent'
            }},

    ]
})

const student = mongoose.model('student', studentSchema);
module.exports = student;
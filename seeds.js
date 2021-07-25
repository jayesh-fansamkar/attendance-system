// const admin = require('./models/admin')
// const staff = require('./models/staff');
const student = require('./models/student');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/attendancesys', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected");
});



// const seedadmins = [
//     {
//         name: 'jayesh',
//         age: 21,
//         gender: 'male',
//         phoneNo: 8879626268,
//         email: 'jffjayesh@gmail.com',
//         password: '1234'
//     },
//     {
//         name: 'aditi',
//         age: 21,
//         gender: 'female',
//         phoneNo: 8689822504,
//         email: 'singhaditi254@gmail.com',
//         password: '1234'
//     },
//     {
//         name: 'rishi',
//         age: 21,
//         gender: 'male',
//         phoneNo: 9836689123,
//         email: 'rishidubey@gmail.com',
//         password: '1234'
//     }
// ]

// admin.insertMany(seedadmins)
// .then(res => {
//     console.log(res)
// })
// .catch(e => {
//     console.log(e)
// })

// const seedstaff = [
//     {
//         name: 'lorem',
//         age: 21,
//         gender: 'male',
//         course: 'maths',
//         phoneNo: 7896723459,
//         email: 'lorem@gmail.com',
//         password: '1234'
//     },
//     {
//         name: 'ipsum',
//         age: 21,
//         gender: 'female',
//         course: 'web developement',
//         phoneNo: 9783762174,
//         email: 'ipsum@gmail.com',
//         password: '1234'
//     },
//     {
//         name: 'dolor',
//         age: 21,
//         gender: 'male',
//         course: 'project management',
//         phoneNo: 9485712345,
//         email: 'dolor@gmail.com',
//         password: '1234'
//     }
// ]

// staff.insertMany(seedstaff)
//     .then(res => {
//         console.log(res)
//     })
//     .catch(e => {
//         console.log(e)
//     })

const seedstudent = [
    {
        name: 'lorem',
        age: 21,
        gender: 'male',
        rollno: 20655,
        class: 'TY',
        division: 'A',
        course: 'Bsc IT',
        phoneNo: 7896723459,
        email: 'lorem@gmail.com',
        password: '1234'
    },
    {
        name: 'ipsum',
        age: 21,
        gender: 'female',
        rollno: 20670,
        class: 'TY',
        division: 'A',
        course: 'Bsc ITt',
        phoneNo: 9783762174,
        email: 'ipsum@gmail.com',
        password: '1234'
    },
    {
        name: 'dolor',
        age: 21,
        gender: 'male',
        rollno: 20653,
        class: 'TY',
        division: 'A',
        course: 'Bsc IT',
        phoneNo: 9485712345,
        email: 'dolor@gmail.com',
        password: '1234'
    }
]

student.insertMany(seedstudent)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })
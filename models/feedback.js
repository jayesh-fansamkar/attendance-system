const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    inpt: {
        type: String,
        required: true
    },
})

const feedback = mongoose.model('feedback', feedbackSchema);
module.exports = feedback;
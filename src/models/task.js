const mongoose = require('mongoose');
const { Schema} = mongoose;

const Task =  new Schema({
    first_name: String,
    last_name: String,
    participation: Number
});

module.exports = mongoose.model('Task', Task);

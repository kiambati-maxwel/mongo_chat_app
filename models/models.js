const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

// ----- create schema and model

const messageSchema = new Schema({
    name: String,
    message: String
})

const messageModel = mongoose.model('message', messageSchema)

module.exports = messageModel; 



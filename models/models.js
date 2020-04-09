const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

// ----- create schema and model

const marioCharSchema = new Schema({
    name: String,
    weight: Number
});

const marioCharModel = mongoose.model('marioChar', marioCharSchema); 

const messageSchema = new Schema({
    name: String,
    message: String
})

const messageModel = mongoose.model('message', messageSchema)

module.exports = marioCharModel;
module.exports = messageModel; 



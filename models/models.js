const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

// ----- create schema and model

const messageSchema = new Schema({
    name: String,
    message: String
});

// --- modelname = mongoose.model('collectionName', schema name)
const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel; 



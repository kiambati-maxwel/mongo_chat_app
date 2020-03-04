const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dburl = 'mongodb+srv://netbot:mongodb6595@cluster0-khehv.gcp.mongodb.net/essie?retryWrites=true&w=majority'; 
const app  = express();
const message = require('./models/models');


app.use('/api/messages', require('./routes/api/messages'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
});


// set static folder 

app.use(express.static(path.join(__dirname, 'access')));

// --- connect mongoose atlass db
async function connect(){
    await mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
}

connect();

// ----- event listner

mongoose.connection.once('open', () => {

    console.log('connection made to mongodb atlas !');
    
}).on('error', (error) => {res.json(messages);
    console.log('connection error ---> ', error);
})




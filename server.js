const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dburl = 'mongodb+srv://netbot:mongodb6595@cluster0-khehv.gcp.mongodb.net/essie?retryWrites=true&w=majority';
const app = express();
const message = require('./models/models');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


//------ Enable CORS

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});


// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
// });

// --- port 3000 --- if not --- open port

// const PORT = process.env.PORT || 3000 || "0,0,0,0";

server.listen(3000, '0.0.0.0');

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// ----- access api

app.use('/api/messages', require('./routes/api/messages'));


// ------set static folder 

app.use(express.static(path.join(__dirname, 'public')));

// --- connect mongoose atlass db

async function connect() {
    await mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

connect();

// ----- connect to mongo atlas event listner 

mongoose.connection.once('open', () => {

    console.log('connection made to mongodb atlas !');

}).on('error', (error) => {
    res.json(messages);
    console.log('connection error ---> ', error);
});

// ------ socket.io --------- 

io.on('connection', client => {
    console.log(`${client.id} ---- connected`);

    // ---- hundle name prompt input 

    const users = {};
    client.on('new-user', name => {
        users[client.id] = name;
        client.broadcast.emit('user-connected', name);

        // console.log(users) -----test

    });

    // ----- hundle disconnect ----

    client.on('disconnect', () => {
        client.broadcast.emit('user-disconnected', users[client.id]);
        delete users[client.id];
    });


    client.on('emit-chat', message => {
        // console.log(message);
        client.broadcast.emit('emit-chat', message)
    })


    //Someone is typing

    client.on("typing", data => {
        // console.log(data.message);
        client.broadcast.emit("notifyTyping", {
            message: data.message
        });
    });

    //when soemone stops typing

    client.on("stopTyping", () => {
        client.broadcast.emit("notifyStopTyping");
    });


    /*----- leads the last element data from the data base ----*/
    // client.on('last-text', lastText => {
    //     // console.log(lastText) ---- test
    //     client.broadcast.emit('sent-last-text', lastText);
    // });


});
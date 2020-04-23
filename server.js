const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const dburl = 'mongodb+srv://netbot:mongodb6595@cluster0-khehv.gcp.mongodb.net/essie?retryWrites=true&w=majority';
const app = express();
const message = require('./models/models');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./config/dbkeys').mongoURL;
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

// passportconfig
require('./config/passport')(passport);

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');


//------ Enable CORS

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// --- port 3000 --- if not --- open port

const PORT = process.env.PORT || 3000 || "0,0,0,0";

server.listen(PORT);

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));



// ------set static folder 

app.use(express.static(path.join(__dirname, 'public')));

// --- connect mongoose atlass db

async function connect() {
    await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

connect();

// ----- connect to mongo atlas event listner 

mongoose.connection.once('open', () => {

    console.log('connection made to mongodb atlas !');

}).on('error', (error) => {
    
    console.log('connection error ---> ', error);
});

// express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: {secure: true}
}));

// passport middle ware
app.use(passport.initialize());
app.use(passport.session());

// connect flash 
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// ----- access api router API

app.use('/api/messages', require('./routes/api/messages'));
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// ------ socket.io --------- 

io.on('connection', client => {
    console.log(`${client.id} ---- connected`);

    // ---- hundle name prompt input 

    const users = {};
    client.on('new-user', name => {
        name = userName;
        console.log(name);
        client.broadcast.emit('user-connected', name);
    });

    // ----- hundle disconnect ----

    // client.on('disconnect', name => {
    //     name = userName;
    //     client.broadcast.emit('user-disconnected', name);
    // });


    client.on('emit-chat', message => {
        client.broadcast.emit('emit-chat', message);
    });


    //Someone is typing

    client.on("typing", data => {
        client.broadcast.emit("notifyTyping", {
            message: data.message
        });
    });

    //when soemone stops typing

    client.on("stopTyping", () => {
        client.broadcast.emit("notifyStopTyping");
    });


    /*----- leads the last element data from the data base ----*/

    client.on('last-text', lastText => {
        console.log(lastText.message);
        client.broadcast.emit('sent-last-text', lastText);
    });


});

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//     next();
// });
const io = require('socket.io')(3000);
io.on('connection', client => {
    console.log('new user ');

    // client.emit('chat-message', 'hello world !! ')

    const users = {};
    client.on('new-user', name => {
        users[client.id] = name;
        client.broadcast.emit('user-connected', name );
        
    });
 

    client.on('send-chat-message', message => {
        client.broadcast.emit('chat-message', {message: message, name: users[client.id]});

        // console.log('hello max');
    });

    client.on('disconnect', () => {
        client.broadcast.emit('user disconnedcted', users[client.id]);
        delete users[client.id];
    });
    
});


// io.listen(3000);

console.log('server connected');

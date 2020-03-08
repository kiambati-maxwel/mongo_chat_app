const client = io('http://127.0.0.1:3000');

// ---- manipulate the DOM

const messageContainer = document.querySelector('#message-container');
const messageForm = document.querySelector('#send-container');
const messageInput = document.querySelector('#message-input');
const deleteDb = document.querySelector('#delete');
const text_area = document.querySelector('#text-area');


// ----- get name and emit it to all connected sockets

const name = prompt('what is your name ? ');
appendMessage('....welcome..... ')
client.emit('new-user', name);


// ----- log the name to connected sockets
client.on('user-connected', name => {
    window.alert(`${name} connected`);
});

// ---- disconnected 

client.on('user-disconnected', name => {
    window.alert(`${name} --- disconnected`);
})


// ---- function manipulate text area content

function manipText(text) {
    text_area.innerHTML = text;
}
/*----------- get ts data from the db after a get request ---*/

// client.on('sent-last-text', lastText => {
//     console.log(lastText);
//     manipText(lastText.message);
// });


// ---- function append message


function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
};

// ---- display text on the receiver ---
client.on('emit-chat', message => {
    // console.log(message);-----test
    manipText(message);
});




// -------- form event listener
messageForm.addEventListener('submit', e => {
    e.preventDefault();

    const message = messageInput.value;
    client.emit('emit-chat', message);

    // console.log(message);
    const send = {
        name: name,
        message: messageInput.value
    };

    sendMessage(send);

    // console.log(send);------ test
    // getMessages();------test

    messageInput.value = '';

});



// ---- delete event listener

deleteDb.addEventListener('click', () => {
    deletall();
})


// ---- add message to the empty div

function addMessages(message) {

    const newname = document.createElement('h6')
    const newmessage = document.createElement('p')
    messageContainer.appendChild(newname).append(message.name)
    messageContainer.appendChild(newmessage).append(message.message)
}

// --- get request message function

function getMessages() {
    $.get('http://127.0.0.1:3000/api/messages', async (data) => {

        const counter = data.length;

        const lastText = data[counter - 1];
        // console.log(lastText.message);---- test

        // client.emit('last-text', lastText)
        // data.forEach(addMessages);


    });
}

// --------- post request -----

async function sendMessage(message) {
    await $.post('http://localhost:3000/api/messages', message)
}

// ------- delete request -----

function deletall() {
    $.ajax({
        method: 'DELETE',
        url: 'http://localhost:3000/api/messages',
        success: function () {
            console.log('success');
        },
        error: function () {
            console.log('error');

        }
    })
}
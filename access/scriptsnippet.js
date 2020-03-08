const client = io();
// ServiceWorkerRegistration.listen(4000);

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// --------chat-message is the event name name

const name = prompt('what is your name ? ');
appendMessage('you joined ... ');
client.emit('new-user', name);



client.on('user-connected', name => {
    appendMessage(`${name} connected`);
   
});


client.on('chat-message', data => {
    appendMessage(`${data.name} --- ${data.message}`);
    console.log(data.message);
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`me --- ${message}`);
    sendMessage(message);
    getMessage();
    client.emit('send-chat-message', message);
    messageInput.value = '';

});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
};

function sendMessage(message) {
    console.log(message);
    $.post('http://localhost:4000/api/messages', message)
}

function getMessage() {
    $.get('http://localhost:4000/api/messages');

}
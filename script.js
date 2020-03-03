const client =  io('http://localhost:3000');

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// --------chat-message is the event name name

const name = prompt('what is your name ? ');
appendMessage('you joined ... ');
client.emit('new-user', name);
 
client.on('chat-message', data => {
    appendMessage(`${data.name} --- ${data.message}`);
});

client.on('user-connected',  name => {
    appendMessage(`${name} connected`);
});

messageForm.addEventListener('submit', e =>{
e.preventDefault();
const message = messageInput.value;
appendMessage(`me --- ${message}`);
client.emit('send-chat-message', message);
messageInput.value = '';

});

function appendMessage(message){
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
};
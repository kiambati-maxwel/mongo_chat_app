const client = io();
// ------ alert timeout 2seconds---

window.onload = setTimeout(function () {
    alert('This is an alert');
    window.location = 'http://localhost:3000';
}, 5000);


// ---- manipulate the DOM

const messageContainer = document.querySelector('#message-container');
const messageForm = document.querySelector('#send-container');
const messageInput = document.querySelector('#message-input');
const deleteDb = document.querySelector('#delete');
const text_area = document.querySelector('#text-area');
const isTyping = document.querySelector('#isTyping');
const previous = document.querySelector('#previous-text');
const next = document.querySelector('#next-text');


// ----- get name and emit it to all connected sockets

const name = prompt('what is your name ? ');
client.emit('new-user', name);


// ----- log the name to connected sockets
client.on('user-connected', name => {
    setTimeout(() => {
        window.alert(`${name} connected`);
    }, 1000);
});


// ---- disconnected 

client.on('user-disconnected', name => {
    window.alert(`${name} --- disconnected`);
});


//----isTyping event

messageInput.addEventListener("keypress", () => {
    client.emit("typing", {
        message: "typing....."
    });

});

client.on("notifyTyping", data => {
    isTyping.innerText = data.message;
    console.log(data.message);
});

//-----stop typing
messageInput.addEventListener("keyup", () => {
    client.emit("stopTyping", "");
});

messageInput.addEventListener("keyup", () => {
    client.emit("stopTyping", "");
});

client.on("notifyStopTyping", () => {
    isTyping.innerText = "";

});


// ---- function manipulate text area content

function manipText(text) {
    text_area.innerHTML = text;
};

/*----------- get ts data from the db after a get request ---*/

client.on('sent-last-text', lastText => {
    console.log(lastText);
    manipText(lastText.message);
});


// ---- display text on the receiver ---

client.on('emit-chat', message => {
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

    getMessages();

    messageInput.value = '';

});




// ---- delete event listener

deleteDb.addEventListener('click', () => {
    deletall();
    window.alert('data base ducuments deleted!!!');
});


// ---- add message to the empty div

function addMessages(message) {

    const newname = document.createElement('h6');
    const newmessage = document.createElement('p');
    messageContainer.appendChild(newname).append(message.name);
    messageContainer.appendChild(newmessage).append(message.message);
};

var counter = 0;
var dataOf = [];
var lastText;

// ---------------------------------
async function geet() {
    await getMessages();
}

geet();

// --- previous text even listener 

previous.addEventListener('submit', e => {
    e.preventDefault();
    lastText = dataOf[counter - 1];
    manipText(lastText.message);
    console.log(lastText.message);
    console.log(counter);
    counter = counter - 1;
    console.log(counter);
});

// --- next text event listener
next.addEventListener('submit', e => {
    e.preventDefault();
    lastText = dataOf[counter + 1];
    manipText(lastText.message);
    counter = counter + 1;
})

// --- get request message function

function getMessages() {
    $.get('http://0.0.0.0:3000/api/messages', async (data) => {

        counter = data.length;
        data.forEach(element => {
            dataOf.push(element);
        });

        console.log(dataOf);
        console.log(counter);
    });
};

// --------- post request -----

async function sendMessage(message) {
    await $.post('http://0.0.0.0:3000/api/messages', message);
};

// ------- delete request -----

function deletall() {
    $.ajax({
        method: 'DELETE',
        url: 'http://0.0.0.0:3000/api/messages',
        contentType: 'application/json',
        success: function () {
            console.log('success');
        },
        error: function () {
            console.log('error');

        }
    });
};
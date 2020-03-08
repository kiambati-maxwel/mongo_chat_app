const client = io('http://127.0.0.1:3000');

    // ---- manipulate the DOM

    const messageContainer = document.querySelector('#message-container');
    const messageForm = document.querySelector('#send-container');
    const messageInput = document.querySelector('#message-input');
    const deleteDb = document.querySelector('#delete');
    const text_area = document.querySelector('#text-area');


    // ----- get name and emit it to all connected sockets

    const name = prompt('what is your name ? ');
    appendMessage('......... ')
    client.emit('new-user', name);


    // ----- log the name to connected sockets
    client.on('user-connected', name => {
        appendMessage(`${name} connected`);
    });

    // ---- disconnected 

    client.on('user-disconnected', name => {
        appendMessage(`${name} --- disconnected`);
    })

    // ----- hundle last text
    // ---- function manipulate text area content

    function manipText(text) {
        text_area.innerText = text;
    }

    client.on('sent-last-text', lastText => {
        console.log(lastText);
        manipText(lastText.message);
    });


    // ---- function append message


    function appendMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageContainer.append(messageElement);
    };




    // -------- form event listener
    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const message = messageInput.value;
        appendMessage(`me --- ${message}`);
        const send = {
            name: name,
            message: messageInput.value
        };
        sendMessage(send);

        // console.log(send);

        getMessages();
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
            console.log(lastText.message);
            client.emit('last-text', lastText)


            // data.forEach(addMessages);
            // const emptyArray = data;
            // console.log(emptyArray);
            // const counter = emptyArray.length;
            // console.log(counter);
            // console.log(emptyArray[counter].message);


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
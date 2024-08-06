document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const chatContainer = document.getElementById('chat-container');
    const chat = document.getElementById('chat');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const usernameInput = document.getElementById('usernameInput');
    const loginButton = document.getElementById('loginButton');

    let username = '';
    const ws = new WebSocket('wss://localhost:8443');

    ws.onopen = () => {
        console.log('WebSocket connection opened');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        const { user, text } = JSON.parse(event.data);
        const message = document.createElement('div');
        message.classList.add('message', user === username ? 'user1' : 'user2');
        message.textContent = `${user}: ${text}`;
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;
    };

    loginButton.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username !== '') {
            loginContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
        }
    });

    sendButton.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text !== '') {
            const message = { user: username, text };
            ws.send(JSON.stringify(message));
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});

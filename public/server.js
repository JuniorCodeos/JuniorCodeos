const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');
const app = express();

const options = {
    key: fs.readFileSync('path/to/your/privkey.pem'),
    cert: fs.readFileSync('path/to/your/fullchain.pem')
};

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for root requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = https.createServer(options, app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', message => {
        // Broadcast message to all clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

server.listen(8443, () => {
    console.log('Server is running on https://localhost:8443');
});

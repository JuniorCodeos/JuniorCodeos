const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Защита заголовками безопасности
app.use(helmet());

// Ограничение частоты запросов
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // ограничение до 100 запросов
    message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Загрузка SSL-сертификата
const serverOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const server = https.createServer(serverOptions, app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });
});

app.use(express.static('public'));

server.listen(8443, () => {
    console.log('Server is listening on port 8443');
});

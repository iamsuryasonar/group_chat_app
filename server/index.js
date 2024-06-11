
const app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const PORT = 8080;

app.get('/', function (req, res) {
    res.send('hello world');
});

let messages = [];

io.on('connection', function (socket) {
    socket.emit('all_messages', messages);
    socket.on('message', (message) => {
        messages.push(message)
        io.emit('message', message);
    });
})



server.listen(PORT, function () {
    console.log('Listening to port ' + PORT);
})

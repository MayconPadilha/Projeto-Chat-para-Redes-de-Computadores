const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const users = new Array();

class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let connectedUsers = 0;

io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  let currentUser = null;

  socket.on('message', (data) => {
    if (currentUser == null) {
      currentUser = new User(socket.id, data.userName);
      users.push(currentUser)
      io.emit('updateActiveUsers', users);
      const enterMessage = `${currentUser.name} entrou no chat.`;
      io.emit('message', { userName: 'Servidor', message: enterMessage });
      io.emit('userCount', users.length);
      console.log('connectedUsers:', users.length);
    } else {
      const formattedMessage = `${data.message}`;
      io.emit('message', { userName: currentUser.name, message: formattedMessage });
    }
  });

  socket.on('disconnect', () => {
    if (currentUser && currentUser.name !== 'Servidor') {
      const index = users.findIndex(user => user.id === socket.id);
      users.splice(index, 1);
      const exitMessage = `${currentUser.name} saiu do chat.`;
      io.emit('message', { userName: 'Servidor', message: exitMessage });
    }
    io.emit('updateActiveUsers', users);
    io.emit('userCount', users.length);
    console.log('connectedUsers:', users.length);

    console.log('Cliente desconectado:', socket.id);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});

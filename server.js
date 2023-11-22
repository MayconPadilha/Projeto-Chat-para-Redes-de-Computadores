const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let connectedUsers = 0;

io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  let userName = '';

  socket.on('message', (data) => {
    if (!userName) {
      userName = data.userName;
      if (userName !== 'Servidor') {
          const enterMessage = `${userName} entrou no chat.`;
          io.emit('message', { userName: 'Servidor', message: enterMessage });
      }

      // Incrementa o contador de usuários conectados
      connectedUsers++;
      io.emit('userCount', connectedUsers);
      console.log('connectedUsers:', connectedUsers);
      
    } else {
      const formattedMessage = `[${data.userName}] ${data.message}`;
      io.emit('message', { userName, message: formattedMessage });
    }
  });

  socket.on('disconnect', () => {
    if (userName && userName !== 'Servidor') {
      const exitMessage = `${userName} saiu do chat.`;
      io.emit('message', { userName: 'Servidor', message: exitMessage });
          }

    // Decrementa o contador de usuários conectados
    connectedUsers--;
    io.emit('userCount', connectedUsers);
    console.log('connectedUsers:', connectedUsers);

    console.log('Cliente desconectado:', socket.id);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});

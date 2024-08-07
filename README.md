# Chat Application

Este projeto foi desenvolvido como parte da cadeira de Redes do IFRS com o propósito de aprendizado sobre multitarefas e o conceito de threads. É uma aplicação de chat em tempo real que utiliza Node.js, Express, e Socket.IO para comunicação entre cliente e servidor. A aplicação permite que múltiplos usuários se conectem ao servidor de chat, enviem mensagens e vejam as mensagens de outros usuários em tempo real.

## Estrutura do Projeto

O projeto é composto por dois arquivos principais:

- `cliente.js`: O script do cliente que se conecta ao servidor de chat.
- `server.js`: O script do servidor que gerencia as conexões dos clientes e a troca de mensagens.

## cliente.js

Este arquivo contém o código que permite que um cliente se conecte ao servidor de chat. Utiliza o módulo `net` do Node.js para estabelecer a conexão.

### Funcionalidades

- **Conectar ao Servidor**: Conecta ao servidor de chat no host e porta especificados.
- **Receber Dados**: Recebe mensagens do servidor e as exibe no console.
- **Enviar Mensagens**: Lê a entrada do console do usuário e envia para o servidor.
- **Desconectar**: Lida com a desconexão do servidor.
- **Erros de Conexão**: Lida com erros de conexão e exibe mensagens de erro no console.

```javascript
const net = require('net');

// Conectar ao servidor de chat
const client = net.createConnection({ port: 3000, host: 'IP DO HOST AQUI' }, () => {
  console.log('Conectado ao servidor de chat');

  // Lidar com dados recebidos do servidor
  client.on('data', (data) => {
    console.log(data.toString());
  });

  // Ler entrada do console e enviar para o servidor
  process.stdin.on('data', (input) => {
    client.write(input);
  });

  // Lidar com a desconexão do servidor
  client.on('end', () => {
    console.log('Desconectado do servidor de chat');
  });
});

// Lidar com erros de conexão
client.on('error', (error) => {
  console.error(`Erro de conexão: ${error.message}`);
});
```

## server.js

Este arquivo contém o código do servidor que gerencia a aplicação de chat. Utiliza Express para servir arquivos estáticos e Socket.IO para a comunicação em tempo real.

### Funcionalidades

- **Gerenciamento de Conexões**: Aceita novas conexões de clientes e desconexões.
- **Gerenciamento de Usuários**: Cria instâncias de usuários e mantém uma lista de usuários conectados.
- **Transmissão de Mensagens**: Recebe mensagens dos clientes e as retransmite para todos os clientes conectados.
- **Notificações de Entrada e Saída**: Informa todos os clientes quando um usuário entra ou sai do chat.
- **Contagem de Usuários**: Mantém e atualiza a contagem de usuários conectados.

```javascript
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
```

## Como Executar

### Requisitos

- Node.js
- npm (Node Package Manager)

### Passos

1. Clone o repositório para o seu ambiente local.
2. Navegue até o diretório do projeto.
3. Instale as dependências necessárias executando `npm install`.
4. Inicie o servidor executando `node server.js`.
5. Em um terminal separado, execute `node cliente.js` para conectar-se ao servidor de chat.
6. Acesse ao `http://localhost:3000/` em seu navegador.

### Observações

- Substitua `'IP DO HOST AQUI'` no arquivo `cliente.js` pelo endereço IP do servidor onde o `server.js` está em execução.
- O servidor serve arquivos estáticos do diretório `public`, portanto, certifique-se de que o diretório `public` existe e contém os arquivos necessários.

## Imagens do Chat

Tela inicial
![image](https://github.com/user-attachments/assets/ef76ebf9-8266-42e4-81ef-f5b0c6ae8e0c)

Entrada do chat
![image-1](https://github.com/user-attachments/assets/bcdf61b6-1cc3-4d24-84e5-1c261e2098d0)

Conversa
![image-2](https://github.com/user-attachments/assets/17e1cf11-4de0-47d7-a6cf-55358b5f9fb3)

Saida do chat
![image-3](https://github.com/user-attachments/assets/ea339ad1-8613-48ab-802e-88385e021c3c)

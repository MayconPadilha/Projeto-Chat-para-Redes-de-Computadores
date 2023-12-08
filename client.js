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

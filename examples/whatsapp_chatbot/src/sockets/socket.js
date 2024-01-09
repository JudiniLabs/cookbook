const socketIO = require('socket.io');
const { instanciasBot } = require('../utils');
const {updateDataInFile} = require('../repositories/json-repository');
const nameChatbot = process.env.NAME_CHATBOT;
const CodeGPTApi = require("../services/code-gpt-api");
const { getAgents } = require('./socketControllers/getAgents');
const { verifyKey } = require('./socketControllers/verifyKey');
let ioPromise; // Declarar una promesa para la instancia io

/**
 * Configura el socket para el servidor.
 * @param {http.Server} server - El servidor HTTP al que se asocia Socket.IO.
 */
const configureSocket = async (server) => {
  // Crear una instancia de Socket.IO asociada al servidor
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    let instancia = instanciasBot[nameChatbot];
    console.log(instancia.botNumber)

    socket.emit('qr', instancia.qr)
    socket.emit('socketData', {
      number : instancia.botNumber?.replace("@s.whatsapp.net", "") || false,
      apiKey : instancia.apiKey,
      agent : instancia.agent
    });

    // Escuchar un evento 'enviarDatos' desde el cliente
    socket.on('enviarDatos', async (data) => {
    console.log('Datos recibidos del cliente:', data);
  
  if (data.apiKey) {
   
      let response = await verifyKey(data.apiKey);
      if (response) {
      socket.emit('socketData', {apiKey : response});
      return;
      }
    
    instancia.apiKey = data.apiKey;

  }
  if (data.agent) instancia.agent = data.agent;
  updateDataInFile(data.apiKey,data.agent)

  socket.emit('socketData', {
    number: instancia.botNumber.replace("@s.whatsapp.net", ""),
    apiKey: data.apiKey ?? instancia.apiKey,
    agent: data.agent ?? instancia.agent
  });
});

    socket.on('requestAgents', async(data) => {
     let agents = await getAgents()
     console.log(agents)
     socket.emit("agents", agents)
    })
  });
  ioPromise = Promise.resolve(io);
};



module.exports = {
  configureSocket,
  getIO: () => ioPromise, // Exporta una función para obtener la instancia io
};
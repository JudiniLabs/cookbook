const { downloadMediaMessage } = require ('@whiskeysockets/baileys')
const path = require('path');
const fs = require("fs");
const { commands } = require('./commands');
const { completion } = require('./send-to-ia');
const { writeFile } = require('fs').promises;


const sendDocument = async (msg,client,lastMessage,agent) => {
try {
   
    const fileName = msg.msg.message.documentMessage.fileName || "";
    // Descarga el documento
    const buffer = await downloadMediaMessage(
        lastMessage,
        'buffer',
        {},
        {
            reuploadRequest: client.updateMediaMessage,
        }
    );
    
    // Ruta donde se guardará el documento
    const filePath = path.join(__dirname, '../../', 'Data', 'Documents', fileName);

    // Verifica si la carpeta existe, y créala si no
    const folderPath = path.dirname(filePath);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Guarda el documento en un archivo local con el nombre extraído
    await writeFile(filePath, buffer);

    const command = msg.msg.message.documentMessage.caption;
    const comandoMatch = command.match(/\/(\w+)/);
    if (comandoMatch) {
        let response = await commands(fileName, comandoMatch,agent)
        return response
    }
    return "invalid command"
} catch (error) {
    throw new Error('Error downloading or saving document:', error.message);
}
}

const sendMessage = async (msg,agentId) => {
    try {
        

    const comandoMatch = msg.text.match(/\/(\w+)/);
        let response = false
            if (comandoMatch) response = await commands(msg,comandoMatch,agentId)
              // si no es comando Enviamos el mensaje anidado a la IA
            if (!response) response = await completion(msg,agentId)
        return response
    }catch(error){
        console.log("error", error.message)
        return error.message
}
}

module.exports = {
    sendDocument,
    sendMessage
}
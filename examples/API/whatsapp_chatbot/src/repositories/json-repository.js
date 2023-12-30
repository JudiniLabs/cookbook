const fs = require("fs");
const path = require('path');


/**
 * Updates the chat memory with the user's message.
 *
 * @param {string} sender - The unique identifier of the message sender.
 * @param {object} message - The message object containing role and content.
 * @param {string} nameChatbot - The name or identifier of the chatbot.
 */
const updateChatMemory = async (sender, message, nameChatbot) => {
  
    try {
      let chatHistory = await readChatMemoryFromFile(nameChatbot);
  
      
      if (!chatHistory[sender]) {
        chatHistory[sender] = [];
      }
  
      chatHistory[sender].push(message);
  
      if (chatHistory[sender].length > 30) {
        chatHistory[sender].shift();
      }
  
      const chatHistoryJSON = JSON.stringify(chatHistory, null, 2);
  
      const filePath = path.join(__dirname, '../../', 'Data', 'Memory', `${nameChatbot}.json`);
  
      // Verifica si el archivo existe
      if (!fs.existsSync(filePath)) {
        // Si no existe, crea la carpeta y el archivo
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, '{}', 'utf-8');
      }
  
      fs.writeFileSync(filePath, chatHistoryJSON, "utf-8");
    } catch (error) {
      console.error("An error occurred in execute:", error);
    }
  };
  
  /**
   * Reads chat memory from a file based on the chatbot's name.
   *
   * @param {string} nameChatbot - The name or identifier of the chatbot.
   * @returns {object} - The chat memory object.
   */
  const readChatMemoryFromFile = async (nameChatbot) => {
    try {
      const data = fs.readFileSync(
        path.join(__dirname, '../../', 'Data', 'Memory', `${nameChatbot}.json`),
        'utf-8'
      );
      
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  };

  const updateJsonAgents = async (sender, agentId, nameChatbot) => {
    try {
      const agentsFolderPath = path.join(__dirname, '../../', 'Data', 'Agents');
      const agentsFilePath = path.join(agentsFolderPath, `${nameChatbot}.json`);
  
      // Check if the Agents folder exists, create it if not
      if (!fs.existsSync(agentsFolderPath)) {
        fs.mkdirSync(agentsFolderPath, { recursive: true });
      }
  
      // Check if the Agents JSON file exists, create it if not
      if (!fs.existsSync(agentsFilePath)) {
        fs.writeFileSync(agentsFilePath, '{}', 'utf-8');
      }
  
      let agents = await readJsonAgents(nameChatbot);
  
      agents[sender] = agentId;
  
      fs.writeFileSync(agentsFilePath, JSON.stringify(agents), 'utf-8');
    } catch (error) {
      console.error("An error occurred in execute:", error);
    }
  };
  /**
   * Reads the JSON file containing agent associations based on the chatbot's name.
   *
   * @param {string} nameChatbot - The name or identifier of the chatbot.
   * @returns {object} - The object containing user-agent associations.
   */
  const readJsonAgents = async (nameChatbot) => {
    try {
     
      const data = fs.readFileSync(
        `Data/Agents/${nameChatbot}.json`,
        "utf-8"
      );
  
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  };

  const readJsonAgentsByNumber = async (nameChatbot, number) => {
    try {
  
        const data = fs.readFileSync(
            `Data/Agents/${nameChatbot}.json`,
            "utf-8"
        );
       
        return JSON.parse(data)[number];
    } catch (err) {
        return null;
    }
};

  
module.exports = {
    updateChatMemory,
    readChatMemoryFromFile,
    updateJsonAgents,
    readJsonAgents,
    readJsonAgentsByNumber
  };
  
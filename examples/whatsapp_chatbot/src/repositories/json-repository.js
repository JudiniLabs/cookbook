const fs = require("fs");
const path = require('path');


/**
 * Updates the chat memory with the user's message.
 *
 * @param {string} sender - The unique identifier of the message sender.
 * @param {object} message - The message object containing role and content.
 * @param {string} apiKey - The name or identifier of the chatbot.
 */
const updateChatMemory = async (sender, message, apiKey) => {
  
    try {
      let chatHistory = await readChatMemoryFromFile(apiKey);
  
      
      if (!chatHistory[sender]) {
        chatHistory[sender] = [];
      }
  
      chatHistory[sender].push(message);
  
      if (chatHistory[sender].length > 30) {
        chatHistory[sender].shift();
      }
  
      const chatHistoryJSON = JSON.stringify(chatHistory, null, 2);
  
      const filePath = path.join(__dirname, '../../', 'Data', 'Memory', `${apiKey}.json`);
  
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
   * @param {string} apiKey - The name or identifier of the chatbot.
   * @returns {object} - The chat memory object.
   */
  const readChatMemoryFromFile = async (apiKey) => {
    try {
      const data = fs.readFileSync(
        path.join(__dirname, '../../', 'Data', 'Memory', `${apiKey}.json`),
        'utf-8'
      );
      
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  };

  const updateJsonAgents = async (sender, agentId, apiKey) => {
    try {
      const agentsFolderPath = path.join(__dirname, '../../', 'Data', 'Agents');
      const agentsFilePath = path.join(agentsFolderPath, `${apiKey}.json`);
  
      // Check if the Agents folder exists, create it if not
      if (!fs.existsSync(agentsFolderPath)) {
        fs.mkdirSync(agentsFolderPath, { recursive: true });
      }
  
      // Check if the Agents JSON file exists, create it if not
      if (!fs.existsSync(agentsFilePath)) {
        fs.writeFileSync(agentsFilePath, '{}', 'utf-8');
      }
  
      let agents = await readJsonAgents(apiKey);
  
      agents[sender] = agentId;
  
      fs.writeFileSync(agentsFilePath, JSON.stringify(agents), 'utf-8');
    } catch (error) {
      console.error("An error occurred in execute:", error);
    }
  };
  /**
   * Reads the JSON file containing agent associations based on the chatbot's name.
   *
   * @param {string} apiKey - The name or identifier of the chatbot.
   * @returns {object} - The object containing user-agent associations.
   */
  const readJsonAgents = async (apiKey) => {
    try {
     
      const data = fs.readFileSync(
        `Data/Agents/${apiKey}.json`,
        "utf-8"
      );
  
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  };

  const readJsonAgentsByNumber = async (apiKey, number) => {
    try {
  
        const data = fs.readFileSync(
            `Data/Agents/${apiKey}.json`,
            "utf-8"
        );
       
        return JSON.parse(data)[number];
    } catch (err) {
        return null;
    }
};

  

const readApiKeyFromFile = async () => {
  try {
    const filePath = path.join(__dirname, '../../', 'Data', 'codeGPT-apiKey.json');
    if (!fs.existsSync(filePath)) {
      return false;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data).key;
  } catch (err) {
    return false;
  }
};

const readAgentFromFile = async () => {
  try {
    const filePath = path.join(__dirname, '../../', 'Data', 'codeGPT-apiKey.json');
    if (!fs.existsSync(filePath)) {
      return false;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data).agent;
  } catch (err) {
    return false;
  }
};

/**
 * Updates the apiKey in the file.
 *
 * @param {{string}} key - The new apiKey.
 */
const updateDataInFile = async (key, agent) => {{
  try {{
    console.log("Entró", key, agent)
    const filePath = path.join(__dirname, '../../', 'Data', 'codeGPT-apiKey.json');

    // Check if the file exists, create it if not
    if (!fs.existsSync(filePath)) {{
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, '{}', 'utf-8');
    }}

    // Read the existing file
    const data = fs.readFileSync(filePath, 'utf-8');
    const dataObject = JSON.parse(data);

    // Update the apiKey and agent if they are provided
    if (key) {
      dataObject.key = key;
    }
    if (agent) {
      dataObject.agent = agent;
    }

    // Write the updated object back to the file
    fs.writeFileSync(filePath, JSON.stringify(dataObject, null, 2), "utf-8");
  }} catch (error) {{
    console.error("An error occurred in execute:", error);
  }}
}};


module.exports = {
  updateChatMemory,
  readChatMemoryFromFile,
  updateJsonAgents,
  readJsonAgents,
  readJsonAgentsByNumber,
  readApiKeyFromFile,
  readAgentFromFile,
  updateDataInFile
};
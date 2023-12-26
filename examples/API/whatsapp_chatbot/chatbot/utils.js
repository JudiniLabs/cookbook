const fs = require("fs");

/**
 * Updates the chat memory with the user's message.
 *
 * @param {string} sender - The unique identifier of the message sender.
 * @param {object} message - The message object containing role and content.
 * @param {string} nameChatbot - The name or identifier of the chatbot.
 */
const updateChatMemory = async (sender, message, nameChatbot) => {
  console.log("updateChat", sender, message, nameChatbot);
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

    console.log(nameChatbot);

    fs.writeFileSync(
      `Data/Memory/${nameChatbot}.json`,
      chatHistoryJSON,
      "utf-8"
    );
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
      `Data/Memory/${nameChatbot}.json`,
      "utf-8"
    );
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
};

/**
 * Extracts the value associated with a key from the given text using a regular expression.
 *
 * @param {string} text - The text containing key-value pairs.
 * @param {string} key - The key to search for.
 * @returns {string|null} - The value associated with the key or null if not found.
 */
function extractValueByKey(text, key) {
  const regex = new RegExp(`${key}\\s*:\\s*([^,\\s]+)`);
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Extracts agent properties from the given text using a regular expression.
 *
 * @param {string} text - The text containing key-value pairs representing agent properties.
 * @returns {object|null} - An object containing agent properties or null if not found.
 */
const extractAgentProperties = (text) => {
  try {
    const properties = text.match(/(\w+)\s*:\s*("([^"]*)"|([^,]*))/g);
    if (!properties) {
      return null;
    }

    const agentProperties = {};
    properties.forEach(property => {
      const [keyWithQuotes, valueWithQuotes] = property.split(/\s*:\s*/);
      const key = keyWithQuotes.replace(/"/g, '');
      const cleanedValue = valueWithQuotes.replace(/^"(.*)"$/, '$1');

      if (['temperature', 'topk', 'maxTokens'].includes(key)) {
        const numericValue = parseFloat(cleanedValue);

        if (isNaN(numericValue)) {
          throw new Error(`Invalid value for ${key}. Must be a number.`);
        }

        if (key === 'temperature' && (numericValue < 0 || numericValue > 1)) {
          throw new Error(`Invalid value for ${key}. Must be between 0 and 1.`);
        }

        agentProperties[key] = numericValue;
      } else {
        agentProperties[key] = cleanedValue;
      }
    });

    return agentProperties;
  } catch (error) {
    throw new Error(`Error extracting agent properties: ${error.message}`);
  }
};

/**
 * Updates the JSON file containing agent associations with a new agent for the user.
 *
 * @param {string} sender - The unique identifier of the message sender.
 * @param {string} agentId - The identifier of the agent to be associated with the user.
 * @param {string} nameChatbot - The name or identifier of the chatbot.
 */
const updateJsonAgents = async (sender, agentId, nameChatbot) => {
  try {
    let agents = await readJsonAgents(nameChatbot);

    agents[sender] = agentId;
    console.log("agents", agents);

    fs.writeFileSync(
      `Data/Agents/${nameChatbot}.json`,
      JSON.stringify(agents),
      "utf-8"
    );
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
    console.log("data", JSON.parse(data));
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
};

module.exports = {
  updateChatMemory,
  readChatMemoryFromFile,
  extractValueByKey,
  extractAgentProperties,
  updateJsonAgents,
  readJsonAgents,
};

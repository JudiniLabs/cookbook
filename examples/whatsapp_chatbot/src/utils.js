const fs = require("fs");
const path = require('path');
const { readJsonAgents, updateJsonAgents, readApiKeyFromFile } = require("./repositories/json-repository");


let instanciasBot = {};

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

const instanceCreation = async (chatbotId) => {
  try {
    let instancia = instanciasBot[chatbotId];

    console.log("dentro de instancia",chatbotId)
    let apiKey = readApiKeyFromFile()
    let agent = 
    instancia.apiKey = apiKey
    instancia.agent = agent

    return `bot ${chatbotId} creado`;
  } catch (error) {
    console.error('Error en creationBot:', error,chatbotId);
    throw error;
  }
}

module.exports = {
  extractValueByKey,
  extractAgentProperties,
  instanciasBot,
  instanceCreation
};

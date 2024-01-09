
const CodeGPTApi = require("../services/code-gpt-api");
const { readChatMemoryFromFile, updateChatMemory, readJsonAgents } = require("../repositories/json-repository");
const { noAgent } = require("./commands");
const { instanciasBot } = require("../utils");
const nameChatbot = process.env.NAME_CHATBOT;
const generalUrl = process.env.GENERAL_URL_API;

let codeGPTApi;

function getCodeGPTApi() {
  if (!codeGPTApi) {
    let instancia = instanciasBot[nameChatbot];
    let apiKey = instancia.apiKey;
    codeGPTApi = new CodeGPTApi(generalUrl, apiKey);
  }
  return codeGPTApi;
}

/**
 * Handles message completion by interacting with the GPT API.
 *
 * @param {object} message - The user's message object containing sender information and text content.
 * @returns {Promise<object|string>} - Returns the assistant's response or an error object.
 */
const completion = async (message,agentId) => {
    try {
       
        let instancia = instanciasBot[nameChatbot];
        let apiKey = instancia.apiKey;
        console.log("apikey on getcodeGPT", apiKey) 

        const chatHistory = await readChatMemoryFromFile(apiKey);
    
        const number = message.sender.split("@")[0];

        
        if (!agentId) {
            let agents = await readJsonAgents(apiKey);
            agentId = agents[number];
            
            // Check again after attempting to retrieve from agents
            if (!agentId) {
                return await noAgent();
            }
        }

        // Update chat memory with the user's message
        updateChatMemory(number, { role: "user", content: message.text }, apiKey);

        // Create an array of messages from the chat history
        let messages =
            chatHistory[number]?.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })) || [];

        // Add the user's new message to the array
        messages.push({
            role: "user",
            content: message.text,
        });
        console.log("MEssages on controller", messages)
        // Build the payload for the GPT API request
        const response = await getCodeGPTApi().completion(agentId,messages)

        // Log the API response for debugging purposes
        console.log("response", response);

        // Process the API response and update chat memory with the assistant's message
        const data = await response
        const text = data.replace(/^data: /, "");
        updateChatMemory(number, { role: "assistant", content: text }, apiKey);

      
        return text;
    } catch (error) {
        // Handle and log any errors that occur during the process
        console.error("Error:", error);
        return  error.message ;
    }
};


module.exports = {
    completion
};
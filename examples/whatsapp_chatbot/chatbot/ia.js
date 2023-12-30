
const CodeGPTApi = require("../services/code-gpt-api");
const { readChatMemoryFromFile, updateChatMemory, readJsonAgents } = require("../repositories/json-repository");
const { noAgent } = require("./commands");
const nameChatbot = process.env.CODEGPT_API_KEY;
const generalUrl = process.env.GENERAL_URL_API;


const codeGPTApi = new CodeGPTApi(generalUrl, nameChatbot);

/**
 * Handles message completion by interacting with the GPT API.
 *
 * @param {object} message - The user's message object containing sender information and text content.
 * @returns {Promise<object|string>} - Returns the assistant's response or an error object.
 */
const completion = async (message,agentId) => {
    try {
       
        // Retrieve chat history and user number
        const chatHistory = await readChatMemoryFromFile(nameChatbot);
    
        const number = message.sender.split("@")[0];

        
        if (!agentId) {
            let agents = await readJsonAgents(nameChatbot);
            agentId = agents[number];
            
            // Check again after attempting to retrieve from agents
            if (!agentId) {
                return await noAgent();
            }
        }

        // Update chat memory with the user's message
        updateChatMemory(number, { role: "user", content: message.text }, nameChatbot);

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

        // Build the payload for the GPT API request
        const response = await codeGPTApi.completion(agentId,messages)

        // Log the API response for debugging purposes
        console.log("response", response);

        // Process the API response and update chat memory with the assistant's message
        const data = await response
        const text = data.replace(/^data: /, "");
        updateChatMemory(number, { role: "assistant", content: text }, nameChatbot);

      
        return text;
    } catch (error) {
        // Handle and log any errors that occur during the process
        console.error("Error:", error);
        return { error: error.message };
    }
};


module.exports = {
    completion
};
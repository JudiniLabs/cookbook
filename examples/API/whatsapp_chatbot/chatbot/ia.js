const { noAgent } = require("./apiCalling");
const { readChatMemoryFromFile, updateChatMemory, readJsonAgents } = require("./utils");
const nameChatbot = process.env.CODE_GPT_API_KEY;

const generalUrl = process.env.GENERAL_URL_API;

const headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": `Bearer ${process.env.CODE_GPT_API_KEY}`
};

/**
 * Handles message completion by interacting with the GPT API.
 *
 * @param {object} message - The user's message object containing sender information and text content.
 * @returns {Promise<object|string>} - Returns the assistant's response or an error object.
 */
const completion = async (message) => {
    try {
        // Retrieve chat history and user number
        const chatHistory = await readChatMemoryFromFile(nameChatbot);
        console.log("chatHistory", chatHistory)
        const number = message.sender.split("@")[0];

        // Retrieve agent information based on user number
        let agents = await readJsonAgents(nameChatbot);
        let agent = agents[number];


        // Check if the user has an assigned agent
        if (!agent) {
            return await noAgent();
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
        const url = `${generalUrl}${"/completion"}`;
        const payload = {
            agent: agent,
            messages: messages,
            stream: false,
        };

        // Log the payload for debugging purposes
        console.log("payload", JSON.stringify(payload));

        // Make a POST request to the GPT API
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });

        // Log the API response for debugging purposes
        console.log("response", response);

        // Process the API response and update chat memory with the assistant's message
        const data = await response.json();
        const text = data.replace(/^data: /, "");
        updateChatMemory(number, { role: "assistant", content: text }, nameChatbot);

        // Return the assistant's response
        return text;
    } catch (error) {
        // Handle and log any errors that occur during the process
        console.error("Error:", error);
        return { error: error.message };
    }
};

/**
 * Placeholder function for future functionality related to agent selection.
 */
const selectAgent = async () => {
    // Placeholder for future functionality related to agent selection
};

module.exports = {
    completion,
    generalUrl,
    headers
};
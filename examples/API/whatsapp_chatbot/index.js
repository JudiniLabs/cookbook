require("dotenv").config();

// Set up constants for server configuration
const PORT = process.env.PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;
const nameChatbot = process.env.CODEGPT_API_KEY;

// Import required modules and components
const http = require("http");
const { app } = require("./app");
const { instanciasBot } = require("./chatbot/instances.js");
const fs = require("fs").promises;
const { join } = require("path");
const whatsAppBot = require("./chatbot/chatbot.js");

// Function to retrieve credentials based on the provided session name
const getCreds = async (sessionName) => {
  const filePath = join(
    process.cwd(),
    `/Sessions/${sessionName}_session/creds.json`
  );

  try {
    const data = await fs.readFile(filePath, "utf8");
    const creds = JSON.parse(data);
    const num = creds.me.id;

    if (num) {
      return `${num.split(":")[0]}@s.whatsapp.net`;
    }
  } catch (err) {
    console.log("No credentials found, create a new bot");
  }
};

// Function to create WhatsApp bots based on provided chatbot data
const createBots = async () => {
  try {
    // Array containing chatbot data (in this case, only the chatbotId is used)
    const chatbotsData = [{ chatbotId: nameChatbot }];
    const botCreationPromises = [];

    // Iterate through each chatbot data and create a promise for bot creation
    for (const data of chatbotsData) {
      const chatbotId = data.chatbotId;
      const creds = await getCreds(chatbotId);

      // Create a promise for bot creation
      const botCreationPromise = (async () => {
        if (creds) {
          // Bot connected
          const botInstance = new whatsAppBot(chatbotId, creds);
          instanciasBot[chatbotId] = botInstance;
        } else {
          // Bot disconnected
          const botInstance = new whatsAppBot(chatbotId);
          instanciasBot[chatbotId] = botInstance;
        }
      })();

      botCreationPromises.push(botCreationPromise);
    }

    // Wait for all bot creation promises to complete
    await Promise.all(botCreationPromises);
  } catch (e) {
    console.log("Error obtaining and creating bots", e);
  }
};

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Call the function to create WhatsApp bots
createBots();

// Start the server and listen on the specified IP address and port
server.listen(PORT, IP_ADDRESS, () => {
  console.log(`Listening on http://${IP_ADDRESS}:${PORT}`);
});
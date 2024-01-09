  require("dotenv").config();
  const http = require("http");
  const { app } = require("./app");
  const fs = require("fs").promises;
  const { join } = require("path");
  const { instanciasBot, instanceCreation } = require("./src/utils.js");
  const { configureSocket } = require("./src/sockets/socket.js");
const whatsAppBot = require("./src/gateways/whatsapp-baileys.js");
const { readApiKeyFromFile } = require("./src/repositories/json-repository.js");

const PORT = process.env.PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;
const nameChatbot = process.env.NAME_CHATBOT

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
      const chatbotsData = [{ chatbotId: nameChatbot}];
      const botCreationPromises = [];

      // Iterate through each chatbot data and create a promise for bot creation
      for (const id of chatbotsData) {
        const chatbotId = id.chatbotId;
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
          try {
            await instanceCreation(chatbotId);
            console.log(`instancia de ${chatbotId} creado`);
          } catch (error) {
            console.error('Error:', error);
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
  configureSocket(server);
  // Start the server and listen on the specified IP address and port
  server.listen(PORT, IP_ADDRESS, () => {
    console.log(`Listening on http://${IP_ADDRESS}:${PORT}`);
  });
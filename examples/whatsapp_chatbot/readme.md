**WhatsApp Chatbot with codeGPT API Integration**

This repository contains the source code for a chatbot application built using GPT (Generative Pre-trained Transformer) technology. The chatbot interacts with users through a messaging interface, processing commands, and performing various actions based on the provided input.

**Install Dependencies:**

Before running the application, install the required dependencies by executing:

`npm install`

### Setup

**Environment Variables:**

Ensure you have the necessary environment variables set, including GENERAL_URL_API. These are essential to start the server and the chatbot. The chatbot name comes by default as whatsAppChatbot, you can put the name you want.
IP_ADDRESS=localhost
PORT=3001
NAME_CHATBOT = whatsAppChatbot

### Usage

`npm start`

Once the script is running, a web interface will be launched where you can scan the QR code generated by your chatbot to connect it with your WhatsApp, you will scan it from the application in the same way that codes are scanned for WhatsApp web.
Once the QR code is scanned, the chatbot will be connected with your WhatsApp number, but there are a couple of settings left!
Enter the API Key of your codeGPT account (you can get it here https://plus.codegpt.co) and select one of your available agents to be your default agent. If you don't want to select a default agent in each specific conversation, you can choose the agent to interact with through the chat commands.

Once these settings are chosen, you can interact with the CodeGPT Agent to generate responses

**Command System**

The chatbot has two functionalities:

If you send a message without commands, it will be interpreted as part of the conversation flow. In other words, you can interact through messages with your chatbot associated with the codeGPT account and the default agent. If the phone number sending the message writes to the chatbot for the first time, it will prompt you to choose an agent to interact with, considering the available agents through the `/defaultAgent` command. Once the agent is selected, you can interact with them through messages. If you want to change the agent, you can use the same command by sending the agentId, which you can obtain from the list of agents using the `/listAgents` command.

The second functionality is to interact with your codeGPT account using commands. This allows you to configure your agents and documents through a list of commands.

The chatbot responds to commands provided in the form of messages. Each command starts with a forward slash (/) followed by the specific command name.

If you do not provide a command, the message will be interpreted as a conversation flow question for your chatbot using codeGPT. It will respond to your message considering the history (maximum 30 messages).

Here are some of the available commands:

/createAgent: Creates a new agent with a specified name.
/getAgent: Retrieves information about the current agent.
/listAgents: Lists all available agents.
/updateAgent: Updates properties of the current agent.
/deleteAgent: Deletes a specific agent by its ID.
/usersMe: Retrieves information about the current user.
/loadDocuments: Loads a document for processing.
/trainDocuments: Trains a document specified by its ID.
/loadTrainDocuments: Loads and trains a document for processing.
/learn: Loads, trains, and activates a document for immediate processing.
/listDocuments: Lists all documents available to the user.
/getDocument: Retrieves information about a specific document by its ID.
/deleteDocument: Deletes a specific document by its ID.
/defaultAgent: Sets a default agent for the chatbot.
/myAgent: Retrieves information about the current agent associated with the chatbot.

**How it Works:**

- The chatbot processes incoming messages and identifies commands using the `/` prefix.
- Commands are mapped to specific methods that execute the corresponding functionality.
- Methods interact with the GPT API, process data, and return informative responses.

**Important:**

- The chatbot's message history is limited to 30 messages.
- The chatbot will function as long as the server is up and the QR code is scanned.
- You won't need to scan the code every time you start the server; it will remember it.
- Message history and the agent are associated with the phone number that writes and the chatbot to which it was written.

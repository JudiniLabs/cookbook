// Import required modules
const { extractValueByKey, extractAgentProperties, updateJsonAgents, readJsonAgents } = require("./utils");
const fs = require('fs').promises;

// Retrieve environment variables
const nameChatbot = process.env.CODE_GPT_API_KEY;
const generalUrl = process.env.GENERAL_URL_API;

// Define headers for API requests
const headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": `Bearer ${process.env.CODE_GPT_API_KEY}`
};

// Define a function to handle commands
const commands = async (msg, command) => {
    try {
        // Execute the corresponding method based on the command
        const response = await methods[command[0]](msg);
        return response || false;
    } catch (error) {
        return `Error: Unidentified method`;
    }
};

// Function to create a new agent
const createAgent = async (msg) => {
    try {
        const url = `${generalUrl}/agent`;
        // Get the value associated with the 'nameAgent' key from the text
        const nameValue = extractValueByKey(msg.text, 'nameAgent');

        // Check if a value was found for 'nameAgent'
        if (nameValue !== null) {
            // Create the payload object with the agent's name
            const payload = { "name": nameValue };

            // Make the request with the updated payload
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload),
            });

            const jsonResponse = await response.json();

            return `Agent created: ${JSON.stringify(jsonResponse, null, 2)}`;
        } else {
            // Handle the case where 'nameAgent' was not found or does not have an associated value
            return "'nameAgent' not found or does not have an associated value.";
        }
    } catch (error) {
        return error.message;
    }
};

// Function to get information about an agent
const getAgent = async (msg) => {
    try {
        // Get the value associated with the 'nameAgent' key from the text
        const nameValue = extractValueByKey(msg.text, `agentId`);

        if (nameValue !== null) {
            // Create the payload object with the agent's id
            const url = `${generalUrl}/agent/${nameValue}`;
            // Make the request 
            const response = await fetch(url, {
                method: "GET",
                headers: headers
            });

            const jsonResponse = await response.json();

            return `Agent: ${JSON.stringify(jsonResponse, null, 2)}`;
        } else {
            // Handle the case where 'nameAgent' was not found or does not have an associated value
            return "'agentId' not found or does not have an associated value.";
        }
    } catch (error) {
        return error.message;
    }
};

// Function to list all agents
const listAgents = async () => {
    try {
        const url = `${generalUrl}/agent`;
        // Make the request with the updated payload
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        const jsonResponse = await response.json();

        return `Agents: ${JSON.stringify(jsonResponse, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

// Function to update an agent's information
const updateAgent = async (msg) => {
    try {
        const payload = extractAgentProperties(msg.text);

        if (payload) {
            // Extracted properties successfully
            const agentId = payload.agentId;

            const urlAgent = `${generalUrl}/agent/${agentId}`;
            // Make the request 
            const responseAgent = await fetch(urlAgent, {
                method: "GET",
                headers: headers
            });

            const agent = await responseAgent.json();

            console.log("agent", agent.documentId)
            if (agent.documentId && agent.documentId.length > 0) {
                console.log("entró?")
                // Update payload.documentId with the existing agent.documentId
                payload.documentId = [...agent.documentId, payload.documentId];
            } else if (typeof payload.documentId === 'string') {
                // If agent.documentId is empty, convert payload.documentId into an array with its value
                payload.documentId = [payload.documentId];
            }

            const url = `${generalUrl}/agent/${agentId}`;

            console.log("Payload", payload)

            // Make the request
            const response = await fetch(url, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(payload)
            });

            console.log("response", response)

            const jsonResponse = await response.json();

            return `Agent: ${JSON.stringify(jsonResponse, null, 2)}`;
        } else {
            return "No agent properties found in the message.";
        }
    } catch (error) {
        return error.message;
    }
};

// Function to delete an agent
const deleteAgent = async (msg) => {
    try {
        // Get the value associated with the 'nameAgent' key from the text
        const nameValue = extractValueByKey(msg.text, `agentId`);

        if (nameValue !== null) {
            // Create the payload object with the agent's id
            const url = `${generalUrl}/agent/${nameValue}`;
            // Make the request 
            const response = await fetch(url, {
                method: "DELETE",
                headers: headers
            });

            const jsonResponse = await response.json();

            return `Agent deleted: ${JSON.stringify(jsonResponse, null, 2)}`;
        } else {
            // Handle the case where 'nameAgent' was not found or does not have an associated value
            return "'agentId' not found or does not have an associated value.";
        }
    } catch (error) {
        return error.message;
    }
};

// Function to get information about the current user
const usersMe = async (msg) => {
    try {
        const url = `${generalUrl}/users/me`;
        // Make the request 
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        const jsonResponse = await response.json();

        return `User info: ${JSON.stringify(jsonResponse, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

// Function to load a document
const loadDocuments = async (filename) => {
    try {
        const filePath = `./Data/Documents/${filename}`;

        // Read the content of the file
        const fileContent = await fs.readFile(filePath);

        // Create a Blob object
        const fileBlob = new Blob([fileContent], { type: 'application/pdf' });

        // Create a FormData object
        const formData = new FormData();
        formData.append('file', fileBlob, filename);

        const headers = {
            'Authorization': `Bearer ${process.env.CODE_GPT_API_KEY}`, // Replace with your API key
        };

        const url = `${generalUrl}/document/load`;

        // Perform the POST request
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        // Parse the JSON response
        const jsonResponse = await response.json();

        return `Document load: ${JSON.stringify(jsonResponse, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

// Function to train a document
const trainDocuments = async (msg) => {
    try {
        const nameValue = extractValueByKey(msg.text, `documentId`);
        console.log(nameValue)

        if (nameValue !== null) {

            // Create the payload object with the documents's id
            const url = `${generalUrl}/document/training/${nameValue}`;

            // Perform the POST request
            const response = await fetch(url, {
                method: 'POST',
                headers: headers
            });

            // Parse the JSON response
            const jsonResponse = await response.json();
            console.log("response", jsonResponse)

            return `Document trained: ${JSON.stringify(jsonResponse, null, 2)}`;
        }
        return "DocumentId was not provided";
    } catch (error) {
        return error.message;
    }
};

// Function to load and train a document
const loadTrainDocuments = async (filename) => {
    try {
        const filePath = `./Data/Documents/${filename}`;

        // Read the content of the file
        const fileContent = await fs.readFile(filePath);

        // Create a Blob object
        const fileBlob = new Blob([fileContent], { type: 'application/pdf' });

        // Create a FormData object
        const formData = new FormData();
        formData.append('file', fileBlob, filename);

        const headers = {
            'Authorization': `Bearer ${process.env.CODE_GPT_API_KEY}`, // Replace with your API key
        };

        const url = `${generalUrl}/document/load-and-training`;

        // Perform the POST request
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        // Parse the JSON response
        const jsonResponse = await response.json();

        return `Document load and trained: ${JSON.stringify(jsonResponse, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

// Function to list all documents
const listDocuments = async (msg) => {
    try {
        const url = `${generalUrl}/document`;
        // Make the request 
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        const jsonResponse = await response.json();

        return `Your documents: ${JSON.stringify(jsonResponse, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

// Function to get information about a document
const getDocument = async (msg) => {
    try {
        const nameValue = extractValueByKey(msg.text, `documentId`);

        if (nameValue !== null) {

            // Create the payload object with the documents's id
            const url = `${generalUrl}/document/${nameValue}`;

            // Perform the GET request
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });

            // Parse the JSON response
            const jsonResponse = await response.json();
            console.log("response", jsonResponse)

            return `Document info: ${JSON.stringify(jsonResponse, null, 2)}`;
        }

        return "DocumentId was not provided";

    } catch (error) {
        return error.message;
    }
};

// Function to delete a document
const deleteDocument = async (msg) => {
    try {
        const nameValue = extractValueByKey(msg.text, `documentId`);

        if (nameValue !== null) {

            // Create the payload object with the documents's id
            const url = `${generalUrl}/document/${nameValue}`;

            // Perform the DELETE request
            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers
            });

            // Parse the JSON response
            const jsonResponse = await response.json();
            console.log("response", jsonResponse)

            return jsonResponse.message;
        }

        return "DocumentId was not provided";

    } catch (error) {
        return error.message;
    }
};

// Function to set the default agent for a user
const defaultAgent = async (msg) => {
    try {
        const nameValue = extractValueByKey(msg.text, `agentId`);
        const number = msg.sender.split("@")[0];
        if (nameValue !== null) {
            try {
                await updateJsonAgents(number, nameValue, nameChatbot)
                return `agent ${nameValue} is now your agent`
            }
            catch(error){
                return error.message
            }
        }

        return "DocumentId was not provided";

    } catch (error) {
        return error.message;
    }
};

// Function to get the current agent associated with the user
const myAgent = async (msg) => {
    try {
        const number = msg.sender.split("@")[0];
        console.log("number", number)
        let agents = await readJsonAgents(nameChatbot)
        console.log(agents)
        return `actual agent is ${agents[number]}`
    } catch (err) {
        return {};
    }
};

const noAgent = async (nameChatbot) => {
    try {
      let agents = await listAgents()
      return `You don't have any agent associated.
      To select one of your agents, write /defaultAgent agentId: (chosen agent id).
      Your available agents are these: ${agents}`
    } catch (err) {
      return {};
    }
  };

// Define a set of commands with corresponding methods
const methods = {
    "/createAgent": createAgent,
    "/getAgent": getAgent,
    "/listAgents": listAgents,
    "/updateAgent": updateAgent,
    "/deleteAgent": deleteAgent,
    "/usersMe": usersMe,
    "/loadDocuments": loadDocuments,
    "/trainDocuments": trainDocuments,
    "/loadTrainDocuments": loadTrainDocuments,
    "/listDocuments": listDocuments,
    "/getDocument": getDocument,
    "/deleteDocument": deleteDocument,
    "/defaultAgent": defaultAgent,
    "/myAgent": myAgent
};
// Export the functions for external use
module.exports = {
    commands,
    createAgent,
    noAgent
};

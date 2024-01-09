const { readJsonAgents, updateJsonAgents} = require("../repositories/json-repository");
const CodeGPTApi = require("../services/code-gpt-api");
const { extractAgentProperties, extractValueByKey } = require("../utils");
const { instanciasBot } = require('../utils');
const nameChatbot = process.env.NAME_CHATBOT;
const generalUrl = process.env.GENERAL_URL_API;

let codeGPTApi;

function getCodeGPTApi() {
  if (!codeGPTApi) {
    const apiKey = instanciasBot[nameChatbot].apiKey;
    codeGPTApi = new CodeGPTApi(generalUrl, apiKey);
  }
  return codeGPTApi;
}

const commands = async (msg, command, agentId) => {
    try {
        // Execute the corresponding method based on the command
        const response = await methods[command[0]](msg,agentId);
        return response || false;
    } catch (error) {
        return `Error: Unidentified method`;
    }
};

// Function to create a new agent
const createAgent = async (msg) => {
    try {
        // Get the value associated with the 'nameAgent' key from the text
        const nameAgent = extractValueByKey(msg.text, 'nameAgent');

        // Check if a value was found for 'nameAgent'
        if (nameAgent !== null) {

            let response = await getCodeGPTApi().createAgent(nameAgent)

            return `Agent created: ${JSON.stringify(response, null, 2)}`;

        } else {
            // Handle the case where 'nameAgent' was not found or does not have an associated value
            return "'nameAgent' not found or does not have an associated value.";
        }
    } catch (error) {
        return error.message;
    }
};

const getAgent = async (msg,agentId) => {
    try {
   
        if (agentId !== null) {
            let response = await getCodeGPTApi().getAgent(agentId)

            return `Agent: ${JSON.stringify(response, null, 2)}`;

        } else {
            // Handle the case where 'nameAgent' was not found or does not have an associated value
            return "'agentId' not found or does not have an associated value.";
        }
    } catch (error) {
        return error.message;
    }
};

const listAgents = async () => {
    try {
       
        let response = await getCodeGPTApi().listAgents()

        return `Your Agents: ${JSON.stringify(response, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

const updateAgent = async (msg,agentId) => {
    try {
        const payload = extractAgentProperties(msg.text);
        console.log("payload", payload, agentId)
        if (payload) {
             
            let agent = await getCodeGPTApi().getAgent(agentId)

            if (agent.documentId && agent.documentId.length > 0 && payload.documentId) {
                // Update payload.documentId with the existing agent.documentId
                payload.documentId = [...agent.documentId, payload.documentId];
            } else if (typeof payload.documentId === 'string') {
                // If agent.documentId is empty, convert payload.documentId into an array with its value
                payload.documentId = [payload.documentId];
            }

            let response = await getCodeGPTApi().updateAgent(agentId,payload)
            
            return `Agent: ${JSON.stringify(response, null, 2)}`;
        } else {
            return "No agent properties found in the message.";
        }
    } catch (error) {
        return error.message;
    }
};

const deleteAgent = async (msg) => {
    try {
        // Get the value associated with the 'nameAgent' key from the text
        const agentId = extractValueByKey(msg.text, `agentId`);

        if (agentId !== null) {
            let response = await getCodeGPTApi().deleteAgent(agentId)

            return `Agent deleted: ${JSON.stringify(response, null, 2)}`;
        } else {
            // Handle the case where 'nameAgent' was not found or does not have an associated value
            return "'agentId' not found or does not have an associated value.";
        }
    } catch (error) {
        return error.message;
    }
};

const usersMe = async () => {
    try {
        let response = await getCodeGPTApi().usersMe()

        return `User info: ${JSON.stringify(response, null, 2)}`;

    } catch (error) {
        return error.message;
    }
};

// Function to load a document
const loadDocuments = async (filename) => {
    try {
       let response = await getCodeGPTApi().loadDocuments(filename)

        return `Document load: ${JSON.stringify(response, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

// Function to train a document
const trainDocuments = async (msg) => {
    try {
        if (!msg.text) return "documentId not provided"
        const documentId = extractValueByKey(msg.text, `documentId`);
        console.log("documentId", documentId)

        if (documentId !== null) {
            let response = await getCodeGPTApi().trainDocuments(documentId)
            return `Document trained: ${JSON.stringify(response, null, 2)}`;
        }
        return "DocumentId was not provided";
    } catch (error) {
        return error.message;
    }
};

const loadTrainDocuments = async (filename) => {
    try {
        let response = await getCodeGPTApi().loadTrainDocuments(filename)

        return `Document load and trained: ${JSON.stringify(response, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};
const loadTrainActivateDocuments = async (filename,agentId) => {
    try {
        
        let agent = await getCodeGPTApi().getAgent(agentId)
        let firstResponse = await getCodeGPTApi().loadTrainDocuments(filename);
       
        let documentId = firstResponse.documentId ??(firstResponse.detail.match(/documentId: (\S+)/) || [null, null])[1];

        if (agent.documentId && agent.documentId.includes(documentId)) {
            return "DocumentId already load, train and activate with this agent.";
        }
        let payload = {}
        if (agent.documentId && agent.documentId.length > 0  ) {
                // Update payload.documentId with the existing agent.documentId
                payload.documentId = [...agent.documentId, documentId];
        } else payload.documentId = [payload.documentId];
        
        let response = await getCodeGPTApi().updateAgent(agentId,payload)

        return `Document ready to work: ${JSON.stringify(response, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};
// Function to list all documents
const listDocuments = async () => {
    try {
        const response = await getCodeGPTApi().listDocuments()

        return `Your documents: ${JSON.stringify(response, null, 2)}`;
    } catch (error) {
        return error.message;
    }
};

// Function to get information about a document
const getDocument = async (msg) => {
    try {
        const documentId = extractValueByKey(msg.text, `documentId`);

        let response = await getCodeGPTApi().getDocument(documentId)

            return `Document info: ${JSON.stringify(response, null, 2)}`;
        
    } catch (error) {
        return error.message;
    }
};

// Function to delete a document
const deleteDocument = async (msg) => {
    try {
        const documentId = extractValueByKey(msg.text, `documentId`);
    
        let response = await getCodeGPTApi().deleteDocument(documentId)
    
            return response.message?? response.detail;
    
    } catch (error) {
        return error.message;
    }
};


const defaultAgent = async (msg) => {
    try {
        const apiKey = instanciasBot[nameChatbot].apiKey 
        const nameValue = extractValueByKey(msg.text, `agentId`);
        const number = msg.sender.split("@")[0];
        if (nameValue !== null) {
            try {
                await updateJsonAgents(number, nameValue, apiKey)
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
        const apiKey = instanciasBot[nameChatbot].apiKey
        let agents = await readJsonAgents(apiKey)
      
        return `actual agent is ${agents[number]}`
    } catch (err) {
        return {};
    }
};

const noAgent = async () => {
    try {
      let agents = await listAgents()
      return `You don't have any agent associated.
      To select one of your agents, write /defaultAgent agentId: (chosen agent id).
      Your available agents are these: ${agents}`
    } catch (err) {
      return {};
    }
  };

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
    "/aprende": loadTrainActivateDocuments,
    "/listDocuments": listDocuments,
    "/getDocument": getDocument,
    "/deleteDocument": deleteDocument,
    "/defaultAgent": defaultAgent,
    "/myAgent": myAgent,
    "/learn" : loadTrainActivateDocuments,
};

module.exports = {
    commands,
    noAgent
};
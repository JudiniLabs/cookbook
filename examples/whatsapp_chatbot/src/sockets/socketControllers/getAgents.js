const CodeGPTApi = require("../../services/code-gpt-api");
const { instanciasBot } = require("../../utils");



let codeGPTApi;

function getCodeGPTApi() {
  if (!codeGPTApi) {
    const apiKey = instanciasBot[process.env.NAME_CHATBOT].apiKey;
    codeGPTApi = new CodeGPTApi(process.env.GENERAL_URL_API, apiKey);
  }
  return codeGPTApi;
}
const getAgents = async () => {
    let response = await getCodeGPTApi().listAgents();
    
  
    let agentIds = response.map(agent => agent.name);
   
   return agentIds
  }

 
module.exports  = {
    getAgents
}
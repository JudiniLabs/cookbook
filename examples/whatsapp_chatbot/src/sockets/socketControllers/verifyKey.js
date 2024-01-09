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
const verifyKey = async (apiKey) => {
  try {
    await getCodeGPTApi().usersMe(apiKey);
    return false
    
  } catch (error) {
    console.log("ERROR",error.message)
    return error.message
  }
}

 
module.exports  = {
    verifyKey
}
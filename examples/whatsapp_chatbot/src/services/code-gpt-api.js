const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

class CodeGPTApi {
    constructor(generalUrl, apiKey) {
        this.generalUrl = generalUrl;
        this.apiKey = apiKey
        this.headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": `Bearer ${apiKey}`
        };
    }

    async completion(agentId, messages) {
        try {
           
            const url = `${this.generalUrl}/completion`;
            const payload = {
                agent: agentId,
                messages: messages,
                stream: false,
            };

            const response = await fetch(url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(payload),
            });

          

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT completion error: ${error.message}`);
        }
    }

    async createAgent(nameAgent) {
        try {
            const url = `${this.generalUrl}/agent`;
            const payload = { "name": nameAgent };
            const response = await fetch(url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(payload),
            });

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT create agent error: ${error.message}`);
        }
    }

    async getAgent(agentId) {
        try {
            const url = `${this.generalUrl}/agent/${agentId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.headers
            });

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT get agent error: ${error.message}`);
        }
    }

    async listAgents() {
        try {
            const url = `${this.generalUrl}/agent`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.headers
            });

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT list agents error: ${error.message}`);
        }
    }

    async updateAgent(agentId, payload) {
        try {
        
            const url = `${this.generalUrl}/agent/${agentId}`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: this.headers,
                body: JSON.stringify(payload)
            });
            

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT update agent error: ${error.message}`);
        }
    }

    async deleteAgent(agentId) {
        try {
            const url = `${this.generalUrl}/agent/${agentId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: this.headers
            });

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT delete agent error: ${error.message}`);
        }
    }

    async usersMe() {
        try {
            const url = `${this.generalUrl}/users/me`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.headers
            });

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT users me error: ${error.message}`);
        }
    }

    async loadDocuments(filename) {
        try {
            const filePath = `./Data/Documents/${filename}`;
            const fileContent = await fs.readFile(filePath);
    
            // Create a FormData object
            const formData = new FormData();
            formData.append('file', fileContent, { filename });
    
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                ...formData.getHeaders(), // Incluye los encabezados de FormData
            };
    
            const url = `${this.generalUrl}/document/load`;
    
            // Use Axios para enviar la solicitud
            const response = await axios.post(url, formData, { headers });
           
            // Parse the JSON res   ponse
            const jsonResponse = response.data;
    
            return jsonResponse;
        } catch (error) {
            return error.message;
        }
    }

    async trainDocuments(documentId) {
        try {
            const url = `${this.generalUrl}/document/training/${documentId}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers
            });

            const jsonResponse = await response.json();
            console.log("Response fail", jsonResponse)
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT train document error: ${error.message}`);
        }
    }

    async loadTrainDocuments(filename) {
        try {
            const filePath = `./Data/Documents/${filename}`;
            const fileContent = await fs.readFile(filePath);
    
            // Create a FormData object
            const formData = new FormData();
            formData.append('file', fileContent, { filename });
    
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                ...formData.getHeaders(), // Incluye los encabezados de FormData
            };
    
            const url = `${this.generalUrl}/document/load-and-training`;
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT load and train error: ${error.message}`);
        }
    }

    async listDocuments() {
        try {
            const url = `${this.generalUrl}/document`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.headers
            });

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT list documents error: ${error.message}`);
        }
    }

    async getDocument(documentId) {
        try {
            console.log("document", documentId)
            const url = `${this.generalUrl}/document/${documentId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });
           
            const jsonResponse = await response.json();
            
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT get document error: ${error.message}`);
        }
    }

    async deleteDocument(documentId) {
        try {
            const url = `${this.generalUrl}/document/${documentId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.headers
            });

            const jsonResponse = await response.json();
        
            return jsonResponse;
        } catch (error) {
            throw new Error(`api codeGPT delete document error: ${error.message}`);
        }
    }
}

module.exports = CodeGPTApi;

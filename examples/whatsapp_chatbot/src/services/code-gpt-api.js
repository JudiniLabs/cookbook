class CodeGPTApi {
    constructor(generalUrl, apiKey) {
        this.generalUrl = generalUrl;
        this.apiKey = apiKey
        this.headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": `Bearer ${this.apiKey}`
        };
    }

    async completion(agentId, messages) {
        console.log(agentId)
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
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }

    async createAgent(nameAgent) {
            const url = `${this.generalUrl}/agent`;
            const payload = { "name": nameAgent };
            const response = await fetch(url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }

    async getAgent(agentId) {
            const url = `${this.generalUrl}/agent/${agentId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.headers
            });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }

    async listAgents() {
            const url = `${this.generalUrl}/agent`;
            const response = await fetch(url, {
                method: "GET",
                headers: this.headers
            });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }

    async updateAgent(agentId, payload) {
            const url = `${this.generalUrl}/agent/${agentId}`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: this.headers,
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }

    async deleteAgent(agentId) {
            const url = `${this.generalUrl}/agent/${agentId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: this.headers
            });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }

    async usersMe(apiKey) {
            const url = `${this.generalUrl}/users/me`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "authorization": `Bearer ${apiKey}`
                }
            });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }

    async loadDocuments(filename) {
            const filePath = `./Data/Documents/${filename}`;
            const fileContent = await fs.readFile(filePath);
            const formData = new FormData();
            formData.append('file', fileContent, { filename });
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                ...formData.getHeaders(),
            };
            const url = `${this.generalUrl}/document/load`;
            const response = await axios.post(url, formData, { headers });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = response.data;
            return jsonResponse;
    }

    async userExists(email) {
            const url = `${this.generalUrl}/users/exists`;
            const payload = { email };
            const response = await fetch(url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Error HTTP! estado: ${error.detail}`);
            }
            const jsonResponse = await response.json();
            return jsonResponse;
    }
}

module.exports = CodeGPTApi
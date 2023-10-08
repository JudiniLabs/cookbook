# Streamlit Simple Chat

This code is a simple chatbot powered by CodeGPT Plus, a natural language processing API. It uses Streamlit to create a simple user interface where users can input a message and receive a response from the chatbot.

<img width="992" alt="Captura de pantalla 2023-10-07 a las 19 23 06" src="https://github.com/JudiniLabs/cookbook/assets/6216945/7e1e069c-688d-46ab-8b8c-aedbd2377da5">

## Dependencies

This code requires the following dependencies:

- Streamlit
- Requests
- JSON
- Dotenv

## How to use

1. Clone the repository or download the code.
2. Install the dependencies by running 
   ```
   pip install -r requirements.txt 
   ```
3. Create an account on CodeGPT Plus and obtain an API key.
4. Create a new agent on CodeGPT Plus and obtain the agent ID.
5. Create a .env file in the root directory of the project and add the following lines:
    ```
    CODEGPT_API_KEY=<your_api_key>
    CODEGPT_AGENT_ID=<your_agent_id>
    ```
6. Run the code by running 
   ```
   streamlit run app.py 
   ```
7. Input a message in the chatbox and receive a response from the chatbot.

## Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
[![Deploy to Azure](https://binbashbanana.github.io/deploy-buttons/buttons/remade/azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fwebapp-linux-node%2Fazuredeploy.json)
[![Deploy to Render](https://binbashbanana.github.io/deploy-buttons/buttons/remade/render.svg)](https://render.com/deploy?repo=https://github.com/BinBashBanana/deploy-buttons)
[![Deploy on Railway](https://binbashbanana.github.io/deploy-buttons/buttons/remade/railway.svg)](https://railway.app/new/template?template=https://github.com/BinBashBanana/deploy-buttons)
## Notes 

- The chat history is stored in the st.session_state variable, which is a dictionary that persists across app reruns.
- The chat history is displayed on app rerun by iterating through the st.session_state.messages list and displaying each message in the appropriate chat message container.
- The chatbot response is obtained by sending a POST request to the CodeGPT Plus API with the user's message as input. The response is streamed back in chunks and displayed in the chat message container with a blinking cursor to simulate typing.

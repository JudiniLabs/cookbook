# Streamlit Simple Chat

This code is a simple chatbot powered by CodeGPT Plus, a natural language processing API. It uses Streamlit to create a simple user interface where users can input a message and receive a response from the chatbot.

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

## Notes 

- The chat history is stored in the st.session_state variable, which is a dictionary that persists across app reruns.
- The chat history is displayed on app rerun by iterating through the st.session_state.messages list and displaying each message in the appropriate chat message container.
- The chatbot response is obtained by sending a POST request to the CodeGPT Plus API with the user's message as input. The response is streamed back in chunks and displayed in the chat message container with a blinking cursor to simulate typing.
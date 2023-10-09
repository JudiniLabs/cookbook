# Agent Writer for Medium 📝🤖

This is a Streamlit app that allows you to engage with an AI agent on the topic on which you wish to create an article. Once the discussion is finished, you can instruct your agent to publish the article on Medium.

## Dependencies

- streamlit
- asyncio
- requests
- json
- judini
- dotenv

## How to use

1. Clone the repository or download the code.
2. Install the dependencies by running 
   ```
   pip install -r requirements.txt 
   ```
3. Create an account on CodeGPT Plus and obtain an API key.
4. Create a new agent on CodeGPT Plus and obtain the agent ID.
5. Create a .env file in the root directory of the project and add the following lines:
    - CODEGPT_API_KEY: Your CodeGPT API key
    - CODEGPT_AGENT_ID: Your CodeGPT agent ID
    - CODEGPT_MEDIUM_AGENT_ID: Your CodeGPT Medium agent ID
    - MEDIUM_TOKEN: Your Medium Developer Token
6. Run the code by running 
   ```
   streamlit run app.py 
   ```
7. Engage with the AI agent on the topic on which you wish to create an article
8. Once the discussion is finished, instruct your agent to publish the article on Medium

## Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/JudiniLabs/cookbook/tree/main/examples/agents/streamlit_medium_writer_chat)

## Notes

- This app uses the CodeGPT API to generate text based on the user's input.
- The app also uses the Medium API to publish the article on Medium.
- Make sure you have a valid Medium Developer Token before using this app.
- The app is still in development and may contain bugs or errors.
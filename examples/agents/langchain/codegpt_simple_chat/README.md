# CodeGPT Langchain simple chat
This code is an example of how to use the langchain package to interact with the CodeGPT API.

## Dependencies
This code requires the following dependencies:
- dotenv
- langchain

## Usage
1. Install the dependencies by running pip install -r requirements.txt.
2. Create a .env file with your CodeGPT API key and agent ID, following the format in the example .env.example file.
3. Run the code by executing python main.py.
4. The code will send a message to the CodeGPT API and print the response.

## Code Explanation
- The necessary libraries are imported.
- The environment variables are loaded from the .env file.
- The API key, agent ID, and API base URL are retrieved from the environment variables.
- A ChatOpenAI object is created with the retrieved API key, API base URL, and agent ID.
- A list of messages to send to the ChatOpenAI object is created.
- The messages are sent to the ChatOpenAI object and the response is retrieved.
- The response is printed.
import os
import streamlit as st
import telebot
import requests
import json
from judini.codegpt.codegpt import CodeGPT
from judini.codegpt.agent import Agent
from judini.codegpt.chat import Completion
from judini.codegpt.document import Document
from dotenv import load_dotenv
import re
load_dotenv()

API_KEY = os.getenv('TELEGRAM_KEY')
api_key= os.getenv("CODEGPT_API_KEY")
agent_id= os.getenv("CODEGPT_AGENT_ID")

bot = telebot.TeleBot(API_KEY)

import requests

@bot.message_handler(commands=['bot'])
def chat_completion(message):
    """
    Handles user messages on Telegram, sends them to a specific agent for chat completion,
    and responds with the generated completion.
    
    Requirements:
    - Message format: command /bot and [user_message]
    """
    completion = Completion(api_key)
    clean_text = message.text.replace("/bot", "")
    prompt = {
        "role": "user",
        "content": clean_text
    }
    response = completion.create(agent_id, prompt)
    print(response)
    bot.reply_to(message, response)


@bot.message_handler(commands=['change_agent_id'])
def changeAgentId(message):
    """
    Receives the agent ID to work with and updates the global variable agent_id.
    
    Usage:
    - Send a message in the format: /change_agent_id [new_agent_id]
    
    If you need to send a message to a different agent, change it through this function!
    
    Requirements:
    -command /change_agent_id
    - Provide the ID of the agent to switch message handling.
    - Global variable: agent_id
    """
    global agent_id

    # Extract the new agent_id from the message
    new_agent_id = message.text.replace("/change_agent_id", "").strip()

    # Update the global variable agent_id
    agent_id = new_agent_id

    bot.reply_to(message, f"The agent ID has been updated to {new_agent_id}.")

@bot.message_handler(commands=['get_my_data'])
def getMyData(message):
    """
    Retrieves personal data associated with the current CodeGPT instance
    and responds with a formatted message containing the user's data.

    Requirements:
    - Command: /get_my_data
    - Global variable: api_key
    """
    codegpt = CodeGPT(api_key)
    user_data = codegpt.me()

    # Format the content of the user_data object
    formatted_response = "\n".join([f"{key.capitalize()}: {value}" for key, value in user_data.items() if value is not None])

    # Respond to the user with the formatted message
    bot.reply_to(message, formatted_response)

@bot.message_handler(commands=['get_all_agent'])
def getAllAgent(message):
    """
    Retrieves a list of all available agents from the CodeGPT service
    and responds with a formatted message containing agent information.

    Requirements:
    - Command: /get_all_agent
    - Global variable: api_key
    """
    agent = Agent(api_key)
    agent_data = agent.getAll()

    # Format the content of the agent_data object
    formatted_responses = []

    for agent_info in agent_data:
        formatted_response = "\n".join([f"{key.capitalize()}: {value}" for key, value in agent_info.items() if value is not None])
        formatted_responses.append(formatted_response)

    final_response = "\n\n".join(formatted_responses)

    # Respond to the user with the formatted message
    bot.reply_to(message, final_response)

@bot.message_handler(commands=['get_agent_by_id'])
def getAgentById(message):
    """
    Retrieves details of a specific agent by its ID.
    
    Usage:
    - Send a message in the format: /get_agent_by_id [agent_id]
    
    Requirements:
    - Command: /get_agent_by_id
    - agent_id
    - Global variable: api_key
    """
    agent = Agent(api_key)
    agent_id = message.text.split()[-1]
    agent_data = agent.getAgentById(agent_id)

    formatted_response = "\n".join([f"{key.capitalize()}: {value}" for key, value in agent_data.items() if value is not None])

    # Respond to the user with the formatted message
    bot.reply_to(message, formatted_response)


@bot.message_handler(commands=['update_agent'])
def updateAgent(message):
    """
    Updates the information of a specific agent based on the provided message.
    
    Usage:
    - Send a message in the format: /update_agent agent_id: [agent_id] key1: value1, key2: value2, ...
    
    Parameters:
        agent_id (str): The ID of the agent to update.
        data (dict): The data to update the agent with.
    
    Options:
        - Available parameters for data: 
            'status', 'name', 'documentId', 'description', 'prompt',
            'topk', 'temperature', 'model', 'welcome', 'maxTokens'
        
        - For numeric parameters ('topk', 'temperature', 'maxTokens'), use a number.
        
        - Separate parameters and their values with commas.
        
    Note:
        - You are free to choose to update one, multiple, or all parameters.
        
    Requirements:
        - Command: /update_agent
        - Parameters to be updated
        - Global variable: api_key
    """
    # Search for agent_id in the message
    agent_id_match = re.search(r'agent_id: ([^\s,]+)', message.text)

    if not agent_id_match:
        bot.reply_to(message, "No agent_id was identified in the message.")
        return

    agent_id = agent_id_match.group(1)

    # Build the data object with parameters present in the message
    data = {}
    valid_parameters = [
        'status', 'name', 'documentId', 'description', 'prompt',
        'topk', 'temperature', 'model', 'welcome', 'maxTokens'
    ]

    parameter_pattern = re.compile(r'(\w+): ([^,]+)')

    # Search for all parameters in the message
    matches = parameter_pattern.findall(message.text)

    for key, value in matches:
        key = key.strip()
        value = value.strip()

        # Verify the data type before adding to the data object
        if key.lower() in valid_parameters:
            if key.lower() in ['topk', 'temperature', 'maxTokens']:
                try:
                    value = float(value)
                except ValueError:
                    bot.reply_to(message, f"The value for '{key}' must be a number.")
                    return
            data[key] = value

            

    # Check if there is data to update
    if not data:
        bot.reply_to(message, "No update parameters were found in the message.")
        return
    
    # Continue with the update logic using agent_id and data
    agent = Agent(api_key)
    agent_updated = agent.update(agent_id, data)

    # Format the response
    if agent_updated:
        formatted_response = "\n".join([f"{key.capitalize()}: {value}" for key, value in agent_updated.items() if value is not None])
        bot.reply_to(message, formatted_response)
    else:
        bot.reply_to(message, "An error occurred while trying to update the agent.")


@bot.message_handler(commands=['link_document'])
def linkDocument(message):
    """
    Links a document to a specific agent.
    
    Usage:
    - Send a message in the format: /link_document agent_id: [agent_id] document_id: [document_id]
    
    Parameters:
        agent_id (str): The ID of the agent to link the document to.
        document_id (str): The ID of the document to link.
    
    Returns:
        Response object indicating the result of the operation.
    
    Requirements:
        - Command: /link_document
        - ids
        - Global variable: api_key
    """
    agent_id_match = re.search(r'agent_id\s*:\s*([^\s,]+)', message.text)
    document_id_match = re.search(r'document_id\s*:\s*([^\s,]+)', message.text)

    if not agent_id_match or not document_id_match:
        bot.reply_to(message, "The agent_id or document_id was not identified in the message.")
        return

    agent_id, document_id = agent_id_match.group(1), document_id_match.group(1)
    updated = Agent(api_key).linkDocument(agent_id, document_id)
    bot.reply_to(message, "The agent has been updated with the document. Status: {}".format(updated))


@bot.message_handler(commands=['unlink_document'])
def unlinkDocument(message):
    """
    Unlinks a document from a specific agent.
    
    Usage:
    - Send a message in the format: /unlink_document agent_id: [agent_id] document_id: [document_id]
    
    Parameters:
        agent_id (str): The ID of the agent to unlink the document from.
        document_id (str): The ID of the document to unlink.
    
    Returns:
        Response object indicating the result of the operation.
    
    Requirements:
        - Command: /unlink_document
        - ids
        - Global variable: api_key
    """
    agent = Agent(api_key)
    agent_id_match = re.search(r'agent_id\s*:\s*([^\s,]+)', message.text)
    document_id_match = re.search(r'document_id\s*:\s*([^\s,]+)', message.text)

    if not agent_id_match or not document_id_match:
        bot.reply_to(message, "The agent_id or document_id was not identified in the message.")
        return

    agent_id, document_id = agent_id_match.group(1), document_id_match.group(1)
    updated = agent.unlinkDocument(agent_id, document_id)
    bot.reply_to(message, "The agent has been updated. Status: {}".format(updated))

@bot.message_handler(commands=['get_all_document'])
def getAllDocument(message):
    """
    Retrieves information about all document files.
    
    Usage:
    - Send a message with the command: /get_all_document
    
    Returns:
        A response object containing the data of all documents.
    
    Requirements:
        - Command: /get_all_document
        - Global variable: api_key
    """
    document = Document(api_key)
    all_docs = document.getAll()

    # Build the formatted message
    formatted_message = "List of all documents:\n"
    for doc in all_docs:
        formatted_message += f"\nDocument ID: {doc['documentId']}\nName: {doc['name']}\nStatus: {doc['status']}\nContent: {doc['content']}\n"

    # Print to the console for debugging purposes
    print(formatted_message)

    # Reply to the user with the formatted message
    bot.reply_to(message, formatted_message)


@bot.message_handler(commands=['get_doc_by_id'])
def getDocumentById(message):
    """
    Retrieves information about the specific document associated with the documentId.
    
    Usage:
    - Send a message with the command: /get_doc_by_id document_id: [document_id]
    
    Parameters:
        document_id (str): The ID of the document to retrieve information about.
    
    Returns:
        A response object containing the data of the specified document.
    
    Requirements:
        - Command: /get_doc_by_id
        - document_id
        - Global variable: api_key
    """
    document = Document(api_key)

    # Extract the document_id from the message
    document_id_match = re.search(r'document_id\s*:\s*([^\s,]+)', message.text)
    
    if not document_id_match:
        bot.reply_to(message, "The document_id was not identified in the message.")
        return

    document_id = document_id_match.group(1)

    # Get information about the document by ID
    doc = document.getDocumentById(document_id)

    # Get only the first line of the content
    content_words = doc.get('content', '').split()[:5]
    content_first_line = ' '.join(content_words)

    # Build the formatted message
    formatted_message = f"Document information with ID {document_id}:\nName: {doc['name']}\nStatus: {doc['status']}\nContent: {content_first_line}"

    # Print to the console for debugging purposes
    print(formatted_message)

    # Reply to the user with the formatted message
    bot.reply_to(message, formatted_message)


@bot.message_handler(commands=['del_doc_by_id'])
def deleteDocument(message):
    """
    Deletes a document associated with the documentId.
    
    Usage:
    - Send a message with the command: /del_doc_by_id document_id: [document_id]
    
    Parameters:
        document_id (str): The ID of the document to be deleted.
    
    Returns:
        A response object containing the data of the deleted document.
    
    Requirements:
        - Command: /del_doc_by_id
        - document_id
        - Global variable: api_key
    """
    document = Document(api_key)
    document_id_match = re.search(r'document_id\s*:\s*([^\s,]+)', message.text)
    
    if not document_id_match:
        bot.reply_to(message, "The document_id was not identified in the message.")
        return

    document_id = document_id_match.group(1)
    doc = document.delete(document_id)  # Fixed: The method is now 'delete' instead of 'get'

    print(doc)
    # Build the formatted message
    formatted_message = f"Document with ID {document_id} deleted"

    # Reply to the user with the formatted message
    bot.reply_to(message, formatted_message)


@bot.message_handler(content_types=['document'])
def handleDocument(message):
    """
    Handle document files for loading or training.

    Usage:
    - Send a document file with the caption 'load' to perform loading.
    - Send a document file with the caption 'train' to perform loading and training.

    Parameters:
        - message (telegram.Message): The incoming message object containing the document.

    Returns:
        A response object indicating the result of the operation.

    Requirements:
        - Content type: document
        - Global variable: api_key
        - Load or train

    Note:
    - This function is triggered automatically when a document is sent.
    - The document file should be sent with the desired caption: 'load' or 'train'.
    - The document is downloaded, and the specified operation (load or train) is performed.
    - Success or error messages are sent back to the user.

    Example:
    - Send a document with the caption 'load' to load the document.
    - Send a document with the caption 'train' to load and train with the document.
    """
    document = Document(api_key)
    if message.document:
        # Get the complete document object
        doc = message.document
        file_id = doc.file_id

        try:
            # Get information about the file
            file_info = bot.get_file(file_id)

            # Get the file name
            file_name = file_info.file_path.split("/")[-1]

            # Create the path to save the file in the "downloads" folder
            downloads_dir = "downloads"
            os.makedirs(downloads_dir, exist_ok=True)
            file_path = os.path.join(downloads_dir, file_name)

            # Download the file
            file_content = bot.download_file(file_info.file_path)

            # Save the file locally or process it according to your needs
            with open(file_path, "wb") as file:
                file.write(file_content)

            # Now, you can load the document using your function
            if message.caption == 'load':
                try:
                    # Perform the loading operation
                    document.load(file_path)
                    success_message = "Load has been completed with the submitted document."
                    bot.send_message(message.chat.id, success_message)
                except Exception as e:
                    # Handle any errors and send an error message
                    error_message = f"Error during loading: {e}"
                    bot.send_message(message.chat.id, error_message)
            elif message.caption == 'train':
                try:
                    # Perform the loading and training operation
                    document.loadAndTraining(file_path)
                    success_message = "Load and training have been completed with the submitted document."
                    bot.send_message(message.chat.id, success_message)
                except Exception as e:
                    # Handle any errors and send an error message
                    error_message = f"Error during training: {e}"
                    bot.send_message(message.chat.id, error_message)

        except Exception as e:
            print(f"Error downloading the file: {e}")


@bot.message_handler(commands=['training'])
def trainingDocument(message):
    """
    Train with a specified document.

    Usage:
    - Send the command: /training document_id: [document_id]

    Parameters:
        - document_id (str): The ID of the document to use for training.

    Returns:
        A response object indicating the result of the training operation.

    Requirements:
        - Command: /training
        - Global variable: api_key

    Note:
    - Send the command with the document_id parameter to initiate training with the specified document.
    - Success or error messages are sent back to the user.

    Example:
    - Send the command: /training document_id: [document_id] to start training with the specified document.
    """
    document = Document(api_key)

    document_id_match = re.search(r'document_id\s*:\s*([^\s,]+)', message.text)
    
    if not document_id_match:
        bot.reply_to(message, "Document_id was not identified in the message.")
        return

    document_id = document_id_match.group(1)
    
    try:
        # Perform the training operation
        document.training(document_id)

        # If the operation is successful, send a confirmation message
        success_message = "Training has been completed with the submitted document."
        bot.send_message(message.chat.id, success_message)
    except Exception as e:
        # Handle any errors and send an error message
        error_message = f"Error during training: {e}"
        bot.send_message(message.chat.id, error_message)


st.success("Bot is running...")
bot.polling()
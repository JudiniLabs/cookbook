# Telegram CodeGPT Bot

This repository contains a Telegram bot that interacts with the CodeGPT service using the telebot Python library. The bot enables various actions related to agent management, document handling, and model training.

## Prerequisites

Before running the code, make sure you have the following:

- Python 3 installed
- `streamlit`, `telebot`, `judini` and `dotenv` libraries installed
- A Telegram API key and CodeGPT API key

Create a CodeGPT Plus account: https://account.codegpt.co

## Installation

Clone the repository:

```bash
git clone https://github.com/Brareyesb15/Telegram-Chatbot
```

### Install the required libraries:

```bash
pip install -r requirements.txt
```

Set up environment variables:
Create a .env file in the root directory of your project.

Add the following lines to the .env file:

- TELEGRAM_KEY=your-telegram-api-key
- CODEGPT_API_KEY=your-codegpt-api-key
- CODEGPT_AGENT_ID=your-codegpt-agent-id

## about the telegram bot

Setting Up Your Telegram Chatbot
If you don't have a Telegram chatbot yet:

Create a Telegram Account:

Sign up here.
Create a New Bot on BotFather:

Search for the BotFather on Telegram.
Use /newbot to create a bot.
Save the provided API token and add it to your .env file as telegram_key.

## Run the code:

```bash
streamlit run app.py
```

## FUNCIONALITY

1. Basic Functionality
   The Telegram bot offers the following main functions:

Chat Completion

To leverage the message completion function, initiate a chat with the bot and start your message with /bot followed by the content you want to complete.

Change Agent

Switch the current agent by using the /change_agent_id command followed by the new agent ID.

Get User Data

Retrieve information associated with your CodeGPT instance using the /get_my_data command.

Get All Agents

Obtain details about all available agents by using the /get_all_agent command.

Get Agent by ID

Retrieve specific agent details by using the /get_agent_by_id [agent_id] command.

Update Agent

Update an agent's information by employing the /update_agent command with the desired parameters.

Link Document

Link a document to a specific agent with the /link_document agent_id: [agent_id] document_id: [document_id] command.

Unlink Document

Unlink a document from a specific agent using the /unlink_document agent_id: [agent_id] document_id: [document_id] command.

## Additional Functions

## Decorators

The bot utilizes Python decorators to handle different commands and message types. Decorators such as @bot.message_handler are applied to functions to specify how they should handle incoming messages. Understanding decorators is crucial for extending or modifying the bot's functionality.

## Document Handling

The bot supports handling documents for loading or training. Send a document with the caption 'load' to perform loading or 'train' to perform loading and training.

Example:

Send a document with the caption 'load' to load the document.
Send a document with the caption 'train' to load and train with the document.
Training with a Specific Document
Initiate training with a specified document using the /training command with the parameter document_id: [document_id].

Please ensure you have the required environment variables set, such as TELEGRAM_KEY, CODEGPT_API_KEY, and CODEGPT_AGENT_ID, before running the bot.

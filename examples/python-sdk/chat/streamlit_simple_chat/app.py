import streamlit as st
import time
import json
import os

#import judini sdk
from judini.codegpt.chat import Completion
from dotenv import load_dotenv
load_dotenv()


# CodeGPT Plus
api_key_env = os.getenv("CODEGPT_API_KEY")
agent_id_env = os.getenv("CODEGPT_AGENT_ID")

# layout
st.set_page_config(layout="centered")  
st.title("Streamlit simple chat 🙂 💬 🤖")
st.write('Powered by <a href="https://www.codegpt.co/">CodeGPT</a>', unsafe_allow_html=True)
st.divider()

# sidebar
st.sidebar.title("Configuration")
api_key = st.sidebar.text_input("CodeGPT Plus API key", value=api_key_env, type="password")
agent_id = st.sidebar.text_input(f"Agent ID", value=agent_id_env)

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("En que te puedo ayudar?"):

    # Define messages
    messages = { "role": "user", "content": prompt }

    # Add user message to chat history
    st.session_state.messages.append(messages)

    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        # Initialize variables
        message_placeholder = st.empty()
        full_response = ""

        # Initialize Completion instance
        completion  =  Completion(api_key)
        # Get completion
        response = completion.create(agent_id, messages)

        # Show the answer with chat effect
        for line in response:
            if line:
                try:
                    full_response += str(line)
                    time.sleep(0.01)
                    # Add a blinking cursor to simulate typing
                    message_placeholder.markdown(full_response + "▌")
                except json.JSONDecodeError:
                    print(f'Error : {line}')
                            
        message_placeholder.markdown(full_response)
    st.session_state.messages.append({"role": "assistant", "content": full_response})
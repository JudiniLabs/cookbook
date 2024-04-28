import streamlit as st
import time
import os
from judini.codegpt import CodeGPTPlus
from dotenv import load_dotenv
load_dotenv()

api_key= os.getenv("CODEGPT_API_KEY")
agent_id= os.getenv("CODEGPT_AGENT_ID")
org_id = os.getenv("ORG_ID")
st.set_page_config(layout="centered")

st.title("Simple Streamlit Chat: CodeGPT Agent 🤖")
st.markdown('---')
# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("How can I help you?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        with st.spinner('Wait for it...'):
            message_placeholder = st.empty()
            full_response = ""

            codegpt = CodeGPTPlus(api_key=api_key, org_id=org_id)
            messages = st.session_state.messages

            response_completion = codegpt.chat_completion(agent_id=agent_id,
                               messages=messages, stream=True) #yout could use stream=False
            for response in response_completion:
                time.sleep(0.05)
                full_response += (response or "")
                message_placeholder.markdown(full_response + "▌")       
            message_placeholder.markdown(full_response)
    st.session_state.messages.append({"role": "assistant", "content": full_response})
    

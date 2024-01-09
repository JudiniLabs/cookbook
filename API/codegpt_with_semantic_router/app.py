from dotenv import load_dotenv
import os

from semantic_router import Route
from semantic_router.encoders import CohereEncoder
from semantic_router.layer import RouteLayer

from judini.codegpt.chat import Completion
import streamlit as st
import time

# Load environment variables from .env file
load_dotenv()

# CodeGPT Agents
api_key= os.getenv("CODEGPT_API_KEY")
agent_id= os.getenv("CODEGPT_AGENT_ID")
os.environ["COHERE_API_KEY"] = os.getenv("COHERE_API_KEY")

# create the encoder
encoder = CohereEncoder()

# we could use this as a guide for our chatbot to avoid political conversations
politics = Route(
    name="politics",
    utterances=[
        "isn't politics the best thing ever",
        "why don't you tell me about your political opinions",
        "don't you just love the president" "don't you just hate the president",
        "they're going to destroy this country!",
        "they will save the country!",
    ],
)

# we place both of our decisions together into single list
routes = [politics]

st.set_page_config(layout="centered")
st.title("CodeGPT Agent with Semantic Router ⚠️")
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
    rl = RouteLayer(encoder=encoder, routes=routes)
    route = rl(prompt).name
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
            prompt = st.session_state.messages

            if(route == 'politics'):
                response_completion = "I can't talk about politics"
            else:
                completion = Completion(api_key)
                response_completion = completion.create(agent_id, prompt, stream=False)

            for response in response_completion:
                time.sleep(0.05)
                full_response += (response or "")
                message_placeholder.markdown(full_response + "▌")       
            message_placeholder.markdown(full_response)
    st.session_state.messages.append({"role": "assistant", "content": full_response})

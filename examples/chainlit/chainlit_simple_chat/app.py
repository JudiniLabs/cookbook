import chainlit as cl
from judini.codegpt import CodeGPTPlus
import os
import streamlit as st
import time
from dotenv import load_dotenv
load_dotenv()

api_key= os.getenv("CODEGPT_API_KEY")
agent_id= os.getenv("CODEGPT_AGENT_ID")
org_id = os.getenv("ORG_ID")

@cl.on_chat_start
def start_chat():
    cl.user_session.set(
        "message_history",
        []
    )

@cl.on_message
async def main(message: cl.Message):
    msg = cl.Message(content="", author="Assistant")
    
    codegpt = CodeGPTPlus(api_key=api_key, org_id=org_id)
    messages = [{"role": "user", "content": message.content}]

    res = await codegpt.chat_completion(agent_id=agent_id,
                        messages=messages, stream=True) #yout could use stream=False

    for token in res.response_gen:
        await msg.stream_token(token)
    await msg.send()

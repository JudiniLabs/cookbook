import chainlit as cl
from judini.codegpt.chat import Completion
import os
import time
from dotenv import load_dotenv
load_dotenv()

api_key= os.getenv("CODEGPT_API_KEY")
agent_id= os.getenv("CODEGPT_AGENT_ID")

@cl.on_chat_start
def start_chat():
    cl.user_session.set(
        "message_history",
        [{"role": "system", "content": "You are a helpful assistant."}],
    )


@cl.on_message
async def main(message: cl.Message):
    message_history = cl.user_session.get("message_history")
    message_history.append({"role": "user", "content": message})

    msg = cl.Message(content="")
    await msg.send()

    completion = Completion(api_key)
    stream = completion.create(agent_id, prompt=message_history, stream=False)

    token = ''
    for part in stream:
        token += part

    message_history.append({"role": "assistant", "content": msg.content})
    await cl.Message(
        content=token,
    ).send()

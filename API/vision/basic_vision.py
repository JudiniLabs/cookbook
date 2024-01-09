from langchain.chat_models import ChatOpenAI
from langchain.schema.messages import HumanMessage
from dotenv import load_dotenv
load_dotenv()

chat = ChatOpenAI(model="gpt-4-vision-preview", max_tokens=256)
chat.invoke(
    [
        HumanMessage(
            content=[
                {"type": "text", "text": "What is this image showing"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://raw.githubusercontent.com/langchain-ai/langchain/master/docs/static/img/langchain_stack.png",
                        "detail": "auto",
                    },
                },
            ]
        )
    ]
)
import cv2
import time
import base64
from langchain.chat_models import ChatOpenAI
from langchain.schema.messages import HumanMessage, SystemMessage

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

cap = cv2.VideoCapture(2)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    filename = 'image.png'
    cv2.imwrite(filename, frame)

    base64_image = encode_image(filename)
    
    chat = ChatOpenAI(model="gpt-4-vision-preview", max_tokens=256)

    output = chat.invoke(
        [
            HumanMessage(
                content=[
                    {
                        "type": "text", 
                        "text": "Narrate in one line. Don't repeat. Focus on Details"
                    },
                    {
                        "type": "image_url",
                        "image_url": f"data:image/png;base64,{base64_image}"
                    },
                ]
            )
        ]
    )

    print(output)

    time.sleep(2)

cap.release()
cv2.destroyAllWindows()
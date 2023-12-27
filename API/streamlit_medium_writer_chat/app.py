import streamlit as st
import asyncio
import time
import requests
import json
import os
from judini.codegpt.agent import Agent
from dotenv import load_dotenv
load_dotenv()

# CodeGPT Plus
CODEGPT_API_KEY = os.getenv("CODEGPT_API_KEY")
CODEGPT_AGENT_ID = os.getenv("CODEGPT_AGENT_ID")
CODEGPT_MEDIUM_AGENT_ID = os.getenv("CODEGPT_MEDIUM_AGENT_ID")
MEDIUM_TOKEN = os.getenv("MEDIUM_TOKEN")

# layout
st.set_page_config(layout="centered")
st.title("Agent Writer for Medium 📝🤖")
st.write("Engage with your agent on the topic on which you wish to create an article. Once the discussion is finished, instruct your agent to publish the article on Medium. Ensure you have a valid Medium Developer Token for this task.")
st.write('Powered by <a href="https://plus.codegpt.co/">CodeGPT Plus</a>', unsafe_allow_html=True)
st.divider()

# codegpt sidebar
st.sidebar.title("CodeGPT settings")
api_key = st.sidebar.text_input("CodeGPT Plus API key", value=CODEGPT_API_KEY, type="password")
if(api_key):
    codegpt_agent_id = st.sidebar.text_input(f"Agent ID", value=CODEGPT_AGENT_ID)

# medium sidebar
st.sidebar.title("Medium settings")
medium_token = st.sidebar.text_input("Medium Token", value=MEDIUM_TOKEN, type="password")
notify_followers = st.sidebar.checkbox("Notify Followers", value=False)
publish_status = st.sidebar.selectbox(
    'Publish Status',
    ('public', 'draft', 'unlisted')
)

# functions
async def run_function_agent(agent_id, prompt):
    agent_instance = Agent(api_key=api_key,agent_id=agent_id)
    full_response = ""
    async for response in agent_instance.chat_completion(prompt, stream=False):
        full_response += response
    try:
        json_response = json.loads(full_response)
        return json_response
    except json.JSONDecodeError:
        json_response = full_response
    return json_response

def medium_publish():
    published = False
    article_url = ""
    title = ""
    
    data = {"messages": st.session_state.messages + [{"role": "user", "content": '''
                                                        Write an article with the central topic of this conversation. Make sure it has a title, introduction, development and conclusion. Write everything in markdown. 
                                                        
                                                        Provide the information in the following json format:
                                                        {
                                                            "title": "Example title",
                                                            "content": "Example Content",
                                                            "tags":["example1", "example2", "example3"]
                                                        }
                                                        '''}]}
    url = 'https://plus.codegpt.co/api/v1/agent/'+codegpt_agent_id
    headers = {"Content-Type": "application/json; charset=utf-8", "Authorization": "Bearer "+api_key}
    # session messages
    full_response_article = ''
    response = requests.post(url, headers=headers, json=data, stream=True)
    for chunk in response.iter_content(chunk_size=1024):
        if chunk:
            raw_data = chunk.decode('utf-8').replace("data: ", '')
            for line in raw_data.strip().splitlines():
                if line and line != "[DONE]":
                    try:
                        full_response_article += json.loads(line)['data']
                    except json.JSONDecodeError:
                        print(f'Error : line')
    clean_article = full_response_article.replace("```json", "").replace("```", "")
    
    # JSON
    json_article = json.loads(clean_article)
    # get "title"
    title = json_article['title']
    # get "content"
    content = json_article['content']
    # get "content"
    tags = json_article['tags']

    
    # get medium userID
    url_me = 'https://api.medium.com/v1/me'
    headers = {
        "Authorization": "Bearer "+medium_token,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Charset": "utf-8"
    }
    medium_me_response = requests.get(url_me, headers=headers)
    medium_me_response_json = medium_me_response.json()
    medium_user_id = medium_me_response_json['data']['id']
    
    # create article
    url_post = "https://api.medium.com/v1/users/"+medium_user_id+"/posts"
    data = {
        "title": title,
        "contentFormat": "markdown",
        "content": content,
        "publishStatus": publish_status,
        "notifyFollowers": notify_followers,
        "license": "all-rights-reserved"
    }
    medium_response = requests.post(url_post, headers=headers, json=data)
    m_response = medium_response.json()

    if medium_response.status_code == 201:
        published = True
        article_url = m_response['data']['url']
        title = m_response['data']['title']
    
    return {
            "published": published,
            "article_url": article_url,
            "title": title
            }
    
    
    
# Streamlit Chat
# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("Let's write an article"):

    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display assistant response in chat message container
    with st.chat_message("assistant"):

        with st.status("Wait a moment...", expanded=True) as status:
            full_response = ""
            message_placeholder = st.empty()
            is_function = False
            response = asyncio.run(run_function_agent(CODEGPT_MEDIUM_AGENT_ID, prompt))
            if(response != ""):
                status.update(label="Medium Agent", state="running", expanded=True)
                function_name = response["function"]["name"]
                if(function_name == "medium_api_agent"):
                    article = medium_publish()
                    if(article["published"]):
                        full_response='The article "'+article['title']+'" was successfully published. URL: '+article['article_url']
                        message_placeholder.markdown(full_response)
                        st.session_state.messages.append({"role": "assistant", "content": full_response})
                    else:
                        message_placeholder.write("Error")
                        full_response="Error"
            else:
                # Add user message to chat history
                st.session_state.messages.append({"role": "user", "content": prompt})
                
                status.update(label="Regular Agent", state="running", expanded=True)
                message_placeholder = st.empty()
                url = 'https://plus.codegpt.co/api/v1/agent/'+codegpt_agent_id
                headers = {"Content-Type": "application/json; charset=utf-8", "Authorization": "Bearer "+api_key}
                # session messages
                data = { "messages": st.session_state.messages }

                response = requests.post(url, headers=headers, json=data, stream=True)
                raw_data = ''
                tokens = ''
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        raw_data = chunk.decode('utf-8').replace("data: ", '')
                        if raw_data != "":
                            lines = raw_data.strip().splitlines()
                            for line in lines:
                                line = line.strip()
                                if line and line != "[DONE]":
                                    try:
                                        json_object = json.loads(line) 
                                        result = json_object['data']
                                        full_response += result
                                        time.sleep(0.05)
                                        # Add a blinking cursor to simulate typing
                                        message_placeholder.markdown(full_response + "▌")
                                    except json.JSONDecodeError:
                                        print(f'Error : {line}')
                message_placeholder.markdown(full_response)
            st.session_state.messages.append({"role": "assistant", "content": full_response})
            

            
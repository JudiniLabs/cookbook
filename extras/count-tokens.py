import streamlit as st
import fitz  # PyMuPDF
import tiktoken


def pdf_to_text(pdf_file):
    """Extracts text from an uploaded PDF file."""
    document = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page in document:
        text += page.get_text()
    document.close()
    return text

def count_tokens(text: str, model: str) -> int:
    """
    Count the number of tokens in a given text using the appropriate encoding for the specified model.
    """
    # Load the appropriate encoding for the specified model
    encoding = tiktoken.encoding_for_model(model)
    # Encode the text and count the tokens
    tokens = encoding.encode(text)
    return len(tokens)

st.title('PDF File Tokens Counter')

# Load PDF file
pdf_file = st.file_uploader("Upload a PDF file", type=['pdf'])
# Verify the file size
if pdf_file is not None:
    file_size_mb = pdf_file.size / (1024 * 1024)  # Convert bytes to MB
    if file_size_mb > 20:
        st.error("The file exceeds 20 MB. Please upload a smaller file.")
        pdf_file = None  # Prevent the file from being processed

# Select tokenization model
model = st.selectbox(
    "Choose the tokenization model",
    ["text-embedding-ada-002", "gpt-4-turbo"]
)


if pdf_file is not None and model is not None:
    pdf_text = pdf_to_text(pdf_file)
    token_count = count_tokens(pdf_text, model)

    # Check if the file has more than 2,000,000 tokens
    if token_count > 2000000:
        st.error("The file contains more than 2,000,000 tokens and cannot be processed.")
    else:
        st.write(f"The PDF file contains {token_count} tokens according to the {model} model.")
else:
    st.write("Please upload a PDF file and choose a model to count the tokens.")
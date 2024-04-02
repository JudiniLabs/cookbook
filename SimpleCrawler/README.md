SimpleCrawler README

Overview

SimpleCrawler is a Python script designed to perform basic web scraping operations. It navigates through web pages starting from a given URL, following links up to a specified depth, and logs the content of each visited page. The script is built to handle concurrent requests using threading, which speeds up the scraping process.

Features
Configurable starting URL and scraping depth
Thread-safe set modification to track visited URLs
Concurrent scraping with ThreadPoolExecutor
Session retries with backoff for handling request failures
Proxy support through environment variables
User-Agent customization for HTTP requests
Logging of scraping activities and errors
Requirements
Python 3.x
requests library
beautifulsoup4 library
concurrent.futures module (included in Python 3.2 and above)
dotenv library (optional for loading environment variables)

Installation
Before running the script, ensure you have Python 3 installed on your system. You can then install the required Python libraries using pip:



pip install requests beautifulsoup4 python-dotenv


Usage
Set the start_url variable in the main function to the URL you want to start scraping from.
(Optional) Create a .env file in the same directory as the script to define HTTP_PROXY and HTTPS_PROXY if you are behind a proxy.
Run the script using the following command:


python app.py


Configuration
You can configure the following settings in the SimpleCrawler class:

start_url: The URL where the crawler will begin scraping.
max_depth: The maximum depth of links the crawler will follow from the starting URL.
max_threads: The maximum number of threads to use for concurrent scraping.
Logging
The script uses Python's built-in logging module to log its activities. By default, it logs informational messages to the console. You can adjust the logging level and format by modifying the logging.basicConfig call.

Disclaimer
Web scraping can be against the terms of service of some websites. Always check the website's robots.txt file and terms of service before scraping. Use this script responsibly and ethically.

License
This script is provided "as is", without warranty of any kind. You may use, modify, and distribute it under the terms of the MIT License.

This README provides a basic introduction to the SimpleCrawler script. For more detailed information on the implementation and customization, refer to the script's source code and comments.
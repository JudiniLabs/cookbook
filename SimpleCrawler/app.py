import os
import logging
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor
from requests.exceptions import RequestException
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from dotenv import load_dotenv
from threading import Lock

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.INFO
)

class SimpleCrawler:
    def __init__(self, start_url, max_depth=3, max_threads=5):
        self.start_url = start_url
        self.max_depth = max_depth
        self.visited = set()
        self.max_threads = max_threads
        self.session = self.create_session()
        self.lock = Lock()  # Lock for thread-safe set modification

    def create_session(self):
        session = requests.Session()
        session.headers.update({'User-Agent': 'SimpleCrawler/1.0'})

        # Load proxy settings from environment variables
        http_proxy = os.getenv('HTTP_PROXY')
        https_proxy = os.getenv('HTTPS_PROXY')
        proxies = {
            'http': http_proxy,
            'https': https_proxy,
        }
        if http_proxy or https_proxy:
            session.proxies.update(proxies)

        retries = Retry(
            total=5,
            backoff_factor=1,
            status_forcelist=[500, 502, 503, 504]
        )
        session.mount('http://', HTTPAdapter(max_retries=retries))
        session.mount('https://', HTTPAdapter(max_retries=retries))
        return session

    def scrape_website(self, url, depth=0):
        if depth > self.max_depth:
            return
        with self.lock:  # Acquire lock before modifying the set
            if url in self.visited:
                return
            self.visited.add(url)
        logging.info(f"Scraping {url}")

        try:
            response = self.session.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')
            plain_text = soup.get_text(separator='\n', strip=True)
            logging.debug(f"Content from {url}:\n{plain_text}\n")  # Changed to debug level

            links = [urljoin(url, link['href']) for link in soup.find_all('a', href=True)]
            links = [link for link in links if link not in self.visited]  # Removed redundant urljoin

            with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
                futures = [executor.submit(self.scrape_website, link, depth + 1) for link in links]
                for future in futures:
                    future.result()

        except RequestException as e:
            logging.error(f"An error occurred while scraping {url}: {e}")

def main():
    start_url = 'https://developers.codegpt.co/'  # Replace with your target URL
    crawler = SimpleCrawler(start_url, max_depth=3, max_threads=10)
    crawler.scrape_website(start_url)

if __name__ == "__main__":
    main()
# Required imports
from urllib.request import urlopen
from bs4 import BeautifulSoup
import ollama
import chromadb
# works better: https://www.youtube.com/watch?v=kTXzPLvroLY&t=836s
# 1. Website scraping function
def scrape_website(url):
    html = urlopen(url).read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text content with paragraph splitting
    text = soup.get_text(separator="\n\n", strip=True)
    return text

# 2. Text chunking (simple example)
def chunk_text(text, chunk_size=500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

# 3. Initialize ChromaDB
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="website_embeddings")

# 4. Main processing
def process_website(url):
    # Scrape and chunk content
    text = scrape_website(url)
    chunks = chunk_text(text)

    # Generate and store embeddings
    for idx, chunk in enumerate(chunks):
        # Generate embedding using Ollama
        response = ollama.embed(
            model="mxbai-embed-large",
            input=chunk
        )

        # Store in ChromaDB
        collection.add(
            ids=[str(idx)],
            embeddings=[response["embedding"]],
            documents=[chunk],
            metadatas=[{"source": url}]
        )

    print(f"Stored {len(chunks)} chunks from {url}")

# Example usage
process_website("http://olympus.realpython.org/profiles/aphrodite")

# Query similar content
def query_similar(text):
    embedding = ollama.embed(
        model="mxbai-embed-large",
        input=text
    )["embedding"]

    results = collection.query(
        query_embeddings=[embedding],
        n_results=3
    )
    return results

print(query_similar("Greek goddess of love"))
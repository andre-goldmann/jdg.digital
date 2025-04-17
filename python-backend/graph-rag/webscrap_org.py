 #Collecting the data
 import requests
 from bs4 import BeautifulSoup
 import re

  urls = [
    "https://en.wikipedia.org/wiki/Space_exploration",
    "https://en.wikipedia.org/wiki/Apollo_program",
    "https://en.wikipedia.org/wiki/Hubble_Space_Telescope",
    "https://en.wikipedia.org/wiki/Mars_over",
    "https://en.wikipedia.org/wiki/International_Space_Station",
    "https://en.wikipedia.org/wiki/SpaceX",
    "https://en.wikipedia.org/wiki/Juno_(spacecraft)",
    "https://en.wikipedia.org/wiki/Voyager_program",
    "https://en.wikipedia.org/wiki/Galileo_(spacecraft)",
    "https://en.wikipedia.org/wiki/Kepler_Space_Telescope"
 ]

 def clean_text(content):
    # Remove references that usually appear as [1], [2], etc.
    content = re.sub(r'\[\d+\]', '', content)
    return content

 def fetch_and_clean(url):
    # Fetch the content of the URL
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    # Find the main content of the article, ignoring side boxes and headers
    content = soup.find('div', {'class': 'mw-parser-output'})
    # Remove the bibliography section, which generally follows a header like 
"References", "Bibliography"
    for section_title in ['References', 'Bibliography', 'External links', 'See 
also']:
        section = content.find('span', id=section_title)
        if section:
            # Remove all content from this section to the end of the document
            for sib in section.parent.find_next_siblings():
                sib.decompose()
            section.parent.decompose()
    # Extract and clean the text
    text = content.get_text(separator=' ', strip=True)
    text = clean_text(text)
    return text

 # File to write the clean text
 with open('llm.txt', 'w', encoding='utf-8') as file:
    for url in urls:
        clean_article_text = fetch_and_clean(url)
        file.write(clean_article_text + '\n')
 print("Content written to llm.txt")    

  # Open the file and read the first 20 lines
 with open('llm.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()
    # Print the first 20 lines
    for line in lines[:20]:
        print(line.strip())


#Retrieving a batch of prepared documents
 from grequests import download
 source_text = "llm.txt"
 directory = "Chapter02"
 filename = "llm.txt"
 download(directory, filename)


 # Open the file and read the first 20 lines
 with open('llm.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()
 # Print the first 20 lines
 for line in lines[:20]:
 print(line.strip())         

  with open(source_text, 'r') as f:
    text = f.read()
 CHUNK_SIZE = 1000
 chunked_text = [text[i:i+CHUNK_SIZE] for i in range(0,len(text), CHUNK_SIZE)

  #Verifying if the vector store exists and creating it if not
  from deeplake.core.vectorstore.deeplake_vectorstore import VectorStore
 import deeplake.util
 try:
    # Attempt to load the vector store
    vector_store = VectorStore(path=vector_store_path)
    print("Vector store exists")
 except FileNotFoundError:
    print("Vector store does not exist. You can create it.")
    # Code to create the vector store goes here
    create_vector_store=Tru

def embedding_function(texts, model="text-embedding-3-small"):
   if isinstance(texts, str):
       texts = [texts]
   texts = [t.replace("\n", " ") for t in texts]
   return [data.embedding for data in openai.embeddings.create(input = texts, 
model=model).data]    

 add_to_vector_store=True
 if add_to_vector_store == True:
    with open(source_text, 'r') as f:
        text = f.read()
        CHUNK_SIZE = 1000
        chunked_text = [text[i:i+1000] for i in range(0, len(text), CHUNK_
 SIZE)]
 vector_store.add(text = chunked_text,
              embedding_function = embedding_function,
              embedding_data = chunked_text,
              metadata = [{"source": source_text}]*len(chunked_text))
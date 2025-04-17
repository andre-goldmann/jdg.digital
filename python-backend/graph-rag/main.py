import os
from typing import List

from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_neo4j import Neo4jGraph
# from yfiles_jupyter_graphs import GraphWidget
from langchain_community.vectorstores import Neo4jVector
from langchain_community.vectorstores.neo4j_vector import remove_lucene_chars
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_ollama import ChatOllama
from langchain_ollama import OllamaEmbeddings
from neo4j import GraphDatabase
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.graphs.graph_document import GraphDocument
load_dotenv()


graph = Neo4jGraph()

model = "gemma2:2b" #"llama3.1"
#model = "gemini-1.5-flash" #"gemini-2.0-flash" "gemini-2.0-flash-lite"

llm = ChatOllama(model=model, temperature=0, format="json")
# does work but ResourceExhausted: 429 You exceeded your current quota,
# please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits
#llm = ChatGoogleGenerativeAI(
#    model=model,
#    temperature=0,
#    #convert_system_message_to_human=True,
#    model_kwargs={"response_format": {"type": "json_object"}}
#)
llm_transformer = LLMGraphTransformer(llm=llm)

embeddings = OllamaEmbeddings(
    model="mxbai-embed-large",
)

vector_index = Neo4jVector.from_existing_graph(
    embeddings,
    search_type="hybrid",
    node_label="Document",
    text_node_properties=["text"],
    embedding_node_property="embedding"
)
vector_retriever = vector_index.as_retriever()


driver = GraphDatabase.driver(
    uri = os.environ["NEO4J_URI"],
    auth = (os.environ["NEO4J_USERNAME"],
            os.environ["NEO4J_PASSWORD"]))

def create_fulltext_index(tx):
    query = '''
    CREATE FULLTEXT INDEX `fulltext_entity_id` 
    FOR (n:__Entity__) 
    ON EACH [n.id];
    '''
    tx.run(query)

# Function to execute the query
def create_index():
    with driver.session() as session:
        session.execute_write(create_fulltext_index)
        print("Fulltext index created successfully.")

class Entities(BaseModel):
    """Identifying information about entities."""

    names: list[str] = Field(
        ...,
        description="All the person, organization, or business entities that "
                    "appear in the text",
    )

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are extracting organization and person entities from the text.",
        ),
        (
            "human",
            "Use the given format to extract information from the following "
            "input: {question}",
        ),
    ]
)


def generate_full_text_query(input: str) -> str:
    words = [el for el in remove_lucene_chars(input).split() if el]
    if not words:
        return ""
    full_text_query = " AND ".join([f"{word}~2" for word in words])
    print(f"Generated Query: {full_text_query}")
    return full_text_query.strip()

entity_chain = llm.with_structured_output(Entities)
# Fulltext index query
def graph_retriever(question: str) -> str:
    """
    Collects the neighborhood of entities mentioned
    in the question
    """
    result = ""
    entities = entity_chain.invoke(question)
    for entity in entities.names:
        response = graph.query(
            """CALL db.index.fulltext.queryNodes('fulltext_entity_id', $query, {limit:2})
            YIELD node,score
            CALL {
              WITH node
              MATCH (node)-[r:!MENTIONS]->(neighbor)
              RETURN node.id + ' - ' + type(r) + ' -> ' + neighbor.id AS output
              UNION ALL
              WITH node
              MATCH (node)<-[r:!MENTIONS]-(neighbor)
              RETURN neighbor.id + ' - ' + type(r) + ' -> ' +  node.id AS output
            }
            RETURN output LIMIT 50
            """,
            {"query": entity},
        )
        result += "\n".join([el['output'] for el in response])
    return result

def full_retriever(question: str):
    graph_data = graph_retriever(question)
    vector_data = [el.page_content for el in vector_retriever.invoke(question)]
    final_data = f"""Graph data:
{graph_data}
vector data:
{"#Document ". join(vector_data)}
    """
    return final_data


template = """Answer the question based only on the following context:
{context}

Question: {question}
Use natural language and be concise.
Answer:"""

if __name__ == '__main__':
    # Delete graph:
    #graph.query("MATCH (n) DETACH DELETE n")
    '''try:
        create_index()
        print("Index created...")
    except:
        print("Index not created maybe exists allready")
        pass

    loader = TextLoader(file_path="dummytext.txt")
    docs = loader.load()
    print("Docs loadd")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=250, chunk_overlap=24)
    documents = text_splitter.split_documents(documents=docs)
    print("Document splitted to " +str(len(documents)) + " documents")

    # use it with remote model
    #graph_documents = llm_transformer.convert_to_graph_documents(documents)
    # to see progress:
    graph_documents = []
    for document in documents:
        print(document)
        graph_documents.append(llm_transformer.process_response(document))
    print("Graph created")

    graph.add_graph_documents(
        graph_documents,
        baseEntityLabel=True,
        include_source=True
    )
    print("Documents added to graph")
'''

    print(graph_retriever("Who is Nonna Lucia?"))
    #entity_chain.invoke("Who are Nonna Lucia and Giovanni Caruso?")


    prompt = ChatPromptTemplate.from_template(template)

    chain = (
            {
                "context": full_retriever,
                "question": RunnablePassthrough(),
            }
            | prompt
            | llm
            | StrOutputParser()
    )

    output = chain.invoke(input="Who is Nonna Lucia? Did she teach anyone about restaurants or cooking?")
    print(output)

    driver.close()

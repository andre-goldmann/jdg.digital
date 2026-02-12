from litellm import completion
import os

## set ENV variables
#os.environ["OPENROUTER_API_KEY"] = "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"

#response = completion(
#    #model="openrouter/deepseek/deepseek-r1-0528:free",
#    #model="openrouter/google/gemma-3-27b-it:free",
#    model="openrouter/allenai/molmo-2-8b:free",
#    messages = [{ "content": "Hello, how are you?","role": "user"}],
#)

import time

start_time = time.time()
response = completion(
    model="ollama/phi3:medium",
    messages = [{ "content": "Hello, how are you?","role": "user"}],
    api_base="http://localhost:11434"
)
end_time = time.time()

print(response)

print(f"Execution time: {end_time - start_time:.2f} seconds")
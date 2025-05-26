# Context7 Integration with n8n

This document explains how to set up and use the Context7 integration with n8n for enhanced AI workflows.

## Prerequisites

1. [Context7](https://upstash.com/context7) account and API key
2. [OpenRouter](https://openrouter.ai/) account and API key
3. n8n installed and running

## Setup Instructions

### 1. Configure API Keys

Before using the workflow, update the following variables in the "Set Configuration Variables" node:

- `context7_api_key` - Your Context7 API key from Upstash
- `context7_index_id` - The ID of your Context7 index
- `openrouter_api_key` - Your OpenRouter API key

### 2. Configure n8n Credentials

In n8n:
1. Go to Settings → Credentials
2. Add a new "OpenRouter API" credential with your API key
3. Add a new "HTTP Header Auth" credential for Context7 with the following:
   - Name: Context7 API
   - Auth Key: Authorization
   - Auth Value: Bearer your_context7_api_key

## How the Workflow Works

This workflow enhances LLM queries with relevant context from your Context7 index:

1. **Set Configuration Variables**: Defines all necessary API keys and parameters.
2. **Search Context7**: Sends the user query to Context7 to retrieve relevant context.
3. **Format Context**: Processes and formats the Context7 search results.
4. **Construct Prompt**: Combines the user query with the retrieved context.
5. **OpenRouter API Call**: Sends the enhanced prompt to the LLM.
6. **Display Response**: Shows the LLM's response.

## Use Cases

### 1. Question Answering with Private Data

Example query: "What are our Q1 sales figures?"

The workflow will:
- Search your Context7 index for Q1 sales data
- Provide this context to the LLM
- Generate an accurate response based on your private data

### 2. Technical Support

Example query: "How do I fix the printer connection issue?"

The workflow will:
- Find relevant troubleshooting guides in your Context7 index
- Provide this context to the LLM
- Generate specific instructions based on your documentation

### 3. Knowledge Base Queries

Example query: "What is our company policy on remote work?"

The workflow will:
- Retrieve policy documents from your Context7 index
- Provide this context to the LLM
- Generate an accurate summary of your company's remote work policy

## Customization

You can customize the workflow by:

1. Adjusting the Context7 search parameters:
   - Change the `limit` value to retrieve more or fewer results
   - Set `includeMetadata` to control whether metadata is included

2. Modifying the system prompt:
   - Update the `system_message` in the Set Configuration Variables node

3. Enhancing the context formatting:
   - Edit the "Format Context" function to change how context is presented

4. Adding additional processing steps:
   - Insert nodes between existing ones for more complex processing

## Troubleshooting

If you encounter issues:

1. **No Context Retrieved**: 
   - Verify your Context7 API key and index ID
   - Check that your index contains relevant data
   - Try a different query that matches your indexed content

2. **LLM Not Using Context**:
   - Adjust the system prompt to explicitly instruct the LLM to use the provided context
   - Format the context more clearly

3. **Rate Limiting**:
   - Implement delay nodes if you're hitting API rate limits

## Keeping Context7 Up-to-Date

For the best results, ensure your Context7 index is regularly updated with your latest information using the Upstash dashboard or API.

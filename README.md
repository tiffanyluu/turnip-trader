# Turnip Trader  

Turnip Trader is an AI-powered turnip price simulator and advisor for *Animal Crossing*.  
It combines simulation of in-game price patterns with **RAG (Retrieval-Augmented Generation)** over community trading guides to generate practical advice on when to buy or sell.  

## Features  

- **Turnip Price Simulation**: Generate a full week of realistic prices based on in-game mechanics.  
- **RAG System**: Retrieve strategies and insights from a vector database of community guides.  
- **LLM-Powered Advice**: Combine your simulated week with retrieved guides for personalized recommendations.  
- **Vector Database**: PostgreSQL with pgvector stores embeddings of trading guides for semantic search.  

## Tech Stack  

- **Frontend**: React + TypeScript  
- **Backend**: Node.js + Express  
- **Database**: PostgreSQL + pgvector  
- **AI**: OpenAI GPT models for advice generation  

## How It Works  

1. **Simulate Prices** – The app generates a week of turnip prices using known ACNH price patterns.  
2. **Formulate Query** – Your simulated week is turned into a natural-language query about strategy.  
3. **Retrieve Guides** – Relevant community strategies are pulled from a vector database.  
4. **Generate Advice** – An LLM combines simulation + guides to provide actionable recommendations.  

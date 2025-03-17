    # Base image - using Node.js as this is a JavaScript project
    FROM node:20-slim

    # Install curl for healthcheck and bash for interactive shell
    RUN apt-get update && apt-get install -y curl bash

    # Set working directory in the container
    WORKDIR /app

    # Copy package.json and package-lock.json first to leverage Docker cache
    COPY package*.json ./

    # Install dependencies
    RUN npm install
    RUN npm install node-fetch@2

    # Copy the rest of the application
    COPY . .
    COPY sqlModel /app/sqlModel
    COPY public /app/public

    # Expose port (adjust as needed based on your application)
    EXPOSE 13500

    # Command to run the application
    CMD ["npm", "run", "dev"]

    # Add setup instructions as comments
    # After container is running, execute these commands:
    # 1. Get into the container:
    #    docker exec -it ia-project-ollama-1 bash
    #
    # 2. Pull the base model:
    #    ollama pull qwen2.5-coder:0.5b-instruct
    #
    # 3. Create custom model:
    #    ollama create sql-model -f /app/sqlModel
FROM node:20-slim

RUN apt-get update && apt-get install -y curl bash

# Install Ollama CLI (replace the following with the official installation commands)
RUN curl -fsSL https://ollama.com/install.sh | sh

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install node-fetch@3

COPY . .


EXPOSE 13500

CMD ["npm", "run", "dev"]
#ollama pull qwen2.5-coder:0.5b-instruct
#ollama create sql-model -f /app/sqlModel
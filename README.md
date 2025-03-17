# IA Project - Conversor de Linguagem Natural para SQL

## Sobre o Projeto
Este projeto é uma API que utiliza inteligência artificial para converter linguagem natural em consultas SQL. O sistema utiliza o modelo Ollama para interpretar as requisições em texto e gerar as consultas SQL correspondentes, que são então executadas em um banco de dados MySQL.

## Pré-requisitos
- Docker e Docker Compose
- Node.js (caso queira rodar localmente)
- Ollama instalado no sistema
- Modelo SQL configurado no Ollama

## Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/ia-project.git
cd ia-project
```

### 2. Configuração do Ollama
Certifique-se de ter o modelo SQL configurado no Ollama. O arquivo de configuração do modelo está disponível em `sqlModel`.

### 3. Iniciando com Docker
```bash
docker-compose up -d
```

### 4. Iniciando Localmente
```bash
npm install
npm run dev
```

## Uso da API

A API possui um endpoint principal:

### POST /api/data
Endpoint para converter texto em consultas SQL.

Exemplo de requisição:
```json
{
  "prompt": "Liste todos os usuários"
}
```

## Estrutura do Projeto
```
.
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── promptController.js
│   ├── routes/
│   │   └── promptRoutes.js
│   ├── utils/
│   │   └── helper.js
│   ├── app.js
│   └── server.js
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Tecnologias Utilizadas
- Node.js
- Express
- MySQL
- Ollama
- Docker

## Variáveis de Ambiente
As seguintes variáveis de ambiente podem ser configuradas:
- `DB_HOST`: Host do banco de dados (padrão: 'localhost')
- `DB_USER`: Usuário do banco de dados (padrão: 'root')
- `DB_PASSWORD`: Senha do banco de dados (padrão: 'password')
- `DB_NAME`: Nome do banco de dados (padrão: 'teste')

## Contribuição
Sinta-se à vontade para contribuir com o projeto através de pull requests e issues.
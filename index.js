import ollama from "ollama";
import express from "express";

const app = express();

// Porta onde o servidor irá escutar
const PORT = 13500;

// Middleware para parsear JSON
app.use(express.json());

await ollama.create({ model: 'sql-model', path: 'Modelfile' })

// Função utilitária para criar mensagens para o modelo
const createMessage = (content) => ({
  role: "user",
  content,
});

// Rota principal
app.get("/", (req, res) => {
  res.send("Servidor Express está funcionando!");
});

// Rota com geração de query SQL via POST
app.post("/api/data", async (req, res) => {
  try {
    const { message } = req.body; // Obtendo a mensagem do corpo da requisição

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "A mensagem é obrigatória e deve ser uma string.",
      });
    }

    // Criando as mensagens com o contexto
    const userMessage = createMessage(message);

    // Chamando o modelo Ollama
    const response = await ollama.chat({
      model: "sql-model",
      messages: [userMessage]
    });

    // Verificando a resposta do modelo
    if (!response?.message?.content) {
      throw new Error("A resposta do modelo está vazia ou inválida.");
    }

    // Enviando a resposta ao cliente
    res.send(response.message.content);
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error.message);
    res.status(500).json({
      error: "Ocorreu um erro ao processar sua solicitação.",
      details: error.message,
    });
  }
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

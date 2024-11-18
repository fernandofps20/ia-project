import ollama from "ollama";
import express from "express";
import pool from './db.js'; // Importa o arquivo de conexão

const app = express();
const PORT = 13500;
app.use(express.json());

await ollama.create({ model: 'sql-model', path: 'Modelfile' });

const createMessage = (content) => ({
  role: "user",
  content,
});

app.get("/", (req, res) => {
  res.send("Servidor Express está funcionando!");
});

app.post("/api/data", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "A mensagem é obrigatória e deve ser uma string.",
      });
    }

    const userMessage = createMessage(message);

    const response = await ollama.chat({
      model: "sql-model",
      messages: [userMessage]
    });

    if (!response?.message?.content) {
      throw new Error("A resposta do modelo está vazia ou inválida.");
    }

    const [result] = await pool.execute(response?.message?.content);
    console.log(result);

    res.send(response.message.content);
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error.message);
    res.status(500).json({
      error: "Ocorreu um erro ao processar sua solicitação.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

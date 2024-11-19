import ollama from "ollama";
import pool from "../config/db.js";
import { createMessage } from "../utils/helper.js";

export const processChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "A mensagem é obrigatória e deve ser uma string." });
        }

        const userMessage = createMessage(message);

        const stream = await ollama.chat({ model: 'sql-model', messages: [userMessage], stream: true })
        let response = '';
        for await (const part of stream) {
          process.stdout.write(part.message.content)
          response += part.message.content;
        }

        const queries = response.split(";").map((q) => q.trim()).filter((q) => q.length > 0);

        const results = [];
        for (const query of queries) {
            try {
                const [result] = await pool.execute(query);
                results.push({ query, result });
            } catch (error) {
                console.error(`Erro ao executar a query: "${query}"`, error);
                results.push({ query, error: error.message });
            }
        }

        res.json({ queries, results });
    } catch (error) {
        console.error("Erro ao processar a solicitação:", {
            sql: error.sql,
            details: error.message,
        });
        res.status(500).json({
            sql: error.sql,
            error: "Ocorreu um erro ao processar sua solicitação.",
            details: error.message,
        });
    }
};

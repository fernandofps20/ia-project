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

        const response = await ollama.chat({
            model: "sql-model",
            messages: [userMessage],
        });

        const query = response.message.content.replace(/\n/g, " ");
        const [result] = await pool.execute(query);

        res.json({ query, result });
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

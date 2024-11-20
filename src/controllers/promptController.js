import ollama from "ollama";
import pool from "../config/db.js";

export const processPrompt = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "A mensagem é obrigatória e deve ser uma string." });
        }

        const generate = await ollama.generate({ model: 'sql-model', prompt })
        console.log(generate.response);

        const queries = generate.response.split(";").map((q) => q.trim()).filter((q) => q.length > 0);

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

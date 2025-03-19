
import pool from "../config/db.js";

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11435';

export const processPrompt = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "A mensagem é obrigatória e deve ser uma string." });
        }

        try {
            console.log('Connecting to Ollama...');
            
            const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'sql-model',
                    prompt: prompt
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data?.response) {
                throw new Error('No response from Ollama service');
            }

            console.log('Ollama response received:', data.response);

            const queries = data.response.split(";").map((q) => q.trim()).filter((q) => q.length > 0);

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
        } catch (ollamaError) {
            console.error("Erro ao conectar com Ollama:", {
                error: ollamaError,
                message: ollamaError.message,
                cause: ollamaError.cause
            });
            
            return res.status(503).json({
                error: "Erro ao conectar com o serviço Ollama",
                details: `${ollamaError.message}. Verifique se o serviço Ollama está rodando e se o modelo sql-model está instalado.`
            });
        }
    } catch (error) {
        console.error("Erro ao processar a solicitação:", error);
        res.status(500).json({
            error: "Ocorreu um erro ao processar sua solicitação.",
            details: error.message
        });
    }
};

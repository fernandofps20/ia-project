import express from "express";
import ollama from "ollama";
import chatRoutes from "./routes/promptRoutes.js";

const modelConfig = {
  model: "sql-model",
  path: "./Modelfile"
};

await ollama.create(modelConfig);
const app = express();
app.use(express.json());
app.use(chatRoutes);

export default app;

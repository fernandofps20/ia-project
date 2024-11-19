import app from "./app.js";

const PORT = 13500;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
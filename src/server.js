import app from "./app.js";

const PORT = 13500;

try {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
      console.error('Error starting server:', err);
    }
  });
} catch (error) {
  console.error('Failed to start server:', error);
}
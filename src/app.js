import express from "express";
import chatRoutes from "./routes/promptRoutes.js";
 

const app = express();
app.use(express.json());
app.use(chatRoutes);

export default app;
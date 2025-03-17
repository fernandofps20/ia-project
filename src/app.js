import express from "express";
import chatRoutes from "./routes/promptRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());


app.use((err, req, res, next) => {
    console.error('Static file error:', err);
    next(err);
});


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, '../public/html/Principal.html');
    
    try {
        
        if (!fs.existsSync(htmlPath)) {
            console.error('HTML file not found:', htmlPath);
            return res.status(404).json({
                error: 'File not found',
                path: htmlPath
            });
        }
        
        res.sendFile(htmlPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({
                    error: 'Error loading page',
                    details: err.message
                });
            }
        });
    } catch (err) {
        console.error('Unexpected error serving index:', err);
        res.status(500).json({
            error: 'Unexpected error',
            details: err.message
        });
    }
});

app.use(chatRoutes);


app.use((err, req, res, next) => {
    console.error('Global error:', {
        message: err.message,
        stack: err.stack,
        details: err
    });
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        path: req.path
    });
});

export default app;
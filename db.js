import mysql from 'mysql2/promise';

// Configurações da conexão
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'meu_banco',   
  waitForConnections: true,
  connectionLimit: 10,      
  queueLimit: 0,
  multipleStatements: true // Habilita múltiplos comandos SQL       
});

export default pool;

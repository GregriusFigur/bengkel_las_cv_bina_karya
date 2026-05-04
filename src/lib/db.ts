import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gunn064657A', // Ganti dengan password MariaDB Anda
  database: 'db_bina_karya',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DBHOST,
  port: Number(process.env.DBPORT),
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
});

export default pool;

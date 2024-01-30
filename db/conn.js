import postgres from "postgres";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../data/config.js";

const sql = postgres({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  user: DB_USER,
  pass: DB_PASSWORD,
  ssl: true,
});

export default sql;

"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);

const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, ".env");

dotenv.config({ path: envFilePath });

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const DATABASE = process.env.DATABASE;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const cookieKey = process.env.cookieKey;

// Configuración de Email para sistema de postventa
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE; // 'gmail', 'outlook', etc.
export const EMAIL_HOST = process.env.EMAIL_HOST; // Para SMTP personalizado
export const EMAIL_PORT = process.env.EMAIL_PORT; // Puerto SMTP
export const EMAIL_SECURE = process.env.EMAIL_SECURE; // 'true' para SSL/TLS
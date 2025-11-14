"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);

const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, ".env");

dotenv.config({ path: envFilePath });

// Debug: verificar que las variables se carguen correctamente
console.log('📄 Archivo .env cargado desde:', envFilePath);
console.log('🔑 ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? '***configurado***' : 'NO CONFIGURADO');

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const DATABASE = process.env.DATABASE;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const cookieKey = process.env.cookieKey;
export const DB_PORT = process.env.DB_PORT;
export const DB_HOST = process.env.DB_HOST;


// Configuración de correo electrónico
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASSWORD;
export const EMAIL_FROM = process.env.EMAIL_FROM;
"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { runInitialSetup } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import { iniciarCronCumpleanos } from "./jobs/cumpleanos.job.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(
      cors({
        credentials: true,
        origin: true,
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    );

    app.use(
      json({
        limit: "1mb",
      }),
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    // Middleware para asegurar UTF-8 en todas las respuestas JSON
    app.use((req, res, next) => {
      const originalJson = res.json;
      res.json = function(data) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return originalJson.call(this, data);
      };
      next();
    });

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passportJwtSetup();

    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
    throw error;
  }
}

async function setupAPI() {
  try {
    console.log("🔄 Iniciando API...");

    // 1. Conectar a la base de datos
    console.log("📊 Conectando a la base de datos...");
    await connectDB();

    // 2. Ejecutar setup inicial (crear datos básicos)
    console.log("⚙️ Ejecutando configuración inicial...");
    await runInitialSetup();

    // 3. Iniciar servidor
    console.log("🌐 Iniciando servidor...");
    await setupServer();

    // 4. Iniciar cron jobs
    console.log("⏰ Iniciando tareas programadas...");
    iniciarCronCumpleanos();

  } catch (error) {
    console.log("❌ Error en index.js -> setupAPI(), el error es: ", error);
    process.exit(1);
  }
}

setupAPI()
  .then(() => console.log("🎉 => API Iniciada exitosamente"))
  .catch((error) => {
    console.log("💥 Error en index.js -> setupAPI(), el error es: ", error);
    process.exit(1);
  });
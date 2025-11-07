"use strict";

import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  EMAIL_FROM_NAME,
} from "../config/configEnv.js";

/**
 * Crea el transporter de nodemailer
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
}

/**
 * Envía un correo electrónico
 * @param {Object} options - Opciones del correo
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.html - Contenido HTML
 * @param {string} options.text - Contenido en texto plano (opcional)
 * @returns {Promise<Object>} - Información del correo enviado
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Si no hay texto, extrae del HTML
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email enviado:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Correo enviado exitosamente",
    };
  } catch (error) {
    console.error("Error al enviar email:", error);
    throw {
      success: false,
      message: "Error al enviar el correo electrónico",
      error: error.message,
    };
  }
}

/**
 * Envía un correo a un cliente
 * @param {Object} options - Opciones del correo
 * @param {string} options.clienteEmail - Email del cliente
 * @param {string} options.clienteNombre - Nombre del cliente
 * @param {string} options.asunto - Asunto del correo
 * @param {string} options.mensaje - Mensaje del correo
 * @returns {Promise<Object>} - Información del correo enviado
 */
export async function sendEmailToCliente({ clienteEmail, clienteNombre, asunto, mensaje }) {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #44403c;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 0 0 5px 5px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .message {
          background-color: white;
          padding: 20px;
          border-left: 4px solid #44403c;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sistema Cataldo</h1>
      </div>
      <div class="content">
        <p class="greeting">Hola ${clienteNombre},</p>
        <div class="message">
          ${mensaje.replace(/\n/g, '<br>')}
        </div>
        <div class="footer">
          <p>Este es un mensaje automático del Sistema Cataldo.</p>
          <p>Por favor, no responda a este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: clienteEmail,
    subject: asunto,
    html,
  });
}

/**
 * Envía un correo de bienvenida a un nuevo cliente
 * @param {string} clienteEmail - Email del cliente
 * @param {string} clienteNombre - Nombre del cliente
 * @returns {Promise<Object>} - Información del correo enviado
 */
export async function sendWelcomeEmail(clienteEmail, clienteNombre) {
  const mensaje = `
    Bienvenido al Sistema Cataldo.

    Estamos encantados de tenerte como cliente.

    Si tienes alguna pregunta, no dudes en contactarnos.

    ¡Gracias por confiar en nosotros!
  `;

  return await sendEmailToCliente({
    clienteEmail,
    clienteNombre,
    asunto: "Bienvenido a Sistema Cataldo",
    mensaje,
  });
}

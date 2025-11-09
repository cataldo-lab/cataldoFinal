"use strict";
import cron from "node-cron";
import { enviarCorreosCumpleanos } from "../services/cumpleanos.service.js";

/**
 * Cron job para enviar correos de cumpleaños automáticamente
 * Se ejecuta todos los días a las 9:00 AM
 */
export function iniciarCronCumpleanos() {
  // Cron expression: '0 9 * * *' = Todos los días a las 9:00 AM
  // Formato: segundo minuto hora día mes día_semana

  const tarea = cron.schedule('0 9 * * *', async () => {
    console.log('🎂 Iniciando tarea de cumpleaños...', new Date().toLocaleString('es-CL'));

    try {
      const resultado = await enviarCorreosCumpleanos();

      if (resultado.success) {
        console.log(`✅ Tarea completada: ${resultado.message}`);
      } else {
        console.error(`❌ Tarea con errores: ${resultado.message}`);
      }
    } catch (error) {
      console.error('❌ Error en tarea de cumpleaños:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/Santiago" // Zona horaria de Chile
  });

  console.log('📅 Cron job de cumpleaños iniciado: Se ejecutará todos los días a las 9:00 AM (Chile)');

  return tarea;
}

/**
 * Ejecuta la tarea de cumpleaños inmediatamente (para testing)
 */
export async function ejecutarAhora() {
  console.log('🎂 Ejecutando tarea de cumpleaños manualmente...');
  return await enviarCorreosCumpleanos();
}

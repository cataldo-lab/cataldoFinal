"use strict";
import cron from "node-cron";
import { enviarCorreosCumpleanosService } from "./correo.service.js";
import User from "../entity/personas/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Tarea programada para enviar correos de cumpleaños automáticamente
 * Se ejecuta todos los días a las 9:00 AM
 */
export function iniciarCronCumpleanos() {
  // Ejecutar todos los días a las 9:00 AM (0 9 * * *)
  // Para testing, puedes usar '*/5 * * * *' (cada 5 minutos)
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Ejecutando tarea programada: Envío de correos de cumpleaños');

    try {
      // Buscar un usuario administrador o sistema para usar como remitente
      const userRepository = AppDataSource.getRepository(User);
      const adminUser = await userRepository.findOne({
        where: { rol: 'administrador' }
      });

      if (!adminUser) {
        console.error('❌ No se encontró usuario administrador para enviar correos de cumpleaños');
        return;
      }

      // Ejecutar envío de correos de cumpleaños
      const [resultado, error] = await enviarCorreosCumpleanosService(adminUser.id);

      if (error) {
        console.error('❌ Error al enviar correos de cumpleaños:', error);
        return;
      }

      if (resultado.total === 0) {
        console.log('ℹ️ No hay clientes con cumpleaños hoy');
      } else {
        console.log(`✅ Correos de cumpleaños enviados:`);
        console.log(`   - Total clientes: ${resultado.total}`);
        console.log(`   - Exitosos: ${resultado.exitosos.length}`);
        console.log(`   - Fallidos: ${resultado.fallidos.length}`);

        if (resultado.exitosos.length > 0) {
          console.log('   📧 Enviados a:');
          resultado.exitosos.forEach(r => {
            console.log(`      • ${r.cliente} (${r.email})`);
          });
        }

        if (resultado.fallidos.length > 0) {
          console.log('   ⚠️ Fallidos:');
          resultado.fallidos.forEach(r => {
            console.log(`      • ${r.cliente} (${r.email}): ${r.error}`);
          });
        }
      }
    } catch (error) {
      console.error('❌ Error en la tarea programada de cumpleaños:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/Santiago" // Zona horaria de Chile
  });

  console.log('✅ Tarea programada de cumpleaños iniciada (diariamente a las 9:00 AM)');
}

/**
 * Ejecuta manualmente el envío de correos de cumpleaños (para testing)
 */
export async function ejecutarEnvioCumpleanosManual(idRemitente) {
  try {
    console.log('🎂 Ejecutando envío manual de correos de cumpleaños...');

    const [resultado, error] = await enviarCorreosCumpleanosService(idRemitente);

    if (error) {
      console.error('❌ Error:', error);
      return [null, error];
    }

    console.log(`✅ Proceso completado:`);
    console.log(`   - Total clientes: ${resultado.total}`);
    console.log(`   - Exitosos: ${resultado.exitosos.length}`);
    console.log(`   - Fallidos: ${resultado.fallidos.length}`);

    return [resultado, null];
  } catch (error) {
    console.error('❌ Error en envío manual de cumpleaños:', error);
    return [null, error.message];
  }
}

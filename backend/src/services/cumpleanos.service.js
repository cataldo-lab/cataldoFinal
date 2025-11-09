"use strict";
import { AppDataSource } from "../config/configDb.js";
import { ClienteSchema } from "../entity/personas/cliente.entity.js";
import UserSchema from "../entity/personas/user.entity.js";
import { enviarCorreo } from "./correo.service.js";

const clienteRepository = AppDataSource.getRepository(ClienteSchema);

/**
 * Busca clientes que cumplen años en una fecha específica
 * @param {Date} fecha - Fecha para buscar cumpleaños (default: hoy)
 * @returns {Promise<Array>} Lista de clientes cumpleañeros
 */
export async function buscarCumpleaneros(fecha = new Date()) {
  try {
    const mes = fecha.getMonth() + 1; // getMonth() retorna 0-11
    const dia = fecha.getDate();

    // Buscar clientes cuyo cumpleaños coincida con el día y mes de hoy
    const cumpleaneros = await clienteRepository
      .createQueryBuilder("cliente")
      .leftJoinAndSelect("cliente.user", "user")
      .where("EXTRACT(MONTH FROM cliente.cumpleanos_cliente) = :mes", { mes })
      .andWhere("EXTRACT(DAY FROM cliente.cumpleanos_cliente) = :dia", { dia })
      .andWhere("cliente.cumpleanos_cliente IS NOT NULL")
      .andWhere("cliente.Acepta_uso_datos = :acepta", { acepta: true })
      .andWhere("user.email IS NOT NULL")
      .getMany();

    return cumpleaneros;
  } catch (error) {
    console.error("Error al buscar cumpleañeros:", error);
    throw error;
  }
}

/**
 * Calcula la edad del cliente
 * @param {Date} fechaNacimiento - Fecha de nacimiento
 * @returns {number} Edad del cliente
 */
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

/**
 * Genera el mensaje de cumpleaños personalizado
 * @param {Object} cliente - Datos del cliente
 * @returns {Object} Objeto con asunto y mensaje
 */
function generarMensajeCumpleanos(cliente) {
  const nombre = cliente.user.nombreCompleto.split(' ')[0]; // Primer nombre
  const edad = calcularEdad(cliente.cumpleanos_cliente);

  const asunto = `¡Feliz Cumpleaños ${nombre}! 🎉`;

  const mensaje = `Estimado/a ${nombre},

¡Feliz Cumpleaños! 🎂🎉

En nombre de la familia StiloMuebles, queremos desearte un día lleno de alegría y celebraciones.

Hoy cumples ${edad} años y queremos agradecerte por ser parte de nuestra familia de clientes. Tu confianza en nosotros es nuestro mejor regalo.

Como detalle especial, te ofrecemos un ${cliente.categoria_cliente === 'vip' || cliente.categoria_cliente === 'premium' ? '10%' : '7%'} de descuento en tu próximo pedido. Solo menciona este correo al realizar tu orden.

¡Que tengas un excelente día!

Con cariño,
Equipo StiloMuebles`;

  return { asunto, mensaje };
}

/**
 * Envía correos de cumpleaños a todos los clientes que cumplen años hoy
 * @returns {Promise<Object>} Resultado del envío
 */
export async function enviarCorreosCumpleanos() {
  try {
    const cumpleaneros = await buscarCumpleaneros();

    if (cumpleaneros.length === 0) {
      return {
        success: true,
        message: "No hay cumpleañeros hoy",
        enviados: 0,
        fallidos: 0,
        detalles: []
      };
    }

    console.log(`📧 Enviando correos de cumpleaños a ${cumpleaneros.length} cliente(s)...`);

    const resultados = {
      enviados: 0,
      fallidos: 0,
      detalles: []
    };

    // Enviar correos a cada cumpleañero
    for (const cliente of cumpleaneros) {
      try {
        const { asunto, mensaje } = generarMensajeCumpleanos(cliente);

        const resultado = await enviarCorreo({
          destinatario: cliente.user.email,
          asunto,
          mensaje,
          tipo: "cumpleanos",
          id_usuario_emisor: null // Sistema automático
        });

        if (resultado.success) {
          resultados.enviados++;
          resultados.detalles.push({
            cliente: cliente.user.nombreCompleto,
            email: cliente.user.email,
            estado: "enviado"
          });
          console.log(`✅ Correo enviado a ${cliente.user.nombreCompleto}`);
        } else {
          resultados.fallidos++;
          resultados.detalles.push({
            cliente: cliente.user.nombreCompleto,
            email: cliente.user.email,
            estado: "fallido",
            error: resultado.message
          });
          console.error(`❌ Error enviando a ${cliente.user.nombreCompleto}: ${resultado.message}`);
        }
      } catch (error) {
        resultados.fallidos++;
        resultados.detalles.push({
          cliente: cliente.user.nombreCompleto,
          email: cliente.user.email,
          estado: "error",
          error: error.message
        });
        console.error(`❌ Error procesando ${cliente.user.nombreCompleto}:`, error);
      }
    }

    const mensaje = `Correos de cumpleaños procesados: ${resultados.enviados} enviados, ${resultados.fallidos} fallidos`;
    console.log(`🎂 ${mensaje}`);

    return {
      success: true,
      message: mensaje,
      ...resultados
    };

  } catch (error) {
    console.error("Error en enviarCorreosCumpleanos:", error);
    return {
      success: false,
      message: `Error al enviar correos de cumpleaños: ${error.message}`,
      enviados: 0,
      fallidos: 0,
      detalles: []
    };
  }
}

/**
 * Obtiene lista de próximos cumpleaños (siguiente semana)
 * @param {number} dias - Número de días a futuro (default: 7)
 * @returns {Promise<Array>} Lista de próximos cumpleañeros
 */
export async function obtenerProximosCumpleanos(dias = 7) {
  try {
    const cumpleaneros = [];
    const hoy = new Date();

    // Buscar cumpleaños para cada día de los próximos N días
    for (let i = 1; i <= dias; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);

      const cumpleanerosDelDia = await buscarCumpleaneros(fecha);

      cumpleanerosDelDia.forEach(cliente => {
        cumpleaneros.push({
          nombre: cliente.user.nombreCompleto,
          email: cliente.user.email,
          cumpleanos: cliente.cumpleanos_cliente,
          diasRestantes: i,
          categoria: cliente.categoria_cliente
        });
      });
    }

    return cumpleaneros;
  } catch (error) {
    console.error("Error al obtener próximos cumpleaños:", error);
    throw error;
  }
}

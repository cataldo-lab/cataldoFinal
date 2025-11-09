"use strict";
import { EntitySchema } from "typeorm";

/**
 * Entidad Postventa - Historial de correos enviados a clientes
 * Almacena todos los correos de seguimiento y comunicación post-venta
 */
export const PostventaSchema = new EntitySchema({
    name: "Postventa",
    tableName: "postventa",
    columns: {
        id_postventa: {
            type: "int",
            primary: true,
            generated: true,
        },
        destinatario_email: {
            type: "varchar",
            length: 255,
            nullable: false,
            comment: "Email del destinatario"
        },
        destinatario_nombre: {
            type: "varchar",
            length: 255,
            nullable: true,
            comment: "Nombre del destinatario"
        },
        asunto: {
            type: "varchar",
            length: 500,
            nullable: false,
            comment: "Asunto del correo"
        },
        mensaje: {
            type: "text",
            nullable: false,
            comment: "Contenido del mensaje"
        },
        tipo_correo: {
            type: "enum",
            enum: ["cotizacion", "confirmacion", "entrega", "seguimiento", "personalizado", "cumpleanos"],
            default: "personalizado",
            nullable: false,
            comment: "Tipo de plantilla utilizada"
        },
        estado_envio: {
            type: "enum",
            enum: ["enviado", "fallido", "pendiente"],
            default: "pendiente",
            nullable: false,
            comment: "Estado del envío del correo"
        },
        error_mensaje: {
            type: "text",
            nullable: true,
            comment: "Mensaje de error si el envío falló"
        },
        fecha_envio: {
            type: "timestamp with time zone",
            nullable: true,
            comment: "Fecha y hora del envío exitoso"
        },
        fecha_creacion: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
            comment: "Fecha de creación del registro"
        },
        // Campos opcionales para tracking
        operacion_relacionada: {
            type: "int",
            nullable: true,
            comment: "ID de operación relacionada (si aplica)"
        },
        enviado_por_usuario: {
            type: "int",
            nullable: true,
            comment: "ID del usuario que envió el correo"
        }
    },
    relations: {
        operacion: {
            type: "many-to-one",
            target: "Operacion",
            joinColumn: { name: "operacion_relacionada" },
            nullable: true,
            onDelete: "SET NULL"
        },
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "enviado_por_usuario" },
            nullable: true,
            onDelete: "SET NULL"
        }
    },
    indices: [
        {
            name: "IDX_POSTVENTA_EMAIL",
            columns: ["destinatario_email"]
        },
        {
            name: "IDX_POSTVENTA_TIPO",
            columns: ["tipo_correo"]
        },
        {
            name: "IDX_POSTVENTA_ESTADO",
            columns: ["estado_envio"]
        },
        {
            name: "IDX_POSTVENTA_FECHA",
            columns: ["fecha_envio"]
        },
        {
            name: "IDX_POSTVENTA_OPERACION",
            columns: ["operacion_relacionada"]
        }
    ]
});

export default PostventaSchema;

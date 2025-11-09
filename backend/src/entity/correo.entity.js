"use strict";
import { EntitySchema } from "typeorm";

export const EstadoEnvio = {
    ENVIADO: "enviado",
    FALLIDO: "fallido",
    PENDIENTE: "pendiente"
};

export const TipoCorreo = {
    COTIZACION: "cotizacion",
    CONFIRMACION: "confirmacion",
    ENTREGA: "entrega",
    SEGUIMIENTO: "seguimiento",
    PERSONALIZADO: "personalizado"
};

export const CorreoSchema = new EntitySchema({
    name: "Correo",
    tableName: "correos",
    columns: {
        id_correo: {
            type: "int",
            primary: true,
            generated: true,
        },
        destinatario: {
            type: "varchar",
            length: 255,
            nullable: false,
            comment: "Email del destinatario"
        },
        asunto: {
            type: "varchar",
            length: 255,
            nullable: false,
            comment: "Asunto del correo"
        },
        mensaje: {
            type: "text",
            nullable: false,
            comment: "Contenido del mensaje"
        },
        tipo: {
            type: "enum",
            enum: TipoCorreo,
            default: TipoCorreo.PERSONALIZADO,
            comment: "Tipo de plantilla utilizada"
        },
        estado_envio: {
            type: "enum",
            enum: EstadoEnvio,
            default: EstadoEnvio.PENDIENTE,
            comment: "Estado del envío"
        },
        error_mensaje: {
            type: "text",
            nullable: true,
            comment: "Mensaje de error en caso de fallo"
        },
        fecha_envio: {
            type: "timestamp with time zone",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
            comment: "Fecha y hora del envío"
        },
        fecha_lectura: {
            type: "timestamp with time zone",
            nullable: true,
            comment: "Fecha y hora de lectura (si disponible)"
        }
    },
    relations: {
        // Relación con User (N:1) - Cliente al que se envió
        cliente: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "id_cliente" },
            nullable: true
        },
        // Relación con User (N:1) - Empleado que envió
        remitente: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "id_remitente" },
            nullable: false
        },
        // Relación opcional con Operacion (N:1)
        operacion: {
            type: "many-to-one",
            target: "Operacion",
            joinColumn: { name: "id_operacion" },
            nullable: true
        }
    },
    indices: [
        {
            name: "IDX_CORREO_DESTINATARIO",
            columns: ["destinatario"]
        },
        {
            name: "IDX_CORREO_FECHA_ENVIO",
            columns: ["fecha_envio"]
        },
        {
            name: "IDX_CORREO_ESTADO",
            columns: ["estado_envio"]
        }
    ]
});

export default CorreoSchema;

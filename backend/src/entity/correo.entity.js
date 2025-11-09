"use strict";
import { EntitySchema } from "typeorm";

export const CorreoSchema = new EntitySchema({
  name: "Correo",
  tableName: "correos",
  columns: {
    id: {
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
      type: "varchar",
      length: 50,
      nullable: true,
      default: "personalizado",
      comment: "Tipo de plantilla utilizada"
    },
    estado: {
      type: "varchar",
      length: 20,
      nullable: false,
      default: "enviado",
      comment: "Estado del correo: enviado, fallido, pendiente"
    },
    error_mensaje: {
      type: "text",
      nullable: true,
      comment: "Mensaje de error si el envío falló"
    },
    fecha_envio: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
      comment: "Fecha y hora de envío del correo"
    }
  },
  relations: {
    usuario_emisor: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "id_usuario_emisor" },
      nullable: true,
      eager: false,
      comment: "Usuario que envió el correo"
    }
  },
  indices: [
    {
      name: "IDX_CORREO_DESTINATARIO",
      columns: ["destinatario"]
    },
    {
      name: "IDX_CORREO_ESTADO",
      columns: ["estado"]
    },
    {
      name: "IDX_CORREO_FECHA",
      columns: ["fecha_envio"]
    }
  ]
});

export default CorreoSchema;

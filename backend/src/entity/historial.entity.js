"use strict";
import { EntitySchema } from "typeorm";

export const historialSchema = new EntitySchema({
    name: "Historial",
    tableName: "historial",
    columns: {
        id_h_operacion: {
            type: "int",
            primary: true,
            generated: true,
        },
        cotizacion:{
            type: "boolean",
            nullable: true,
            default: false
        },
        orden_trabajo:{
            type: "boolean",
            nullable: true,
            default: false
        },
        pendiente: {
            type:"boolean",
            nulleable: true,
            default: false
        },
        en_proceso: {
            type: "boolean",
            nullable: true,
            default: false
        },
        terminada:{
            type: "boolean",
            nullable: true,
            default: false
        },
        completada: {
            type: "boolean",
            nulleable: true,
            default: false
        },
        pagada:{
            type: "boolean",
            nullable: true,
            default: false
        },
        entregada:{
            type: "boolean",
            nullable: true,
            default: false
        },
        anulada:{
            type:"boolean",
            nullable:true,
            default:false
        },
        fecha_cambio:{
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        operacion:{
            type: "many-to-one",
            target: "Operacion",
            joinColumn: { name: "id_operacion" },
            nullable: false,
            cascade: false
    }}
})
    
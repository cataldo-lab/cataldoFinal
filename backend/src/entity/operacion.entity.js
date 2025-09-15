"use strict";       
import { EntitySchema } from "typeorm";

export const OperacionSchema = new EntitySchema({
    name: "Operacion",
    tableName: "operacion",
    columns: {
        id_operacion: {
            type: "int",
            primary: true,
            generated: true,
        },
        estado_operacion: {
            type: "varchar",
            length: 50,
            default: "pendiente" // pendiente, en_proceso, completada, cancelada
        },
        tipo_servicio: {
            type: "boolean",
            nullable: false,
            default: false // false = producto, true = servicio
        },
        costo_operacion: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true
        },
        cantidad_abono: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0
        },
        descripcion_operacion: {
            type: "text",
            nullable: true
        },
        fecha_creacion: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        },
        fecha_entrega_estimada: {
            type: "date",
            nullable: true
        }
    },
    relations: {
        // Relación con User/Cliente (N:1)
        cliente: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "id_user" },
            nullable: false
        },
        // Relación con ProductosOperacion (1:N)
        productosOperacion: {
            type: "one-to-many",
            target: "ProductoOperacion",
            inverseSide: "operacion"
        },
        // Relación con Historial (1:N)
        historial: {
            type: "one-to-many",
            target: "Historial",
            inverseSide: "operacion"
        },
        // Relación con Encuesta (1:1)
        encuesta: {
            type: "one-to-one",
            target: "Encuesta",
            inverseSide: "operacion"
        }
    }
});

export default OperacionSchema;
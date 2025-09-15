"use strict";
import { EntitySchema } from "typeorm";

export const productoSchema = new EntitySchema({
    name: "Producto",
    tableName: "producto",
    columns: {
        id_producto: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_producto: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        categoria_producto: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        descripcion_producto: {
            type: "text",
            nullable: true
        },
        costo_fabricacion:{
            type: "int",
            nullable: false
        },
        costo_barnizador:{
            type: "int",
            nullable: false
        },
        costo_vidrio:{
            type: "int",
            nullable: false
        },
        costo_tela:{
            type: "int",
            nullable: false
        },
        otros_costos:{
            type: "int",
            nullable: true
        },
        oferta:{
            type: "boolean",
            nullable: false,
            default: false
        },
        servicio:{
            type: "boolean",
            nullable: false,
            default: false
        },
        fecha_fabricacion:{
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        }
},
    relations: {
        operaciones: {
            type: "one-to-many",
            target: "Operacion",
            inverseSide: "producto"
        }
    }
})
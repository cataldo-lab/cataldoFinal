"use strict";
import { EntitySchema } from "typeorm";

export const ProductoOperacionSchema = new EntitySchema({
    name: "ProductoOperacion",
    tableName: "producto_operacion",
    columns: {
        id_producto_operacion: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad: {
            type: "int",
            nullable: false,
            default: 1
        },
        precio_unitario: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        },
        precio_total: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        },
        especificaciones: {
            type: "text",
            nullable: true
        },
        fecha_agregado: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        operacion: {
            type: "many-to-one",
            target: "Operacion",
            joinColumn: { name: "id_operacion" },
            nullable: false,
            cascade: false
        },
        producto: {
            type: "many-to-one",
            target: "Producto",
            joinColumn: { name: "id_producto" },
            nullable: false,
            cascade: false
        }
    }
});

export default ProductoOperacionSchema;
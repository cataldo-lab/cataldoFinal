"use strict";
import { EntitySchema } from "typeorm";

export const MaterialesSchema = new EntitySchema({
    name: "Materiales",
    tableName: "materiales",
    columns: {
        id_material: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_material: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        existencia_material: {
            type: "int",
            nullable: false,
            default: 0
        },
        unidad_medida: {
            type: "varchar",
            length: 20,
            nullable: false
        },
        precio_unitario: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        },
        stock_minimo: {
            type: "int",
            nullable: false,
            default: 10
        },
        activo: {
            type: "boolean",
            nullable: false,
            default: true
        }
    },
    relations: {
        productos: {
            type: "one-to-many",
            target: "ProductoMateriales",
            inverseSide: "material"
        },
        proveedor: {
            type: "many-to-one",
            target: "Proveedores",
            joinColumn: { name: "id_proveedor" },
            nullable: true
        }
    }
});

export default MaterialesSchema;
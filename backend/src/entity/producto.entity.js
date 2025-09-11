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
}})
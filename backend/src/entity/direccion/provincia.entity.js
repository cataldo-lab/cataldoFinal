"use strict";
import { EntitySchema } from "typeorm";

export const ProvinciaSchema = new EntitySchema({
    name: "Provincia",
    tableName: "provincia",
    columns: {
        id_provincia: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_provincia: {
            type: "varchar",
            length: 100,
            nullable: false
        }
    }
})
"use strict";
import { EntitySchema } from "typeorm";

export const PaisSchema = new EntitySchema({
    name: "Pais",
    tableName: "pais",
    columns: {
        id_pais: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_pais: {
            type: "varchar",
            length: 100,
            nullable: false
        }
    },
    relations: {
        regiones: {
            type: "one-to-many",
            target: "Region",
            inverseSide: "pais",
            //cascade: true
        }
    }
})

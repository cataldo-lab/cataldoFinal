"use strict";
import { EntitySchema } from "typeorm";

export const ComunaSchema = new EntitySchema({
    name: "Comuna",
    tableName: "comuna",
    columns: {
        id_comuna: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_comuna: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        nombre_calle: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        numero_calle: {
            type: "int",
            nullable: false
        },
        departamento: {
            type: "boolean",
            nullable: true
        },
        numero_depto: {
            type: "int",
            nullable: true
        },
        bloque_depto: {
            type: "varchar",
            length: 10,
            nullable: true
        }
    },
    relations: {
        provincia: {
            type: "many-to-one",       
            target: "Provincia",
            joinColumn: { name: "id_provincia" },
            nullable: false,
        },
        user:{
            type: "one-to-many",
            target: "User",
            inverseSide: "comuna"
        }
    }
});
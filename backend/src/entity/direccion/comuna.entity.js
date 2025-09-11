"use strict";
import { EntitySchema } from "typeorm";

export const comunaSchema = new EntitySchema({
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
        nombre_calle:{
            type: "varchar",
            length: 100,
            nullable: false
        },
        numero_calle:{
            type: "int",
            nullable: false
        },
        departamento:{
            type: "boolean",
            nullable: true
        },
        numero_depto:{
            type: "int",
            nullable: true
        },
        bloque_depto:{
            type: "varchar",
            length: 10,
            nullable: true
        }
    }
})
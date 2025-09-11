"use strict";
import { EntitySchema } from "typeorm";

export const materialesSchema = new EntitySchema({
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
        existencia_material:{
            type: "int",
            nullable: false
        },
        unidad_medida:{
            type: "varchar",
            length: 20,
            nullable: false
        },
        precio_unitario:{
            type: "float",
            nullable: false
        },
        cantidad_material:{
            type: "int",
            nullable: false
        }
    }
})
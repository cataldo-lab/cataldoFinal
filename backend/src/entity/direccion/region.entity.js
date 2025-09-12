"use strict";
import { EntitySchema } from "typeorm";

export const RegionSchema = new EntitySchema({
    name: "Region",
    tableName: "region",
    columns: {
        id_region: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_region: {
            type: "varchar",
            length: 100,
            nullable: false
        }
    },
    relations:{
        pais:{
            type: "many-to-one",
            target: "Pais",
            joinColumn: { name: "id_pais" },
            nullable: false,
            cascade: true
        },
        provincias:{
            type: "one-to-many",
            target: "Provincia",
            inverseSide: "region",
            //cascade: true
        }

    }
})

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
    }
})

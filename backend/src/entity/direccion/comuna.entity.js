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
    },
    relations: {
        provincia: {
            type: "many-to-one",       
            target: "Provincia",
            joinColumn: { name: "id_provincia" },
            nullable: false,
        },
        users: {
            type: "one-to-many",
            target: "User",
            inverseSide: "comuna"
        }
    }
});

export default ComunaSchema;
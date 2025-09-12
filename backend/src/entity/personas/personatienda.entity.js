"use strict";
import { EntitySchema } from "typeorm";

const PersonaTiendaSchema = new EntitySchema({
    name: "PersonaTienda",
    tableName: "personas_tienda",
    columns: {
        id_persona_tienda: {
            type: "int",
            primary: true,
            generated: true,
        },
        contacto_emergencia:{
            type: "varchar",
            length: 100,
            nullable: true
        },
        numero_emergencia:{
            type: "varchar",
            length: 20,
            nullable: true
        }
    },
    relations: {
        user:{
            type: "one-to-one",
            target: "User",
            joinColumn: { name: "id_user" },
            nullable: false,
            cascade: true
        }
    }
})

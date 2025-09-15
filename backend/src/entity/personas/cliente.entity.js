"use strict";
import { EntitySchema } from "typeorm";

export const ClienteSchema = new EntitySchema({
    name: "Cliente",
    tableName: "clientes",
    columns: {
        id_cliente: {
            type: "int",
            primary: true,
            generated: true,
        },
        cumpleanos_cliente: {
            type: "date",
            nullable: true
        },
        whatsapp_cliente: {
            type: "varchar",
            length: 20,
            nullable: true
        },
        correo_alterno_cliente: {
            type: "varchar",
            length: 50,
            nullable: true
        },
        categoria_cliente: {
            type: "varchar",
            length: 20,
            nullable: true,
            default: "regular" // regular, vip, premium
        },
        descuento_cliente: {
            type: "decimal",
            precision: 5,
            scale: 2,
            nullable: true,
            default: 0
        }
    },
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            joinColumn: { name: "id_user" },
            nullable: false,
            cascade: true
        }
    }
});

export default ClienteSchema;
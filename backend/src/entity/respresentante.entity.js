"use strict";
import { EntitySchema } from "typeorm";

export const representanteSchema = new EntitySchema({
    name: "Representante",
    tableName: "representante",
    columns: {
        id_representante: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_representante: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        apellido_representante: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        rut_representante: {
            type: "varchar",
            length: 12,
            nullable: false
        },
        cargo_representante: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        fono_representante: {
            type: "varchar",
            length: 15,
            nullable: false
        },
        correo_representante: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        creado_en:{
            type: "timestamp",
            createDate: true,
            nullable: false
        }
    },
    relations: {
        proveedores:{
            type: "many-to-one",
            target: "Proveedores",
            joinColumn: { name: "id_proveedor" },
            nullable: false,
            cascade: true
        }
    }
});
"use strict";
import { EntitySchema } from "typeorm";

export const proveedoresSchema = new EntitySchema({
    name: "Proveedores",
    tableName: "proveedores",
    columns: {
        id_proveedor: {
            type: "int",
            primary: true,
            generated: true,
        },
        rol_proveedor: {
            type: "varchar",
            length: 50,
            nullable: false
        },
        rut_proveedor:{
            type: "varchar",
            length: 12,
            nullable: false,
        },
        nombre_representanter:{
            type: "varchar",
            length: 100,
            nullable: false
        },
        apellido_representante:{
            type: "varchar",
            length: 100,
            nullable: false
        },
        rut_representante:{
            type: "varchar",
            length: 12,
            nullable: false
        },
        fono_proveedor:{
            type: "varchar",
            length: 15,
            nullable: false
        },
        correo_proveedor:{
            type: "varchar",
            length: 100,
            nullable: false
        },

    },
    relations: {
        materiales:{
            type: "one-to-many",
            target: "Materiales",
            inverseSide: "proveedores",
            //cascade: true
        }
    }
})
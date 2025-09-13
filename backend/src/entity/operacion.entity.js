"use strict";       
import { EntitySchema } from "typeorm";

export const operacionSchema = new EntitySchema({
    name: "Operacion",
    tableName: "operacion",
    columns: {
        id_operacion: {
            type: "int",
            primary: true,
            generated: true,
        },
        estado_operacion:{
            type: "int",
            array: true
        },
        lista_productos:{
            type: "jsonb",
            nullable: true
        },
        tipo_servicio:{
            type: "boolean",
            nullable: false
        },
        costo_operacion:{
            type: "int",
            nullable: true
        },
        cantidad_abono:{
            type: "int",
            nullable: true
        },
        fecha_creacion:{
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        
    }
})

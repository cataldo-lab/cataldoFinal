
"use strict";
import { EntitySchema } from "typeorm";


export const Encuesta = new EntitySchema({
    name: "Encuesta",
    tableName: "encuesta",
    columns: {
        id_encuesta: {
            type: "int",
            primary: true,
            generated: true, 
        },
        nota_pedido:{
            type: "int",
            nullable: null,
            default:4,
            range: [1,7],
        },
        nota_repartidor:{
            type: "int",
            nullable: null,
            default:4,
            range: [1,7],
        },
        comentario:{
            type: "varchar",
            nullable: true,
            length: 255
        },
        fecha_encuesta:{
            type: "timestamp",
            nullable: null,
            default: () => "CURRENT_TIMESTAMP"
        }
    }
});
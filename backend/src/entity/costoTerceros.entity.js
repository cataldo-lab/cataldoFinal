
"use strict";
import { EntitySchema } from "typeorm";


export const CostoTerceros = new EntitySchema({
    name: "CostoTerceros",
    tableName: "costo_terceros",
    columns: {
        id_costos_terceros: {
            type: "int",
            primary: true,
            generated: true,
        },
        gastos_fijos_ind: {
            type: "int",
            nullable: true
        },
        gastos_fijos_dir:{
            type: "int",
            nullable: true
        },
        anno:{
            type: "int",
            nullable: true
        }

}
});
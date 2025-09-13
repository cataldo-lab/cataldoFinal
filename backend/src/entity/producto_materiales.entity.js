"use strict";
import { EntitySchema } from "typeorm";


export const ProductoMaterialesSchema = new EntitySchema({
    name: "ProductoMateriales",
    tableName: "producto_materiales",
    columns: {
        id_producto_material: {
            type: "int",
            primary: true,
            generated: true,
        }
    },
    fecha_compra:{
        type: "timestamp",
        nullable: false,
        default: () => "CURRENT_TIMESTAMP"
    },
    relations:{
        producto:{
            type: "many-to-one",
            target: "Producto",
            joinColumn: { name: "id_producto" },
            nullable: false,
            cascade: true
        },
        materiales:{
            type: "many-to-one",
            target: "Materiales",
            joinColumn: { name: "id_material" },
            nullable: false,
            cascade: true
        }
    }

});
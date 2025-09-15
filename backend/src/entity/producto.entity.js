"use strict";
import { EntitySchema } from "typeorm";

export const ProductoSchema = new EntitySchema({
    name: "Producto",
    tableName: "producto",
    columns: {
        id_producto: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_producto: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        categoria_producto: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        descripcion_producto: {
            type: "text",
            nullable: true
        },
        // Costos directos del producto
        costo_fabricacion: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            default: 0
        },
        costo_barnizador: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            default: 0
        },
        costo_vidrio: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            default: 0
        },
        costo_tela: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            default: 0
        },
        costo_materiales_otros: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0
        },
        // Precios y márgenes
        precio_venta: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        },
        margen_ganancia: {
            type: "decimal",
            precision: 5,
            scale: 2,
            nullable: true,
            default: 30.00,
            comment: "Margen de ganancia en porcentaje"
        },
        // Flags de control
        oferta: {
            type: "boolean",
            nullable: false,
            default: false
        },
        servicio: {
            type: "boolean",
            nullable: false,
            default: false
        },
        activo: {
            type: "boolean",
            nullable: false,
            default: true
        },
        // Fechas
        fecha_creacion: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        },
        fecha_actualizacion: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        // Relación con CostoTerceros (N:1)
        costoTerceros: {
            type: "many-to-one",
            target: "CostoTerceros",
            joinColumn: { name: "id_costo_terceros" },
            nullable: true,
            eager: false
        },
        // Relación con ProductosOperacion (1:N)
        productosOperacion: {
            type: "one-to-many",
            target: "ProductoOperacion",
            inverseSide: "producto"
        },
        // Relación con ProductoMateriales (1:N)
        materiales: {
            type: "one-to-many",
            target: "ProductoMateriales",
            inverseSide: "producto"
        }
    },
    indices: [
        {
            name: "IDX_PRODUCTO_CATEGORIA",
            columns: ["categoria_producto"]
        },
        {
            name: "IDX_PRODUCTO_ACTIVO",
            columns: ["activo"]
        },
        {
            name: "IDX_PRODUCTO_SERVICIO",
            columns: ["servicio"]
        }
    ]
});

export default ProductoSchema;
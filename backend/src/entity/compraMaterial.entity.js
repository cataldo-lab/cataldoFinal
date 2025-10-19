"use strict";
import { EntitySchema } from "typeorm";

export const EstadoCompra = {
    PENDIENTE: "pendiente",
    RECIBIDA: "recibida",
    CANCELADA: "cancelada",
    PARCIAL: "parcial"
};

export const TipoDocumento = {
    BOLETA: "boleta",
    FACTURA: "factura",
    OTRO: "otro"
};

export const CompraMaterialSchema = new EntitySchema({
    name: "CompraMaterial",
    tableName: "compra_materiales",
    columns: {
        id_compra: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            comment: "Cantidad comprada del material"
        },
        precio_unitario: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            comment: "Precio unitario al momento de la compra"
        },
        precio_total: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            comment: "Cantidad * Precio Unitario"
        },
        fecha_compra: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
            comment: "Fecha en que se realizó la compra"
        },
        fecha_entrega_estimada: {
            type: "date",
            nullable: true,
            comment: "Fecha estimada de llegada del material"
        },
        fecha_entrega_real: {
            type: "date",
            nullable: true,
            comment: "Fecha real en que llegó el material"
        },
        estado: {
            type: "enum",
            enum: Object.values(EstadoCompra),
            default: EstadoCompra.PENDIENTE,
            nullable: false,
            comment: "Estado actual de la compra"
        },
        tipo_documento: {
            type: "enum",
            enum: Object.values(TipoDocumento),
            nullable: true,
            comment: "Tipo de documento: boleta, factura, guía de despacho, otro"
        },
        numero_documento: {
            type: "varchar",
            length: 100,
            nullable: true,
            comment: "Número de boleta, factura o documento de compra"
        },
        observaciones: {
            type: "text",
            nullable: true,
            comment: "Notas adicionales sobre la compra"
        },
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
        
        material: {
            type: "many-to-one",
            target: "Materiales",
            joinColumn: { name: "id_material" },
            nullable: false,
            cascade: false
        },
        
        proveedor: {
            type: "many-to-one",
            target: "Proveedores",
            joinColumn: { name: "id_proveedor" },
            nullable: false,
            cascade: false
        },
       
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "id_usuario" },
            nullable: true,
            cascade: false
        }
    },
    indices: [
        {
            name: "IDX_COMPRA_FECHA",
            columns: ["fecha_compra"]  
        },
        {
            name: "IDX_COMPRA_ESTADO",
            columns: ["estado"]  
        },
        {
            name: "IDX_COMPRA_TIPO_DOC",
            columns: ["tipo_documento"]  
        }
    ]
});

export default CompraMaterialSchema;
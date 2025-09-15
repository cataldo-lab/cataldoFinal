"use strict";
import { EntitySchema } from "typeorm";

export const CostoTercerosSchema = new EntitySchema({
    name: "CostoTerceros",
    tableName: "costo_terceros",
    columns: {
        id_costos_terceros: {
            type: "int",
            primary: true,
            generated: true,
        },
        gastos_fijos_ind: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0,
            comment: "Gastos fijos indirectos"
        },
        gastos_fijos_dir: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0,
            comment: "Gastos fijos directos"
        },
        gastos_variables: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0,
            comment: "Gastos variables"
        },
        costo_transporte: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0,
            comment: "Costos de transporte y logística"
        },
        costo_instalacion: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0,
            comment: "Costos de instalación"
        },
        otros_costos: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0,
            comment: "Otros costos no categorizados"
        },
        anno: {
            type: "int",
            nullable: false,
            default: () => "EXTRACT(YEAR FROM CURRENT_DATE)",
            comment: "Año de aplicación de estos costos"
        },
        mes: {
            type: "int",
            nullable: true,
            comment: "Mes específico (opcional)"
        },
        activo: {
            type: "boolean",
            nullable: false,
            default: true,
            comment: "Si este registro de costos está activo"
        },
        descripcion: {
            type: "text",
            nullable: true,
            comment: "Descripción detallada de los costos"
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
        // Relación con Producto (1:N) - Un registro de costos puede aplicarse a múltiples productos
        productos: {
            type: "one-to-many",
            target: "Producto",
            inverseSide: "costoTerceros"
        }
    },
    indices: [
        {
            name: "IDX_COSTO_TERCEROS_ANNO",
            columns: ["anno"]
        },
        {
            name: "IDX_COSTO_TERCEROS_ACTIVO",
            columns: ["activo"]
        }
    ]
});

export default CostoTercerosSchema;
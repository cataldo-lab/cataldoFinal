"use strict";
import { EntitySchema } from "typeorm";

export const UnidadPeso={
    KILOGRAMO: "kg",
    GRAMO: "g",
    LIBRA: "lb",
    ONZA: "oz"
}

export const UnidadLongitud ={
    METRO: "m",
    CENTIMETRO: "cm",
    MILIMETRO: "mm",
    PULGADA: "in",
    PIE: "ft"
}

export const UnidadVolumen={
    LITRO: "lt",
    MILILITRO: "ml",
    GALON: "gal"
}

export const UnidadUnidad={
    UNIDAD: "unidad",
    PAR: "par",
    MEDIADOCENA: "mediadocena",
    DOCENA: "docena",
    PAQUETE: "paquete"
}

export const UnidadMedida = {
    ...UnidadPeso,
    ...UnidadLongitud,
    ...UnidadVolumen,
    ...UnidadUnidad,
    OTRO: "otro"
};

export const CategoriaUnidad = {
    PESO: "peso",
    LONGITUD: "longitud",
    VOLUMEN: "volumen",
    UNIDAD: "unidad",
    OTRO: "otro"
};


export function detectarCategoria(unidad) {
    if (Object.values(UnidadPeso).includes(unidad)) return CategoriaUnidad.PESO;
    if (Object.values(UnidadLongitud).includes(unidad)) return CategoriaUnidad.LONGITUD;
    if (Object.values(UnidadVolumen).includes(unidad)) return CategoriaUnidad.VOLUMEN;
    if (Object.values(UnidadUnidad).includes(unidad)) return CategoriaUnidad.UNIDAD;
    return CategoriaUnidad.OTRO;
}



export const MaterialesSchema = new EntitySchema({
    name: "Materiales",
    tableName: "materiales",
    columns: {
        id_material: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_material: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        existencia_material: {
            type: "int",
            nullable: false,
            default: 0
        },
        categoria_unidad: {
            type: "enum",
            enum: CategoriaUnidad,
            nullable: true
        },
        unidad_medida: {
            type: "enum",
            enum: UnidadMedida,
            default: UnidadUnidad.UNIDAD,
            nullable: false
        },
        precio_unitario: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        },
        stock_minimo: {
            type: "int",
            nullable: false,
            default: 1
        },
        activo: {
            type: "boolean",
            nullable: false,
            default: true
        }
    },
    relations: {
        productos: {
            type: "one-to-many",
            target: "ProductoMateriales",
            inverseSide: "material"
        },
        proveedor: {
            type: "many-to-one",
            target: "Proveedores",
            joinColumn: { name: "id_proveedor" },
            nullable: true
        },
        
    }
});

export default MaterialesSchema;
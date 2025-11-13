"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD, DB_HOST, DB_PORT } from "./configEnv.js";

import UserSchema from "../entity/personas/user.entity.js";
import { ClienteSchema } from "../entity/personas/cliente.entity.js";
import { PersonaTiendaSchema } from "../entity/personas/personatienda.entity.js";
import { ComunaSchema } from "../entity/direccion/comuna.entity.js";
import { ProvinciaSchema } from "../entity/direccion/provincia.entity.js";
import { RegionSchema } from "../entity/direccion/region.entity.js";
import { PaisSchema } from "../entity/direccion/pais.entity.js";
import { OperacionSchema } from "../entity/operacion.entity.js";
import { ProductoSchema } from "../entity/producto.entity.js";
import { ProductoOperacionSchema } from "../entity/producto_operacion.entity.js";
import { MaterialesSchema } from "../entity/materiales.entity.js";
import { ProductoMaterialesSchema } from "../entity/producto_materiales.entity.js";
import { proveedoresSchema } from "../entity/proveedores.entity.js";
import { representanteSchema } from "../entity/representante.entity.js";
import { historialSchema } from "../entity/historial.entity.js";
import { EncuestaSchema } from "../entity/encuesta.entity.js";
import { CostoTercerosSchema } from "../entity/costoTerceros.entity.js";
import { AuditLogSchema } from "../entity/audit_log.entity.js";
import { CompraMaterialSchema } from "../entity/compraMaterial.entity.js";
import { CorreoSchema } from "../entity/correo.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${DB_HOST || HOST}`,
  port: `${DB_PORT || PORT}`,
  username: `${DB_USERNAME}`,
  password: `${PASSWORD}`,
  database: `${DATABASE}`,
  entities: ["src/entity/**/*.js"],
  synchronize: true,
  logging: true,
  entities: [
    UserSchema,
    ClienteSchema,
    PersonaTiendaSchema,
    ComunaSchema,
    ProvinciaSchema,
    RegionSchema,
    PaisSchema,
    OperacionSchema,
    ProductoSchema,
    ProductoOperacionSchema,
    MaterialesSchema,
    ProductoMaterialesSchema,
    proveedoresSchema,
    representanteSchema,
    historialSchema,
    EncuestaSchema,
    CostoTercerosSchema,
    AuditLogSchema,
    CompraMaterialSchema,
    CorreoSchema
  ]
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
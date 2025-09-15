"use strict";
import { EntitySchema } from "typeorm";

export const Role = {
  ADMIN: "administrador",
  GERENTE: "gerente", 
  TRABAJADOR_TIENDA: "trabajador_tienda",
  CLIENTE: "cliente",
  USUARIO: "usuario"
}

const UserSchema = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    nombreCompleto: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    rol: {
      type: "varchar",
      length: 20,
      default: "usuario",
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    // Relación con Cliente (1:1)
    cliente: {
      type: "one-to-one",
      target: "Cliente",
      inverseSide: "user",
    },
    // Relación con PersonaTienda (1:1)
    personaTienda: {
      type: "one-to-one",
      target: "PersonaTienda",
      inverseSide: "user",
    },
    // Relación con Operaciones (1:N) - Un usuario puede tener múltiples operaciones
    operaciones: {
      type: "one-to-many",
      target: "Operacion",
      inverseSide: "cliente"
    },
    // Relación con Comuna (N:1) - Muchos usuarios pueden vivir en una comuna
    comuna: {
      type: "many-to-one",
      target: "Comuna",
      joinColumn: { name: "id_comuna" },
      nullable: true, // Puede ser null inicialmente
      eager: false // No cargar automáticamente
    }
  },
  indices: [
    {
      name: "IDX_USER_ID",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_USER_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_USER_EMAIL",
      columns: ["email"],
      unique: true,
    },
  ]
});

export default UserSchema;
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
  retarion:{
    cliente:{
        type: "one-to-one",
        target: "Cliente",
      },
    personaTienda:{
        type: "one-to-one",
        target: "PersonaTienda",
      },
    operaciones:{
        type: "one-to-many",
        target: "Operacion",
        inverseSide: "cliente"
      },
    comuna:{
        type: "many-to-one",
        target: "Comuna",
        joinColumn: { name: "id_comuna" },
        nullable: false,
        eager: true
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
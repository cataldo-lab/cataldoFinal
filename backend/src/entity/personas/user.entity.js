"use strict";
import { EntitySchema } from "typeorm";


export const Role = {
  ADMIN: "admin",
  GERENTE: "gerente",
  TRABAJADOR_TIENDA: "trabajador_tienda",
  CLIENTE: "cliente",
  TRABAJADOR_FABRICA: "trabajador_fabrica",
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
    username: {
      type: "varchar",
      length: 100,
      unique: true,
      nullable: false,
    },
    nombres:{
      type: "varchar",
      length: 100,
      nullable: false,
    },
    apellidos:{
      type: "varchar",
      length: 100,
      nullable: false,
    },  

    correo: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    rol: {
      type: "enum",
      enum:Role,
      default: Role.CLIENTE,
    
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_USER",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_USER_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_USER_CORREO",
      columns: ["correo"],
      unique: true,
    },
  ],
});

export default UserSchema;
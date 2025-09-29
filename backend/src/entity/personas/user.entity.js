"use strict";
import { EntitySchema } from "typeorm";

export const Role = {
  ADMIN: "administrador",
  GERENTE: "gerente", 
  TRABAJADOR_TIENDA: "trabajador_tienda",
  CLIENTE: "cliente",
  USUARIO: "usuario",
  BLOQUEADO: "bloqueado"
}

// ⭐ NUEVO: Definir permisos por rol
export const RolePermissions = {
  administrador: ["admin", "gerente", "trabajador_tienda", "cliente"],
  gerente: ["gerente", "trabajador_tienda", "cliente"],
  trabajador_tienda: ["trabajador_tienda", "cliente"],
  cliente: ["cliente"],
  usuario: ["cliente"], // Usuario básico = cliente
  bloqueado: [] // Sin permisos
}

// ⭐ NUEVO: Función para verificar si un rol tiene permiso
export function tienePermiso(rolPrincipal, rolRequerido) {
  const permisos = RolePermissions[rolPrincipal] || [];
  return permisos.includes(rolRequerido);
}

// ⭐ NUEVO: Obtener todos los roles disponibles para un usuario
export function obtenerRolesDisponibles(rolPrincipal) {
  return RolePermissions[rolPrincipal] || [];
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
      default: "cliente",
      comment: "Rol principal del usuario"
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: true,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: true,
    },
  },
  relations: {
    cliente: {
      type: "one-to-one",
      target: "Cliente",
      inverseSide: "user",
    },
    personaTienda: {
      type: "one-to-one",
      target: "PersonaTienda",
      inverseSide: "user",
    },
    operaciones: {
      type: "one-to-many",
      target: "Operacion",
      inverseSide: "cliente"
    },
    comuna: {
      type: "many-to-one",
      target: "Comuna",
      joinColumn: { name: "id_comuna" },
      nullable: true,
      eager: false
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
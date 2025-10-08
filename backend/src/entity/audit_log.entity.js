"use strict";
import { EntitySchema } from "typeorm";

export const TipoEvento = {
    // Autenticación
    LOGIN: "login",
    LOGOUT: "logout",
    LOGIN_FAILED: "login_failed",
    PASSWORD_RESET: "password_reset",
    
    // Usuarios
    USER_CREATED: "user_created",
    USER_UPDATED: "user_updated",
    USER_DELETED: "user_deleted",
    USER_BLOCKED: "user_blocked",
    ROLE_CHANGED: "role_changed",
    
    // Operaciones (para cuando las implementes)
    OPERATION_CREATED: "operation_created",
    OPERATION_UPDATED: "operation_updated",
    OPERATION_CANCELLED: "operation_cancelled",
    OPERATION_STATUS_CHANGED: "operation_status_changed",
    
    // Finanzas
    PAYMENT_REGISTERED: "payment_registered",
    PRICE_CHANGED: "price_changed",
    
    // Inventario
    STOCK_UPDATED: "stock_updated",
    MATERIAL_CREATED: "material_created",
    PRODUCT_CREATED: "product_created",
    
    // Sistema
    BACKUP_CREATED: "backup_created",
    CONFIG_CHANGED: "config_changed"
};

export const NivelSeveridad = {
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    CRITICAL: "critical"
};

export const AuditLogSchema = new EntitySchema({
    name: "AuditLog",
    tableName: "audit_log",
    columns: {
        id_log: {
            type: "int",
            primary: true,
            generated: true
        },
        fecha_hora: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        },
        tipo_evento: {
            type: "enum",
            enum: Object.values(TipoEvento),
            nullable: false
        },
        // Usuario que realizó la acción
        email_usuario: {
            type: "varchar",
            length: 100,
            nullable: true,
            comment: "Email del usuario (null si es login fallido o acción del sistema)"
        },
        // Datos de la solicitud
        ip_address: {
            type: "varchar",
            length: 45,
            nullable: true
        },
        user_agent: {
            type: "varchar",
            length: 255,
            nullable: true,
            comment: "Navegador/dispositivo usado"
        },
        // Detalles del evento
        descripcion: {
            type: "text",
            nullable: true
        },
        // Entidad afectada (genérico)
        entidad_afectada: {
            type: "varchar",
            length: 50,
            nullable: true,
            comment: "Nombre de la tabla: User, Operacion, Producto, etc"
        },
        id_entidad_afectada: {
            type: "int",
            nullable: true,
            comment: "ID del registro afectado"
        },
        // Datos del cambio (JSON)
        datos_antes: {
            type: "jsonb",
            nullable: true,
            comment: "Estado antes del cambio"
        },
        datos_despues: {
            type: "jsonb",
            nullable: true,
            comment: "Estado después del cambio"
        },
        // Severidad y éxito
        nivel: {
            type: "enum",
            enum: Object.values(NivelSeveridad),
            default: NivelSeveridad.INFO,
            nullable: false
        },
        exito: {
            type: "boolean",
            nullable: false,
            default: true,
            comment: "Si la acción fue exitosa"
        }
    },
    relations: {
        // Relación con User (quien hizo la acción)
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "id_usuario" },
            nullable: true,
            eager: false
        }
    },
    indices: [
        {
            name: "IDX_AUDIT_FECHA",
            columns: ["fecha_hora"]
        },
        {
            name: "IDX_AUDIT_TIPO",
            columns: ["tipo_evento"]
        },
        {
            name: "IDX_AUDIT_EMAIL",
            columns: ["email_usuario"]
        },
        {
            name: "IDX_AUDIT_IP",
            columns: ["ip_address"]
        },
        {
            name: "IDX_AUDIT_ENTIDAD",
            columns: ["entidad_afectada", "id_entidad_afectada"]
        },
        {
            name: "IDX_AUDIT_NIVEL",
            columns: ["nivel"]
        }
    ]
});

export default AuditLogSchema;
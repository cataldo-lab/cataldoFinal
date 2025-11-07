// backend/src/services/trabajadorTienda/trabajadorDashboard.service.js
"use strict";
import { AppDataSource } from "../../config/configDb.js";

export async function getDashboardStats() {
    try {
        console.log("=== INICIO getDashboardStats ===");
        
        const operacionRepository = AppDataSource.getRepository("Operacion");
        const materialRepository = AppDataSource.getRepository("Materiales");
        const productoRepository = AppDataSource.getRepository("Producto");
        
        console.log("✅ Repositorios obtenidos");
        
        // Contar operaciones por estado
        const operacionesPendientes = await operacionRepository.count({
            where: { estado_operacion: "pendiente" }
        });
        console.log("📊 Operaciones pendientes:", operacionesPendientes);
        
        const operacionesEnProceso = await operacionRepository.count({
            where: { estado_operacion: "en_proceso" }
        });
        console.log("📊 Operaciones en proceso:", operacionesEnProceso);

        // Contar productos totales
        const productoCount = await productoRepository.count({
            where: { activo: true }
        });
        console.log("📦 Total productos activos:", productoCount);
        
        // Materiales bajo stock
        const materiales = await materialRepository.find({
            where: { activo: true }
        });
        console.log("🔧 Total materiales activos:", materiales.length);
        
        const materialesBajoStock = materiales.filter(m => 
            m.existencia_material <= m.stock_minimo
        ).length;
        console.log("⚠️ Materiales bajo stock:", materialesBajoStock);
        
        // Calcular ingresos del mes actual
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        console.log("📅 Inicio del mes:", inicioMes);
        
        const operacionesCompletadas = await operacionRepository
            .createQueryBuilder("operacion")
            .where("operacion.estado_operacion = :estado", { estado: "completada" })
            .andWhere("operacion.fecha_creacion >= :fecha", { fecha: inicioMes })
            .getMany();
        console.log("💰 Operaciones completadas este mes:", operacionesCompletadas.length);
        
        const ingresosMesActual = operacionesCompletadas.reduce(
            (total, op) => total + parseFloat(op.costo_operacion || 0),
            0
        );
        console.log("💵 Ingresos mes actual:", ingresosMesActual);

        // 🔔 INDICADORES VISUALES - Operaciones Atrasadas
        const hoy = new Date();
        const operacionesAtrasadas = await operacionRepository
            .createQueryBuilder("operacion")
            .where("operacion.estado_operacion IN (:...estados)", { estados: ["pendiente", "en_proceso"] })
            .andWhere("operacion.fecha_estimada_entrega < :hoy", { hoy })
            .getCount();
        console.log("⏰ Operaciones atrasadas:", operacionesAtrasadas);

        // 💰 INDICADORES VISUALES - Clientes con deuda mayor a X días
        const diasLimiteDeuda = 30; // Días para considerar deuda significativa
        const fechaLimiteDeuda = new Date();
        fechaLimiteDeuda.setDate(fechaLimiteDeuda.getDate() - diasLimiteDeuda);

        const clientesConDeuda = await operacionRepository
            .createQueryBuilder("operacion")
            .leftJoinAndSelect("operacion.cliente", "cliente")
            .where("operacion.estado_operacion = :estado", { estado: "completada" })
            .andWhere("operacion.monto_pagado < operacion.costo_operacion")
            .andWhere("operacion.fecha_creacion < :fechaLimite", { fechaLimite: fechaLimiteDeuda })
            .select("COUNT(DISTINCT cliente.rut_cliente)", "count")
            .getRawOne();

        const clientesConDeudaCount = parseInt(clientesConDeuda?.count || 0);
        console.log(`💳 Clientes con deuda mayor a ${diasLimiteDeuda} días:`, clientesConDeudaCount);

        // 📅 INDICADORES VISUALES - Días desde última operación
        const ultimaOperacion = await operacionRepository
            .createQueryBuilder("operacion")
            .orderBy("operacion.fecha_creacion", "DESC")
            .getOne();

        let diasDesdeUltimaOperacion = 0;
        if (ultimaOperacion && ultimaOperacion.fecha_creacion) {
            const fechaUltima = new Date(ultimaOperacion.fecha_creacion);
            const diferenciaMilisegundos = hoy - fechaUltima;
            diasDesdeUltimaOperacion = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
        }
        console.log("📆 Días desde última operación:", diasDesdeUltimaOperacion);

        const resultado = {
            operacionesPendientes,
            operacionesEnProceso,
            productoCount,
            materialesBajoStock,
            ingresosMesActual: parseFloat(ingresosMesActual.toFixed(2)),
            // Nuevos indicadores visuales
            operacionesAtrasadas,
            clientesConDeuda: clientesConDeudaCount,
            diasLimiteDeuda,
            diasDesdeUltimaOperacion,
            fecha_consulta: new Date()
        };

        console.log("📊 RESULTADO FINAL:", JSON.stringify(resultado, null, 2));
        console.log("=== FIN getDashboardStats ===");

        // ⚠️ CAMBIO IMPORTANTE: Retorna el objeto directamente, NO en un array
        return [resultado, null];
        
    } catch (error) {
        console.error("❌ ERROR en getDashboardStats:", error);
        console.error("Stack trace:", error.stack);
        return [null, error.message];
    }
}
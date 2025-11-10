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

        // Contar operaciones atrasadas (fecha_entrega_estimada < hoy y no completadas)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const operacionesAtrasadas = await operacionRepository
            .createQueryBuilder("operacion")
            .where("operacion.fecha_entrega_estimada IS NOT NULL")
            .andWhere("operacion.fecha_entrega_estimada < :hoy", { hoy })
            .andWhere("operacion.estado_operacion NOT IN (:...estadosFinales)", {
                estadosFinales: ["completada", "pagada", "entregada", "anulada"]
            })
            .getCount();
        console.log("⏰ Operaciones atrasadas:", operacionesAtrasadas);

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
        // Contamos operaciones completadas cuyo primer abono (orden_trabajo) fue este mes
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        console.log("📅 Inicio del mes:", inicioMes);

        const historialRepository = AppDataSource.getRepository("Historial");

        // Buscar historial donde orden_trabajo = true y fecha_cambio >= inicioMes
        const historialesOrdenTrabajo = await historialRepository
            .createQueryBuilder("historial")
            .leftJoinAndSelect("historial.operacion", "operacion")
            .where("historial.orden_trabajo = :ordenTrabajo", { ordenTrabajo: true })
            .andWhere("historial.fecha_cambio >= :fecha", { fecha: inicioMes })
            .andWhere("operacion.estado_operacion = :estado", { estado: "completada" })
            .getMany();

        console.log("💰 Operaciones con orden de trabajo este mes y completadas:", historialesOrdenTrabajo.length);

        const ingresosMesActual = historialesOrdenTrabajo.reduce(
            (total, historial) => {
                const costo = parseFloat(historial.operacion?.costo_operacion || 0);
                return total + costo;
            },
            0
        );
        console.log("💵 Ingresos mes actual (desde primer abono):", ingresosMesActual);
        
        const resultado = {
            operacionesPendientes,
            operacionesEnProceso,
            operacionesAtrasadas,
            productoCount,
            materialesBajoStock,
            ingresosMesActual: parseFloat(ingresosMesActual.toFixed(2)),
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
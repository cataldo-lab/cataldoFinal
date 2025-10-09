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
        
        const resultado = {
            operacionesPendientes,
            operacionesEnProceso,
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
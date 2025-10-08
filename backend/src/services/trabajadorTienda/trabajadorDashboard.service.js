// backend/src/services/trabajadorTienda/trabajadorDashboard.service.js
import { AppDataSource } from "../../config/configDb.js";

export async function getDashboardStats() {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");
        const productoRepository = AppDataSource.getRepository("Producto");
        const materialRepository = AppDataSource.getRepository("Materiales");
        
        // Contar operaciones por estado
        const operacionesPendientes = await operacionRepository.count({
            where: { estado_operacion: "pendiente" }
        });
        
        const operacionesEnProceso = await operacionRepository.count({
            where: { estado_operacion: "en_proceso" }
        });
        
        // Total de productos
        const productosTotal = await productoRepository.count();
        
        // Materiales bajo stock
        const materiales = await materialRepository.find();
        const materialesBajoStock = materiales.filter(m => 
            m.existencia_material <= m.stock_minimo
        ).length;
        
        return [{
            operacionesPendientes,
            operacionesEnProceso,
            productosTotal,
            materialesBajoStock
        }, null];
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return [null, "Error al obtener estadísticas del dashboard"];
    }
}
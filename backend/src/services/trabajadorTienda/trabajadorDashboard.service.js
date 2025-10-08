// backend/src/services/trabajadorTienda/trabajadorDashboard.service.js
import { AppDataSource } from "../../config/configDb.js";
import ProductoSchema from "../../entity/producto.entity.js";

export async function getDashboardStats() {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");
        const materialRepository = AppDataSource.getRepository("Materiales");
        const productoRepository = AppDataSource.getRepository(ProductoSchema);
        
        // Contar operaciones por estado
        const operacionesPendientes = await operacionRepository.count({
            where: { estado_operacion: "pendiente" }
        });
        
        const operacionesEnProceso = await operacionRepository.count({
            where: { estado_operacion: "en_proceso" }
        });

        
         const productoCount = await productoRepository.createQueryBuilder("producto")
            .select("COUNT(DISTINCT producto.id_producto)", "count")
            .getRawOne()
            .then(result => parseInt(result.count));
        
        // Materiales bajo stock
        const materiales = await materialRepository.find();
        const materialesBajoStock = materiales.filter(m => 
            m.existencia_material <= m.stock_minimo
        ).length;
        
        return [{
            operacionesPendientes,
            operacionesEnProceso,
            productoCount,
            materialesBajoStock
        }, null];
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return [null, "Error al obtener estadísticas del dashboard"];
    }
}
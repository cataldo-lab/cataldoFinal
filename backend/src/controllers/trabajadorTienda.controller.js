// backend/src/controllers/trabajadorTienda.controller.js
"use strict";

import { getDashboardStats } from "../services/trabajadorTienda/trabajadorDashboard.service.js";
import { handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export async function getDashboard(req, res) {
    try {
        console.log("🎯 === CONTROLADOR getDashboard EJECUTADO ===");
        console.log("👤 Usuario autenticado:", req.user?.email);
        
        const [stats, error] = await getDashboardStats();
        
        console.log("📥 Respuesta del servicio:");
        console.log("  - stats:", JSON.stringify(stats, null, 2));
        console.log("  - error:", error);
        
        if (error) {
            console.log("⚠️ Retornando error del servicio");
            return handleErrorServer(res, 500, error);
        }
        
        // ⚠️ CAMBIO: Ya no accedemos a stats[0], usamos stats directamente
        if (!stats || Object.keys(stats).length === 0) {
            console.log("⚠️ Stats vacío, retornando mensaje");
            return handleSuccess(res, 200, "No hay estadísticas disponibles", null);
        }
        
        console.log("✅ Enviando respuesta exitosa al cliente");
        handleSuccess(res, 200, "Estadísticas obtenidas", stats);
    } catch (error) {
        console.error("💥 ERROR en controlador getDashboard:", error);
        handleErrorServer(res, 500, error.message);
    }
}
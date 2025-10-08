"use strict";

import { getDashboardStats } from "../services/trabajadorTienda/trabajadorDashboard.service.js";
import { handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export async function getDashboard(req, res) {
    try {
        const [stats, error] = await getDashboardStats();
        
        if (error) {
            return handleErrorServer(res, 500, error);
        }
        
        // Validar que stats existe y tiene datos
        if (!stats || stats.length === 0) {
            return handleSuccess(res, 200, "No hay estadísticas disponibles", null);
        }
        
        handleSuccess(res, 200, "Estadísticas obtenidas", stats[0]);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
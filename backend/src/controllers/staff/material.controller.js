// backend/src/controllers/staff/material.controller.js
"use strict";
import {
  createMaterialService,
  updateMaterialService,
  deleteMaterialService,
  hardDeleteMaterialService,
  getMaterialByIdService,
  getAllMaterialesService,
  getMaterialRepresentanteService,
  getMaterialesConRepresentantesService
} from "../../services/staff/material.service.js";


export async function createMaterial(req, res) {
  try {
    const materialData = req.body;

    const [material, error] = await createMaterialService(materialData);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    return res.status(201).json({
      success: true,
      message: "Material creado exitosamente",
      data: material
    });

  } catch (error) {
    console.error("Error en createMaterial controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}


export async function getMaterialById(req, res) {
  try {
    const { id } = req.params;
    const id_material = parseInt(id);

    if (isNaN(id_material)) {
      return res.status(400).json({
        success: false,
        message: "ID de material inválido"
      });
    }

    const [material, error] = await getMaterialByIdService(id_material);

    if (error) {
      return res.status(404).json({
        success: false,
        message: error
      });
    }

    return res.status(200).json({
      success: true,
      data: material
    });

  } catch (error) {
    console.error("Error en getMaterialById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}


export async function getAllMateriales(req, res) {
  try {
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const soloActivos = !incluirInactivos;

    const [materiales, error] = await getAllMaterialesService(soloActivos);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error
      });
    }

    return res.status(200).json({
      success: true,
      data: materiales,
      count: materiales.length
    });

  } catch (error) {
    console.error("Error en getAllMateriales controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}


export async function updateMaterial(req, res) {
  try {
    const { id } = req.params;
    const id_material = parseInt(id);
    const materialData = req.body;

    if (isNaN(id_material)) {
      return res.status(400).json({
        success: false,
        message: "ID de material inválido"
      });
    }

    const [material, error] = await updateMaterialService(id_material, materialData);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    return res.status(200).json({
      success: true,
      message: "Material actualizado exitosamente",
      data: material
    });

  } catch (error) {
    console.error("Error en updateMaterial controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}


export async function deleteMaterial(req, res) {
  try {
    const { id } = req.params;
    const id_material = parseInt(id);

    if (isNaN(id_material)) {
      return res.status(400).json({
        success: false,
        message: "ID de material inválido"
      });
    }

    const [result, error] = await deleteMaterialService(id_material);

    if (error) {
      return res.status(404).json({
        success: false,
        message: error
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("Error en deleteMaterial controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}


export async function hardDeleteMaterial(req, res) {
  try {
    const { id } = req.params;
    const id_material = parseInt(id);

    if (isNaN(id_material)) {
      return res.status(400).json({
        success: false,
        message: "ID de material inválido"
      });
    }

    const [result, error] = await hardDeleteMaterialService(id_material);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("Error en hardDeleteMaterial controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}


export async function getMaterialRepresentante(req, res) {
  try {
    const { id } = req.params;
    const id_material = parseInt(id);

    if (isNaN(id_material)) {
      return res.status(400).json({
        success: false,
        message: "ID de material inválido"
      });
    }

    const [representante, error] = await getMaterialRepresentanteService(id_material);

    if (error) {
      return res.status(404).json({
        success: false,
        message: error
      });
    }

    return res.status(200).json({
      success: true,
      data: representante
    });

  } catch (error) {
    console.error("Error en getMaterialRepresentante controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}


export async function getMaterialesConRepresentantes(req, res) {
  try {
    const [materiales, error] = await getMaterialesConRepresentantesService();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error
      });
    }

    return res.status(200).json({
      success: true,
      data: materiales,
      count: materiales.length
    });

  } catch (error) {
    console.error("Error en getMaterialesConRepresentantes controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}
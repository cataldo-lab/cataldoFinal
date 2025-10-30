// backend/src/services/staff/material.service.js
"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { detectarCategoria } from "../../entity/materiales.entity.js";


export async function createMaterialService(materialData) {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");
    const proveedorRepository = AppDataSource.getRepository("Proveedores");

    // Validar campos requeridos
    if (!materialData.nombre_material || !materialData.unidad_medida || !materialData.precio_unitario) {
      return [null, "Faltan campos requeridos"];
    }

    // Validar proveedor si se proporciona
    let proveedor = null;
    if (materialData.id_proveedor) {
      proveedor = await proveedorRepository.findOne({
        where: { id_proveedor: materialData.id_proveedor }
      });

      if (!proveedor) {
        return [null, "Proveedor no encontrado"];
      }
    }

    const categoria_unidad = detectarCategoria(materialData.unidad_medida);

    // Crear el material
    const nuevoMaterial = materialRepository.create({
      nombre_material: materialData.nombre_material,
      existencia_material: materialData.existencia_material || 0,
      unidad_medida: materialData.unidad_medida,
      categoria_unidad: categoria_unidad,
      precio_unitario: parseFloat(materialData.precio_unitario),
      stock_minimo: materialData.stock_minimo || 1,
      activo: materialData.activo !== undefined ? materialData.activo : true,
      proveedor: proveedor
    });

    const materialGuardado = await materialRepository.save(nuevoMaterial);

    const materialCompleto = await materialRepository.findOne({
      where: { id_material: materialGuardado.id_material },
      relations: ["proveedor"]
    });

    return [materialCompleto, null];

  } catch (error) {
    console.error("Error al crear material:", error);
    return [null, "Error interno del servidor al crear material"];
  }
}

export async function updateMaterialService(id_material, materialData) {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");
    const proveedorRepository = AppDataSource.getRepository("Proveedores");
    const representanteRepository = AppDataSource.getRepository("Representante");

    console.log('🔍 Buscando material ID:', id_material);
    console.log('📦 Datos recibidos:', materialData);

    const material = await materialRepository.findOne({
      where: { id_material: parseInt(id_material) },
      relations: ["proveedor"]
    });

    if (!material) {
      console.error('❌ Material no encontrado con ID:', id_material);
      return [null, "Material no encontrado"];
    }

    console.log('✅ Material encontrado:', material.nombre_material);

    // Actualizar proveedor si se proporciona
    if (materialData.id_proveedor !== undefined) {
      if (materialData.id_proveedor && materialData.id_proveedor !== '') {
        const proveedorId = parseInt(materialData.id_proveedor);
        console.log('🔍 Buscando proveedor ID:', proveedorId);
        
        const proveedor = await proveedorRepository.findOne({
          where: { id_proveedor: proveedorId }
        });

        if (!proveedor) {
          console.error('❌ Proveedor no encontrado:', proveedorId);
          return [null, "Proveedor no encontrado"];
        }
        
        console.log('✅ Proveedor encontrado:', proveedor.rol_proveedor);
        material.proveedor = proveedor;
      } else {
        console.log('🔄 Removiendo proveedor del material');
        material.proveedor = null;
      }
    }

    // Actualizar campos del material
    console.log('📝 Actualizando campos...');
    
    if (materialData.nombre_material !== undefined) {
      material.nombre_material = materialData.nombre_material.trim();
      console.log('  ✓ Nombre:', material.nombre_material);
    }
    if (materialData.existencia_material !== undefined) {
      material.existencia_material = parseInt(materialData.existencia_material);
      console.log('  ✓ Existencia:', material.existencia_material);
    }
    if (materialData.unidad_medida !== undefined) {
      material.unidad_medida = materialData.unidad_medida;
      material.categoria_unidad = detectarCategoria(materialData.unidad_medida);
      console.log('  ✓ Unidad:', material.unidad_medida);
    }
    if (materialData.precio_unitario !== undefined) {
      material.precio_unitario = parseFloat(materialData.precio_unitario);
      console.log('  ✓ Precio:', material.precio_unitario);
    }
    if (materialData.stock_minimo !== undefined) {
      material.stock_minimo = parseInt(materialData.stock_minimo);
      console.log('  ✓ Stock mínimo:', material.stock_minimo);
    }
    if (materialData.activo !== undefined) {
      material.activo = Boolean(materialData.activo);
      console.log('  ✓ Activo:', material.activo);
    }

    console.log('💾 Guardando material actualizado...');
    
    try {
      const materialActualizado = await materialRepository.save(material);
      console.log('✅ Material guardado en BD');
      
      // Obtener el material completo con proveedor
      const materialCompleto = await materialRepository.findOne({
        where: { id_material: materialActualizado.id_material },
        relations: ["proveedor"]
      });

      // Buscar representante si hay proveedor
      let representante = null;
      if (materialCompleto.proveedor) {
        console.log('🔍 Buscando representante del proveedor...');
        representante = await representanteRepository.findOne({
          where: { proveedor: { id_proveedor: materialCompleto.proveedor.id_proveedor } }
        });
        
        if (representante) {
          console.log('✅ Representante encontrado:', representante.nombre_representante);
        } else {
          console.log('ℹ️ No hay representante para este proveedor');
        }
      }

      // Construir respuesta
      const resultado = {
        id_material: materialCompleto.id_material,
        nombre_material: materialCompleto.nombre_material,
        existencia_material: materialCompleto.existencia_material,
        unidad_medida: materialCompleto.unidad_medida,
        precio_unitario: parseFloat(materialCompleto.precio_unitario),
        stock_minimo: materialCompleto.stock_minimo,
        activo: materialCompleto.activo,
        proveedor: materialCompleto.proveedor ? {
          id_proveedor: materialCompleto.proveedor.id_proveedor,
          rol_proveedor: materialCompleto.proveedor.rol_proveedor
        } : null,
        representante: representante ? {
          id_representante: representante.id_representante,
          nombre_completo: `${representante.nombre_representante} ${representante.apellido_representante}`,
          fono_representante: representante.fono_representante,
          correo_representante: representante.correo_representante,
          cargo_representante: representante.cargo_representante
        } : null
      };

      console.log('✅ Material actualizado correctamente');
      return [resultado, null];
      
    } catch (saveError) {
      console.error('❌ Error al guardar en BD:', saveError);
      throw saveError;
    }

  } catch (error) {
    console.error("❌ Error al actualizar material:", error);
    console.error("❌ Stack:", error.stack);
    return [null, "Error interno del servidor al actualizar material"];
  }
}


export async function deleteMaterialService(id_material) {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");

    const material = await materialRepository.findOne({
      where: { id_material }
    });

    if (!material) {
      return [null, "Material no encontrado"];
    }

    material.activo = false;
    await materialRepository.save(material);

    return [{ message: "Material desactivado exitosamente", id_material }, null];

  } catch (error) {
    console.error("Error al eliminar material:", error);
    return [null, "Error interno del servidor al eliminar material"];
  }
}


export async function hardDeleteMaterialService(id_material) {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");

    const material = await materialRepository.findOne({
      where: { id_material }
    });

    if (!material) {
      return [null, "Material no encontrado"];
    }

    const productoMaterialesRepository = AppDataSource.getRepository("ProductoMateriales");
    const relacionesProductos = await productoMaterialesRepository.count({
      where: { material: { id_material } }
    });

    if (relacionesProductos > 0) {
      return [null, "No se puede eliminar el material porque está siendo usado en productos"];
    }

    await materialRepository.remove(material);

    return [{ message: "Material eliminado permanentemente", id_material }, null];

  } catch (error) {
    console.error("Error al eliminar permanentemente material:", error);
    return [null, "Error interno del servidor al eliminar material"];
  }
}

export async function getMaterialByIdService(id_material) {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");

    const material = await materialRepository.findOne({
      where: { id_material },
      relations: ["proveedor"]
    });

    if (!material) {
      return [null, "Material no encontrado"];
    }

    return [material, null];

  } catch (error) {
    console.error("Error al obtener material:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function getAllMaterialesService(soloActivos = true) {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");

    const whereCondition = soloActivos ? { activo: true } : {};

    const materiales = await materialRepository.find({
      where: whereCondition,
      relations: ["proveedor"],
      order: { nombre_material: "ASC" }
    });

    return [materiales, null];

  } catch (error) {
    console.error("Error al obtener materiales:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMaterialRepresentanteService(id_material) {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");
    const representanteRepository = AppDataSource.getRepository("Representante");

    const material = await materialRepository.findOne({
      where: { id_material },
      relations: ["proveedor"]
    });

    if (!material) {
      return [null, "Material no encontrado"];
    }

    if (!material.proveedor) {
      return [null, "El material no tiene un proveedor asociado"];
    }

    const representante = await representanteRepository.findOne({
      where: { proveedor: { id_proveedor: material.proveedor.id_proveedor } },
      relations: ["proveedor"]
    });

    if (!representante) {
      return [null, "No se encontró representante para este proveedor"];
    }

    const representanteData = {
      id_representante: representante.id_representante,
      nombre_completo: `${representante.nombre_representante} ${representante.apellido_representante}`,
      nombre_representante: representante.nombre_representante,
      apellido_representante: representante.apellido_representante,
      rut_representante: representante.rut_representante,
      cargo_representante: representante.cargo_representante,
      fono_representante: representante.fono_representante,
      correo_representante: representante.correo_representante,
      proveedor: {
        id_proveedor: representante.proveedor.id_proveedor,
        rol_proveedor: representante.proveedor.rol_proveedor,
        rut_proveedor: representante.proveedor.rut_proveedor
      }
    };

    return [representanteData, null];

  } catch (error) {
    console.error("Error al obtener representante del material:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function getMaterialesConRepresentantesService() {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");
    const representanteRepository = AppDataSource.getRepository("Representante");

    const materiales = await materialRepository.find({
      where: { activo: true },
      relations: ["proveedor"]
    });

    const materialesConRepresentantes = await Promise.all(
      materiales.map(async (material) => {
        let representante = null;

        if (material.proveedor) {
          representante = await representanteRepository.findOne({
            where: { proveedor: { id_proveedor: material.proveedor.id_proveedor } }
          });
        }

        return {
          id_material: material.id_material,
          nombre_material: material.nombre_material,
          existencia_material: material.existencia_material,
          unidad_medida: material.unidad_medida,
          precio_unitario: parseFloat(material.precio_unitario),
          stock_minimo: material.stock_minimo,
          proveedor: material.proveedor ? {
            id_proveedor: material.proveedor.id_proveedor,
            rol_proveedor: material.proveedor.rol_proveedor
          } : null,
          representante: representante ? {
            id_representante: representante.id_representante,
            nombre_completo: `${representante.nombre_representante} ${representante.apellido_representante}`,
            fono_representante: representante.fono_representante,
            correo_representante: representante.correo_representante,
            cargo_representante: representante.cargo_representante
          } : null
        };
      })
    );

    return [materialesConRepresentantes, null];

  } catch (error) {
    console.error("Error al obtener materiales con representantes:", error);
    return [null, "Error interno del servidor"];
  }
}
"use strict";
import User from "../entity/personas/user.entity.js";
import { PaisSchema } from "../entity/direccion/pais.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { ProvinciaSchema } from "../entity/direccion/provincia.entity.js";
import { RegionSchema } from "../entity/direccion/region.entity.js";
import { ComunaSchema } from "../entity/direccion/comuna.entity.js";
import { proveedoresSchema } from "../entity/proveedores.entity.js";
import { MaterialesSchema } from "../entity/materiales.entity.js";
import { CostoTercerosSchema } from "../entity/costoTerceros.entity.js";
import { ProductoSchema } from "../entity/producto.entity.js";

async function createPaises() {
  try {
    const paisRepository = AppDataSource.getRepository("Pais");
    
    const count = await paisRepository.count();
    if (count > 0) {
      console.log("* => Países ya existen, omitiendo creación");
      return;
    }

    await Promise.all([
      paisRepository.save(
        paisRepository.create({
          nombre_pais: "Chile"
        })
      ),
      paisRepository.save(
        paisRepository.create({
          nombre_pais: "Argentina"
        })
      ),
      paisRepository.save(
        paisRepository.create({
          nombre_pais: "Perú"
        })
      )
    ]);
    
    console.log("* => Países creados exitosamente");
  } catch (error) {
    console.error("Error al crear países:", error);
    throw error;
  }
}

async function createRegiones() {
  try {
    const regionRepository = AppDataSource.getRepository("Region");
    const paisRepository = AppDataSource.getRepository("Pais");
    
    const count = await regionRepository.count();
    if (count > 0) {
      console.log("* => Regiones ya existen, omitiendo creación");
      return;
    }

    const chile = await paisRepository.findOne({ where: { nombre_pais: "Chile" } });
    if (!chile) {
      console.error("No se encontró el país Chile para crear regiones");
      throw new Error("País Chile no encontrado");
    }

    const regiones = [
      "Región de Arica y Parinacota",
      "Región de Tarapacá", 
      "Región de Antofagasta",
      "Región de Atacama",
      "Región de Coquimbo",
      "Región de Valparaíso",
      "Región Metropolitana",
      "Región del Libertador General Bernardo O'Higgins",
      "Región del Maule",
      "Región de Ñuble",
      "Región del Biobío",
      "Región de la Araucanía",
      "Región de Los Ríos",
      "Región de Los Lagos",
      "Región Aysén del General Carlos Ibáñez del Campo",
      "Región de Magallanes y de la Antártica Chilena"
    ];

    await Promise.all(
      regiones.map(nombreRegion =>
        regionRepository.save(
          regionRepository.create({
            nombre_region: nombreRegion,
            pais: chile
          })
        )
      )
    );
    
    console.log("* => Regiones creadas exitosamente");
  } catch (error) {
    console.error("Error al crear regiones:", error);
    throw error;
  }
}

async function createProvincias() {
  try {
    const provinciaRepository = AppDataSource.getRepository("Provincia");
    const regionRepository = AppDataSource.getRepository("Region");
    
    const count = await provinciaRepository.count();
    if (count > 0) {
      console.log("* => Provincias ya existen, omitiendo creación");
      return;
    }

    const biobio = await regionRepository.findOne({ 
      where: { nombre_region: "Región del Biobío" } 
    });
    
    if (!biobio) {
      console.error("No se encontró la Región del Biobío para crear provincias");
      throw new Error("Región del Biobío no encontrada");
    }

    const provincias = [
      "Provincia de Concepción",
      "Provincia de Arauco", 
      "Provincia del Biobío"
    ];

    await Promise.all(
      provincias.map(nombreProvincia =>
        provinciaRepository.save(
          provinciaRepository.create({
            nombre_provincia: nombreProvincia,
            region: biobio
          })
        )
      )
    );
    
    console.log("* => Provincias creadas exitosamente");
  } catch (error) {
    console.error("Error al crear provincias:", error);
    throw error;
  }
}

async function createComunas() {
  try {
    const comunaRepository = AppDataSource.getRepository("Comuna");
    const provinciaRepository = AppDataSource.getRepository("Provincia");
    
    const count = await comunaRepository.count();
    if (count > 0) {
      console.log("* => Comunas ya existen, omitiendo creación");
      return;
    }

    const concepcion = await provinciaRepository.findOne({ 
      where: { nombre_provincia: "Provincia de Concepción" } 
    });
    
    if (!concepcion) {
      console.error("No se encontró la Provincia de Concepción para crear comunas");
      throw new Error("Provincia de Concepción no encontrada");
    }

    const comunas = [
      "Concepción",
      "Talcahuano",
      "Hualpén",
      "Chiguayante",
      "San Pedro de la Paz",
      "Coronel",
      "Lota",
      "Tomé",
      "Penco",
      "Hualqui",
      "Santa Juana",
      "Florida"
    ];

    await Promise.all(
      comunas.map(nombreComuna =>
        comunaRepository.save(
          comunaRepository.create({
            nombre_comuna: nombreComuna,
            provincia: concepcion
          })
        )
      )
    );
    
    console.log("* => Comunas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear comunas:", error);
    throw error;
  }
}

async function createProveedores() {
  try {
    const proveedorRepository = AppDataSource.getRepository("Proveedores");
    
    const count = await proveedorRepository.count();
    if (count > 0) {
      console.log("* => Proveedores ya existen, omitiendo creación");
      return;
    }

    await Promise.all([
      proveedorRepository.save(
        proveedorRepository.create({
          rol_proveedor: "Materiales de Construcción",
          rut_proveedor: "76.123.456-7",
          nombre_representanter: "Carlos",
          apellido_representante: "Mendoza",
          rut_representante: "12.345.678-9",
          fono_proveedor: "+56912345678",
          correo_proveedor: "contacto@maderasur.cl"
        })
      ),
      proveedorRepository.save(
        proveedorRepository.create({
          rol_proveedor: "Vidrios y Cristales",
          rut_proveedor: "77.987.654-3",
          nombre_representanter: "María",
          apellido_representante: "González",
          rut_representante: "19.876.543-2",
          fono_proveedor: "+56987654321",
          correo_proveedor: "ventas@vidrioscentro.cl"
        })
      ),
      proveedorRepository.save(
        proveedorRepository.create({
          rol_proveedor: "Telas y Tapicería",
          rut_proveedor: "75.555.666-K",
          nombre_representanter: "Roberto",
          apellido_representante: "Silva",
          rut_representante: "16.555.777-8",
          fono_proveedor: "+56955577788",
          correo_proveedor: "info@telasdecor.cl"
        })
      ),
      proveedorRepository.save(
        proveedorRepository.create({
          rol_proveedor: "Herrajes y Accesorios",
          rut_proveedor: "78.111.222-4",
          nombre_representanter: "Ana",
          apellido_representante: "Rodríguez",
          rut_representante: "14.222.333-5",
          fono_proveedor: "+56933344455",
          correo_proveedor: "ventas@herrajeschile.cl"
        })
      )
    ]);
    
    console.log("* => Proveedores creados exitosamente");
  } catch (error) {
    console.error("Error al crear proveedores:", error);
    throw error;
  }
}

async function createMateriales() {
  try {
    const materialRepository = AppDataSource.getRepository("Materiales");
    const proveedorRepository = AppDataSource.getRepository("Proveedores");
    
    const count = await materialRepository.count();
    if (count > 0) {
      console.log("* => Materiales ya existen, omitiendo creación");
      return;
    }

    const proveedorMadera = await proveedorRepository.findOne({ 
      where: { rol_proveedor: "Materiales de Construcción" } 
    });
    const proveedorVidrio = await proveedorRepository.findOne({ 
      where: { rol_proveedor: "Vidrios y Cristales" } 
    });
    const proveedorTela = await proveedorRepository.findOne({ 
      where: { rol_proveedor: "Telas y Tapicería" } 
    });
    const proveedorHerrajes = await proveedorRepository.findOne({ 
      where: { rol_proveedor: "Herrajes y Accesorios" } 
    });

    if (!proveedorMadera || !proveedorVidrio || !proveedorTela || !proveedorHerrajes) {
      throw new Error("No se encontraron todos los proveedores necesarios");
    }

    await Promise.all([
      // Materiales de madera
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Tablero MDF 18mm",
          existencia_material: 50,
          unidad_medida: "plancha",
          precio_unitario: 25000,
          stock_minimo: 10,
          proveedor: proveedorMadera
        })
      ),
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Tablero Aglomerado 15mm",
          existencia_material: 30,
          unidad_medida: "plancha",
          precio_unitario: 18000,
          stock_minimo: 8,
          proveedor: proveedorMadera
        })
      ),
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Madera Pino Radiata 2x4",
          existencia_material: 100,
          unidad_medida: "metro",
          precio_unitario: 3500,
          stock_minimo: 20,
          proveedor: proveedorMadera
        })
      ),
      // Materiales de vidrio
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Vidrio Transparente 4mm",
          existencia_material: 25,
          unidad_medida: "m2",
          precio_unitario: 12000,
          stock_minimo: 5,
          proveedor: proveedorVidrio
        })
      ),
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Espejo 3mm",
          existencia_material: 15,
          unidad_medida: "m2",
          precio_unitario: 18000,
          stock_minimo: 3,
          proveedor: proveedorVidrio
        })
      ),
      // Materiales de tapicería
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Tela Chenille",
          existencia_material: 200,
          unidad_medida: "metro",
          precio_unitario: 8500,
          stock_minimo: 20,
          proveedor: proveedorTela
        })
      ),
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Espuma Tapicería 5cm",
          existencia_material: 80,
          unidad_medida: "m2",
          precio_unitario: 6000,
          stock_minimo: 15,
          proveedor: proveedorTela
        })
      ),
      // Herrajes
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Bisagras Piano 1.5m",
          existencia_material: 40,
          unidad_medida: "unidad",
          precio_unitario: 4500,
          stock_minimo: 10,
          proveedor: proveedorHerrajes
        })
      ),
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Tornillos Madera 4x40",
          existencia_material: 500,
          unidad_medida: "unidad",
          precio_unitario: 50,
          stock_minimo: 100,
          proveedor: proveedorHerrajes
        })
      ),
      materialRepository.save(
        materialRepository.create({
          nombre_material: "Cola Fría 1kg",
          existencia_material: 20,
          unidad_medida: "kg",
          precio_unitario: 3500,
          stock_minimo: 5,
          proveedor: proveedorMadera
        })
      )
    ]);
    
    console.log("* => Materiales creados exitosamente");
  } catch (error) {
    console.error("Error al crear materiales:", error);
    throw error;
  }
}

async function createCostosTerceros() {
  try {
    const costoTercerosRepository = AppDataSource.getRepository("CostoTerceros");
    
    const count = await costoTercerosRepository.count();
    if (count > 0) {
      console.log("* => Costos terceros ya existen, omitiendo creación");
      return;
    }

    await Promise.all([
      costoTercerosRepository.save(
        costoTercerosRepository.create({
          gastos_fijos_ind: 150000,
          gastos_fijos_dir: 200000,
          anno: 2024
        })
      ),
      costoTercerosRepository.save(
        costoTercerosRepository.create({
          gastos_fijos_ind: 160000,
          gastos_fijos_dir: 220000,
          anno: 2025
        })
      )
    ]);
    
    console.log("* => Costos terceros creados exitosamente");
  } catch (error) {
    console.error("Error al crear costos terceros:", error);
    throw error;
  }
}

async function createProductos() {
  try {
    const productoRepository = AppDataSource.getRepository("Producto");
    const costoTercerosRepository = AppDataSource.getRepository("CostoTerceros");
    
    const count = await productoRepository.count();
    if (count > 0) {
      console.log("* => Productos ya existen, omitiendo creación");
      return;
    }

    const costoTerceros2024 = await costoTercerosRepository.findOne({
      where: { anno: 2024 }
    });

    if (!costoTerceros2024) {
      throw new Error("No se encontraron costos terceros para 2024");
    }

    await Promise.all([
      // Muebles
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Mesa de Comedor 6 personas",
          categoria_producto: "Mesas",
          descripcion_producto: "Mesa de comedor rectangular para 6 personas, madera MDF con acabado laqueado",
          costo_fabricacion: 80000,
          costo_barnizador: 15000,
          costo_vidrio: 25000,
          costo_tela: 0,
          costo_materiales_otros: 10000,
          precio_venta: 180000,
          margen_ganancia: 38.46,
          costoTerceros: costoTerceros2024
        })
      ),
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Silla Tapizada Clásica",
          categoria_producto: "Sillas",
          descripcion_producto: "Silla con estructura de madera y tapizado en tela chenille",
          costo_fabricacion: 35000,
          costo_barnizador: 8000,
          costo_vidrio: 0,
          costo_tela: 12000,
          costo_materiales_otros: 5000,
          precio_venta: 85000,
          margen_ganancia: 41.76,
          costoTerceros: costoTerceros2024
        })
      ),
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Ropero 3 Puertas con Espejo",
          categoria_producto: "Armarios",
          descripcion_producto: "Ropero de 3 puertas, 2 compartimentos y puerta central con espejo",
          costo_fabricacion: 120000,
          costo_barnizador: 20000,
          costo_vidrio: 35000,
          costo_tela: 0,
          costo_materiales_otros: 15000,
          precio_venta: 280000,
          margen_ganancia: 47.37,
          costoTerceros: costoTerceros2024
        })
      ),
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Cómoda 4 Cajones",
          categoria_producto: "Cómodas",
          descripcion_producto: "Cómoda con 4 cajones amplios, ideal para dormitorio",
          costo_fabricacion: 60000,
          costo_barnizador: 12000,
          costo_vidrio: 0,
          costo_tela: 0,
          costo_materiales_otros: 8000,
          precio_venta: 120000,
          margen_ganancia: 33.33,
          costoTerceros: costoTerceros2024
        })
      ),
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Estante Biblioteca 5 Niveles",
          categoria_producto: "Estanterías",
          descripcion_producto: "Estante de 5 niveles para libros, con respaldo",
          costo_fabricacion: 45000,
          costo_barnizador: 10000,
          costo_vidrio: 0,
          costo_tela: 0,
          costo_materiales_otros: 5000,
          precio_venta: 95000,
          margen_ganancia: 36.84,
          costoTerceros: costoTerceros2024
        })
      ),
      // Servicios
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Reparación de Silla",
          categoria_producto: "Reparaciones",
          descripcion_producto: "Servicio de reparación de sillas (estructura, tapizado, etc)",
          costo_fabricacion: 15000,
          costo_barnizador: 5000,
          costo_vidrio: 0,
          costo_tela: 8000,
          costo_materiales_otros: 2000,
          precio_venta: 45000,
          margen_ganancia: 50.00,
          servicio: true,
          costoTerceros: costoTerceros2024
        })
      ),
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Restauración de Mesa Antigua",
          categoria_producto: "Restauraciones",
          descripcion_producto: "Servicio completo de restauración de mesas antiguas",
          costo_fabricacion: 40000,
          costo_barnizador: 25000,
          costo_vidrio: 0,
          costo_tela: 0,
          costo_materiales_otros: 10000,
          precio_venta: 120000,
          margen_ganancia: 60.00,
          servicio: true,
          costoTerceros: costoTerceros2024
        })
      ),
      productoRepository.save(
        productoRepository.create({
          nombre_producto: "Mueble a Medida",
          categoria_producto: "Personalizados",
          descripcion_producto: "Diseño y fabricación de mueble personalizado según especificaciones del cliente",
          costo_fabricacion: 100000,
          costo_barnizador: 20000,
          costo_vidrio: 15000,
          costo_tela: 10000,
          costo_materiales_otros: 15000,
          precio_venta: 250000,
          margen_ganancia: 56.00,
          servicio: true,
          costoTerceros: costoTerceros2024
        })
      )
    ]);
    
    console.log("* => Productos creados exitosamente");
  } catch (error) {
    console.error("Error al crear productos:", error);
    throw error;
  }
}

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) {
      console.log("* => Usuario administrador ya existe, omitiendo creación");
      return;
    }

    await userRepository.save(
      userRepository.create({
        nombreCompleto: "Administrador del Sistema",
        rut: "11.111.111-1",
        email: "admin.sistema@gmail.cl",
        password: await encryptPassword("admin2024"),
        rol: "administrador",
        telefono: "+56912345678"
      })
    );

    console.log("* => Usuario administrador creado exitosamente");
  } catch (error) {
    console.error("Error al crear usuario administrador:", error);
    throw error;
  }
}

// Función principal que ejecuta todo el setup inicial
export async function runInitialSetup() {
  console.log("🚀 Iniciando configuración inicial de la base de datos...");
  
  try {
    // Ejecutar en orden de dependencias
    await createPaises();
    await createRegiones();
    await createProvincias();
    await createComunas();
    await createProveedores();
    await createMateriales();
    await createCostosTerceros();
    await createProductos();
    await createUsers();
    
    console.log("✅ Configuración inicial completada exitosamente");
  } catch (error) {
    console.error("❌ Error durante la configuración inicial:", error);
    throw error;
  }
}

// Exportar funciones individuales para uso específico
export {
  createPaises,
  createRegiones,
  createProvincias,
  createComunas,
  createProveedores,
  createMateriales,
  createCostosTerceros,
  createProductos,
  createUsers
};
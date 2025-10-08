"use strict";
import User from "../entity/personas/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

/**
 * Utilidad para verificar si ya existen registros en una entidad
 */
async function existenRegistros(nombreEntidad, mensajeOmision) {
  const repository = AppDataSource.getRepository(nombreEntidad);
  const count = await repository.count();
  if (count > 0) {
    console.log(`* => ${mensajeOmision}`);
    return true;
  }
  return false;
}

/**
 * Crear países iniciales
 */
async function createPaises() {
  try {
    if (await existenRegistros("Pais", "Países ya existen, omitiendo creación")) {
      return;
    }

    const paisRepository = AppDataSource.getRepository("Pais");
    
    const paises = [
      { nombre_pais: "Chile" },
      { nombre_pais: "Argentina" },
      { nombre_pais: "Perú" }
    ];

    await Promise.all(
      paises.map(pais => paisRepository.save(paisRepository.create(pais)))
    );
    
    console.log("* => Países creados exitosamente");
  } catch (error) {
    console.error("Error al crear países:", error);
    throw error;
  }
}

/**
 * Crear regiones de Chile
 */
async function createRegiones() {
  try {
    if (await existenRegistros("Region", "Regiones ya existen, omitiendo creación")) {
      return;
    }

    const regionRepository = AppDataSource.getRepository("Region");
    const paisRepository = AppDataSource.getRepository("Pais");
    
    const chile = await paisRepository.findOne({ where: { nombre_pais: "Chile" } });
    if (!chile) {
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

/**
 * Crear provincias del Biobío
 */
async function createProvincias() {
  try {
    if (await existenRegistros("Provincia", "Provincias ya existen, omitiendo creación")) {
      return;
    }

    const provinciaRepository = AppDataSource.getRepository("Provincia");
    const regionRepository = AppDataSource.getRepository("Region");
    
    const biobio = await regionRepository.findOne({ 
      where: { nombre_region: "Región del Biobío" } 
    });
    
    if (!biobio) {
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

/**
 * Crear comunas de Concepción
 */
async function createComunas() {
  try {
    if (await existenRegistros("Comuna", "Comunas ya existen, omitiendo creación")) {
      return;
    }

    const comunaRepository = AppDataSource.getRepository("Comuna");
    const provinciaRepository = AppDataSource.getRepository("Provincia");
    
    const concepcion = await provinciaRepository.findOne({ 
      where: { nombre_provincia: "Provincia de Concepción" } 
    });
    
    if (!concepcion) {
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

/**
 * Crear proveedores iniciales
 */
async function createProveedores() {
  try {
    if (await existenRegistros("Proveedores", "Proveedores ya existen, omitiendo creación")) {
      return;
    }

    const proveedorRepository = AppDataSource.getRepository("Proveedores");

    const proveedores = [
      {
        rol_proveedor: "Materiales de Construcción",
        rut_proveedor: "76.123.456-7",
        nombre_representanter: "Carlos",
        apellido_representante: "Mendoza",
        rut_representante: "12.345.678-9",
        fono_proveedor: "+56912345678",
        correo_proveedor: "contacto@maderasur.cl"
      },
      {
        rol_proveedor: "Vidrios y Cristales",
        rut_proveedor: "77.987.654-3",
        nombre_representanter: "María",
        apellido_representante: "González",
        rut_representante: "19.876.543-2",
        fono_proveedor: "+56987654321",
        correo_proveedor: "ventas@vidrioscentro.cl"
      },
      {
        rol_proveedor: "Telas y Tapicería",
        rut_proveedor: "75.555.666-K",
        nombre_representanter: "Roberto",
        apellido_representante: "Silva",
        rut_representante: "16.555.777-8",
        fono_proveedor: "+56955577788",
        correo_proveedor: "info@telasdecor.cl"
      },
      {
        rol_proveedor: "Herrajes y Accesorios",
        rut_proveedor: "78.111.222-4",
        nombre_representanter: "Ana",
        apellido_representante: "Rodríguez",
        rut_representante: "14.222.333-5",
        fono_proveedor: "+56933344455",
        correo_proveedor: "ventas@herrajeschile.cl"
      }
    ];

    await Promise.all(
      proveedores.map(proveedor =>
        proveedorRepository.save(proveedorRepository.create(proveedor))
      )
    );
    
    console.log("* => Proveedores creados exitosamente");
  } catch (error) {
    console.error("Error al crear proveedores:", error);
    throw error;
  }
}

/**
 * Crear materiales asociados a proveedores
 */
async function createMateriales() {
  try {
    if (await existenRegistros("Materiales", "Materiales ya existen, omitiendo creación")) {
      return;
    }

    const materialRepository = AppDataSource.getRepository("Materiales");
    const proveedorRepository = AppDataSource.getRepository("Proveedores");
    
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

    const materiales = [
      // Materiales de madera
      {
        nombre_material: "Tablero MDF 18mm",
        existencia_material: 50,
        unidad_medida: "unidad",
        precio_unitario: 25000,
        stock_minimo: 10,
        proveedor: proveedorMadera
      },
      {
        nombre_material: "Tablero Aglomerado 15mm",
        existencia_material: 30,
        unidad_medida: "unidad",
        precio_unitario: 18000,
        stock_minimo: 8,
        proveedor: proveedorMadera
      },
      {
        nombre_material: "Madera Pino Radiata 2x4",
        existencia_material: 100,
        unidad_medida: "m",
        precio_unitario: 3500,
        stock_minimo: 20,
        proveedor: proveedorMadera
      },
      // Materiales de vidrio
      {
        nombre_material: "Vidrio Transparente 4mm",
        existencia_material: 25,
        unidad_medida: "m",
        precio_unitario: 12000,
        stock_minimo: 5,
        proveedor: proveedorVidrio
      },
      {
        nombre_material: "Espejo 3mm",
        existencia_material: 15,
        unidad_medida: "m",
        precio_unitario: 18000,
        stock_minimo: 3,
        proveedor: proveedorVidrio
      },
      // Materiales de tapicería
      {
        nombre_material: "Tela Chenille",
        existencia_material: 200,
        unidad_medida: "m",
        precio_unitario: 8500,
        stock_minimo: 20,
        proveedor: proveedorTela
      },
      {
        nombre_material: "Espuma Tapicería 5cm",
        existencia_material: 80,
        unidad_medida: "m",
        precio_unitario: 6000,
        stock_minimo: 15,
        proveedor: proveedorTela
      },
      // Herrajes
      {
        nombre_material: "Bisagras Piano 1.5m",
        existencia_material: 40,
        unidad_medida: "unidad",
        precio_unitario: 4500,
        stock_minimo: 10,
        proveedor: proveedorHerrajes
      },
      {
        nombre_material: "Tornillos Madera 4x40",
        existencia_material: 500,
        unidad_medida: "unidad",
        precio_unitario: 50,
        stock_minimo: 100,
        proveedor: proveedorHerrajes
      },
      {
        nombre_material: "Cola Fría 1kg",
        existencia_material: 20,
        unidad_medida: "kg",
        precio_unitario: 3500,
        stock_minimo: 5,
        proveedor: proveedorMadera
      }
    ];

    await Promise.all(
      materiales.map(material =>
        materialRepository.save(materialRepository.create(material))
      )
    );
    
    console.log("* => Materiales creados exitosamente");
  } catch (error) {
    console.error("Error al crear materiales:", error);
    throw error;
  }
}

/**
 * Crear costos de terceros
 */
async function createCostosTerceros() {
  try {
    if (await existenRegistros("CostoTerceros", "Costos terceros ya existen, omitiendo creación")) {
      return;
    }

    const costoTercerosRepository = AppDataSource.getRepository("CostoTerceros");

    const costos = [
      {
        gastos_fijos_ind: 150000,
        gastos_fijos_dir: 200000,
        anno: 2024
      },
      {
        gastos_fijos_ind: 160000,
        gastos_fijos_dir: 220000,
        anno: 2025
      }
    ];

    await Promise.all(
      costos.map(costo =>
        costoTercerosRepository.save(costoTercerosRepository.create(costo))
      )
    );
    
    console.log("* => Costos terceros creados exitosamente");
  } catch (error) {
    console.error("Error al crear costos terceros:", error);
    throw error;
  }
}

/**
 * Crear productos con sus costos
 */
async function createProductos() {
  try {
    if (await existenRegistros("Producto", "Productos ya existen, omitiendo creación")) {
      return;
    }

    const productoRepository = AppDataSource.getRepository("Producto");
    const costoTercerosRepository = AppDataSource.getRepository("CostoTerceros");
    
    const costoTerceros2024 = await costoTercerosRepository.findOne({
      where: { anno: 2024 }
    });

    if (!costoTerceros2024) {
      throw new Error("No se encontraron costos terceros para 2024");
    }

    const productos = [
      // Muebles
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      // Servicios
      {
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
      },
      {
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
      },
      {
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
      }
    ];

    await Promise.all(
      productos.map(producto =>
        productoRepository.save(productoRepository.create(producto))
      )
    );
    
    console.log("* => Productos creados exitosamente");
  } catch (error) {
    console.error("Error al crear productos:", error);
    throw error;
  }
}

/**
 * Crear usuario administrador
 */
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

/**
 * Crear clientes de ejemplo
 */
async function createClientes() {
  try {
    if (await existenRegistros("Cliente", "Clientes ya existen, omitiendo creación")) {
      return;
    }

    const clienteRepository = AppDataSource.getRepository("Cliente");
    const userRepository = AppDataSource.getRepository("User");
    
    // Crear usuarios cliente primero
    const usuariosCliente = [
      {
        nombreCompleto: "María Elena González Pérez",
        rut: "16.234.567-8",
        email: "maria.gonzalez@gmail.cl",
        password: await encryptPassword("cliente2024"),
        rol: "cliente",
        telefono: "+56987654321"
      },
      {
        nombreCompleto: "Carlos Alberto Mendoza Silva",
        rut: "17.345.678-9",
        email: "carlos.mendoza@gmail.cl",
        password: await encryptPassword("cliente2024"),
        rol: "cliente",
        telefono: "+56976543210"
      },
      {
        nombreCompleto: "Ana Patricia Rojas Castro",
        rut: "15.456.789-K",
        email: "ana.rojas@gmail.cl",
        password: await encryptPassword("cliente2024"),
        rol: "cliente",
        telefono: "+56965432109"
      },
      {
        nombreCompleto: "Jorge Luis Fernández Torres",
        rut: "18.567.890-1",
        email: "jorge.fernandez@gmail.cl",
        password: await encryptPassword("cliente2024"),
        rol: "cliente",
        telefono: "+56954321098"
      }
    ];

    const usuariosCreados = [];
    for (const userData of usuariosCliente) {
      const newUser = userRepository.create(userData);
      const savedUser = await userRepository.save(newUser);
      usuariosCreados.push(savedUser);
    }

    // Crear registros de cliente
    const clientesData = [
      {
        cumpleanos_cliente: new Date('1985-03-15'),
        whatsapp_cliente: "+56987654321",
        correo_alterno_cliente: "maria.gonzalez.alt@gmail.cl",
        categoria_cliente: "premium",
        descuento_cliente: 15.00,
        user: usuariosCreados[0],
        Acepta_uso_datos: true
      },
      {
        cumpleanos_cliente: new Date('1978-07-22'),
        whatsapp_cliente: "+56976543210",
        correo_alterno_cliente: "carlos.mendoza.alt@gmail.cl",
        categoria_cliente: "vip",
        descuento_cliente: 20.00,
        user: usuariosCreados[1],
        Acepta_uso_datos: false
      },
      {
        cumpleanos_cliente: new Date('1992-11-08'),
        whatsapp_cliente: "+56965432109",
        correo_alterno_cliente: "ana.rojas.alt@gmail.cl",
        categoria_cliente: "regular",
        descuento_cliente: 5.00,
        user: usuariosCreados[2],
        Acepta_uso_datos: true
      },
      {
        cumpleanos_cliente: new Date('1980-05-30'),
        whatsapp_cliente: "+56954321098",
        correo_alterno_cliente: "jorge.fernandez.alt@gmail.cl",
        categoria_cliente: "premium",
        descuento_cliente: 12.00,
        user: usuariosCreados[3],
        Acepta_uso_datos: false
      }
    ];

    await Promise.all(
      clientesData.map(clienteData =>
        clienteRepository.save(clienteRepository.create(clienteData))
      )
    );
    
    console.log("* => Clientes creados exitosamente");
  } catch (error) {
    console.error("Error al crear clientes:", error);
    throw error;
  }
}

/**
 * Crear personal de tienda
 */
async function createPersonasTienda() {
  try {
    if (await existenRegistros("PersonaTienda", "Personas de tienda ya existen, omitiendo creación")) {
      return;
    }

    const personaTiendaRepository = AppDataSource.getRepository("PersonaTienda");
    const userRepository = AppDataSource.getRepository("User");
    
    // Crear usuarios del personal de tienda
    const usuariosPersonal = [
      {
        nombreCompleto: "Roberto Carlos Sánchez López",
        rut: "14.123.456-7",
        email: "roberto.sanchez@gmail.cl",
        password: await encryptPassword("trabajador2024"),
        rol: "gerente",
        telefono: "+56912345678"
      },
      {
        nombreCompleto: "Patricia Isabel Morales Díaz",
        rut: "13.234.567-8",
        email: "patricia.morales@gmail.cl",
        password: await encryptPassword("trabajador2024"),
        rol: "trabajador_tienda",
        telefono: "+56923456789"
      },
      {
        nombreCompleto: "Fernando José Herrera Gómez",
        rut: "12.345.678-9",
        email: "fernando.herrera@gmail.cl",
        password: await encryptPassword("trabajador2024"),
        rol: "trabajador_tienda",
        telefono: "+56934567890"
      }
    ];

    const usuariosCreados = [];
    for (const userData of usuariosPersonal) {
      const newUser = userRepository.create(userData);
      const savedUser = await userRepository.save(newUser);
      usuariosCreados.push(savedUser);
    }

    // Crear registros de personas de tienda
    const personalData = [
      {
        contacto_emergencia: "Carmen Sánchez",
        numero_emergencia: "+56987123456",
        cargo: "Gerente General",
        fecha_contratacion: new Date('2020-01-15'),
        user: usuariosCreados[0]
      },
      {
        contacto_emergencia: "Luis Morales",
        numero_emergencia: "+56976234567",
        cargo: "Encargada de Ventas",
        fecha_contratacion: new Date('2021-03-10'),
        user: usuariosCreados[1]
      },
      {
        contacto_emergencia: "Rosa Herrera",
        numero_emergencia: "+56965345678",
        cargo: "Maestro Carpintero",
        fecha_contratacion: new Date('2019-07-20'),
        user: usuariosCreados[2]
      }
    ];

    await Promise.all(
      personalData.map(personalInfo =>
        personaTiendaRepository.save(personaTiendaRepository.create(personalInfo))
      )
    );
    
    console.log("* => Personal de tienda creado exitosamente");
  } catch (error) {
    console.error("Error al crear personal de tienda:", error);
    throw error;
  }
}

/**
 * Crear representantes de proveedores
 */
async function createRepresentantes() {
  try {
    if (await existenRegistros("Representante", "Representantes ya existen, omitiendo creación")) {
      return;
    }

    const representanteRepository = AppDataSource.getRepository("Representante");
    const proveedorRepository = AppDataSource.getRepository("Proveedores");
    
    const proveedores = await proveedorRepository.find();
    
    if (proveedores.length === 0) {
      throw new Error("No se encontraron proveedores para asignar representantes");
    }

    const representantesData = [
      {
        nombre_representante: "Carlos Eduardo",
        apellido_representante: "Mendoza Ruiz",
        rut_representante: "12.345.678-9",
        cargo_representante: "Gerente de Ventas",
        fono_representante: "+56912345678",
        correo_representante: "c.mendoza@maderasur.cl",
        proveedores: proveedores[0]
      },
      {
        nombre_representante: "María Fernanda",
        apellido_representante: "González Silva",
        rut_representante: "19.876.543-2",
        cargo_representante: "Ejecutiva Comercial",
        fono_representante: "+56987654321",
        correo_representante: "m.gonzalez@vidrioscentro.cl",
        proveedores: proveedores[1]
      },
      {
        nombre_representante: "Roberto Antonio",
        apellido_representante: "Silva Morales",
        rut_representante: "16.555.777-8",
        cargo_representante: "Representante de Ventas",
        fono_representante: "+56955577788",
        correo_representante: "r.silva@telasdecor.cl",
        proveedores: proveedores[2]
      },
      {
        nombre_representante: "Ana Beatriz",
        apellido_representante: "Rodríguez López",
        rut_representante: "14.222.333-5",
        cargo_representante: "Coordinadora Comercial",
        fono_representante: "+56933344455",
        correo_representante: "a.rodriguez@herrajeschile.cl",
        proveedores: proveedores[3]
      }
    ];

    await Promise.all(
      representantesData.map(repData =>
        representanteRepository.save(representanteRepository.create(repData))
      )
    );
    
    console.log("* => Representantes creados exitosamente");
  } catch (error) {
    console.error("Error al crear representantes:", error);
    throw error;
  }
}

/**
 * Crear relaciones producto-materiales
 */
async function createProductoMateriales() {
  try {
    if (await existenRegistros("ProductoMateriales", "Relaciones producto-materiales ya existen, omitiendo creación")) {
      return;
    }

    const productoMaterialesRepository = AppDataSource.getRepository("ProductoMateriales");
    const productoRepository = AppDataSource.getRepository("Producto");
    const materialRepository = AppDataSource.getRepository("Materiales");
    
    const productos = await productoRepository.find();
    const materiales = await materialRepository.find();
    
    if (productos.length === 0 || materiales.length === 0) {
      throw new Error("No se encontraron productos o materiales para crear relaciones");
    }

    const relacionesData = [
      // Mesa de Comedor 6 personas
      {
        producto: productos.find(p => p.nombre_producto === "Mesa de Comedor 6 personas"),
        material: materiales.find(m => m.nombre_material === "Tablero MDF 18mm"),
        cantidad_necesaria: 2.5,
        costo_unitario: 25000
      },
      {
        producto: productos.find(p => p.nombre_producto === "Mesa de Comedor 6 personas"),
        material: materiales.find(m => m.nombre_material === "Vidrio Transparente 4mm"),
        cantidad_necesaria: 1.8,
        costo_unitario: 12000
      },
      {
        producto: productos.find(p => p.nombre_producto === "Mesa de Comedor 6 personas"),
        material: materiales.find(m => m.nombre_material === "Cola Fría 1kg"),
        cantidad_necesaria: 0.5,
        costo_unitario: 3500
      },
      // Silla Tapizada Clásica
      {
        producto: productos.find(p => p.nombre_producto === "Silla Tapizada Clásica"),
        material: materiales.find(m => m.nombre_material === "Madera Pino Radiata 2x4"),
        cantidad_necesaria: 3.0,
        costo_unitario: 3500
      },
      {
        producto: productos.find(p => p.nombre_producto === "Silla Tapizada Clásica"),
        material: materiales.find(m => m.nombre_material === "Tela Chenille"),
        cantidad_necesaria: 1.2,
        costo_unitario: 8500
      },
      {
        producto: productos.find(p => p.nombre_producto === "Silla Tapizada Clásica"),
        material: materiales.find(m => m.nombre_material === "Espuma Tapicería 5cm"),
        cantidad_necesaria: 0.8,
        costo_unitario: 6000
      },
      // Ropero 3 Puertas con Espejo
      {
        producto: productos.find(p => p.nombre_producto === "Ropero 3 Puertas con Espejo"),
        material: materiales.find(m => m.nombre_material === "Tablero Aglomerado 15mm"),
        cantidad_necesaria: 6.0,
        costo_unitario: 18000
      },
      {
        producto: productos.find(p => p.nombre_producto === "Ropero 3 Puertas con Espejo"),
        material: materiales.find(m => m.nombre_material === "Espejo 3mm"),
        cantidad_necesaria: 2.0,
        costo_unitario: 18000
      },
      {
        producto: productos.find(p => p.nombre_producto === "Ropero 3 Puertas con Espejo"),
        material: materiales.find(m => m.nombre_material === "Bisagras Piano 1.5m"),
        cantidad_necesaria: 3.0,
        costo_unitario: 4500
      },
      // Cómoda 4 Cajones
      {
        producto: productos.find(p => p.nombre_producto === "Cómoda 4 Cajones"),
        material: materiales.find(m => m.nombre_material === "Tablero MDF 18mm"),
        cantidad_necesaria: 3.0,
        costo_unitario: 25000
      },
      {
        producto: productos.find(p => p.nombre_producto === "Cómoda 4 Cajones"),
        material: materiales.find(m => m.nombre_material === "Tornillos Madera 4x40"),
        cantidad_necesaria: 32.0,
        costo_unitario: 50
      }
    ];

    const relacionesValidas = relacionesData.filter(rel => rel.producto && rel.material);

    await Promise.all(
      relacionesValidas.map(relacion =>
        productoMaterialesRepository.save(productoMaterialesRepository.create(relacion))
      )
    );
    
    console.log("* => Relaciones producto-materiales creadas exitosamente");
  } catch (error) {
    console.error("Error al crear relaciones producto-materiales:", error);
    throw error;
  }
}

/**
 * Crear operaciones de ejemplo
 */
async function createOperaciones() {
  try {
    if (await existenRegistros("Operacion", "Operaciones ya existen, omitiendo creación")) {
      return;
    }

    const operacionRepository = AppDataSource.getRepository("Operacion");
    const userRepository = AppDataSource.getRepository("User");
    
    const clientes = await userRepository.find({
      where: { rol: "cliente" }
    });
    
    if (clientes.length === 0) {
      console.log("* => No hay clientes disponibles, omitiendo creación de operaciones");
      return;
    }

    const operacionesData = [
      {
        estado_operacion: "completada",
        costo_operacion: 180000,
        cantidad_abono: 90000,
        descripcion_operacion: "Mesa de comedor para 6 personas, madera MDF con vidrio temperado",
        fecha_entrega_estimada: new Date('2024-12-01'),
        cliente: clientes[0]
      },
      {
        estado_operacion: "en_proceso",
        costo_operacion: 340000,
        cantidad_abono: 170000,
        descripcion_operacion: "Set de 4 sillas tapizadas + mesa auxiliar",
        fecha_entrega_estimada: new Date('2024-12-15'),
        cliente: clientes[1]
      },
      {
        estado_operacion: "pendiente",
        costo_operacion: 120000,
        cantidad_abono: 0,
        descripcion_operacion: "Restauración completa de mesa antigua familiar",
        fecha_entrega_estimada: new Date('2024-12-20'),
        cliente: clientes[2]
      },
      {
        estado_operacion: "completada",
        costo_operacion: 280000,
        cantidad_abono: 280000,
        descripcion_operacion: "Ropero 3 puertas con espejo central",
        fecha_entrega_estimada: new Date('2024-11-25'),
        cliente: clientes[3] || clientes[0]
      },
      {
        estado_operacion: "en_proceso",
        costo_operacion: 250000,
        cantidad_abono: 125000,
        descripcion_operacion: "Mueble a medida - Estantería esquinera para sala",
        fecha_entrega_estimada: new Date('2024-12-30'),
        cliente: clientes[0]
      }
    ];

    await Promise.all(
      operacionesData.map(operacionData =>
        operacionRepository.save(operacionRepository.create(operacionData))
      )
    );
    
    console.log("* => Operaciones creadas exitosamente");
  } catch (error) {
    console.error("Error al crear operaciones:", error);
    throw error;
  }
}

/**
 * Crear productos-operación
 */
async function createProductosOperacion() {
  try {
    if (await existenRegistros("ProductoOperacion", "Productos-operación ya existen, omitiendo creación")) {
      return;
    }

    const productoOperacionRepository = AppDataSource.getRepository("ProductoOperacion");
    const operacionRepository = AppDataSource.getRepository("Operacion");
    const productoRepository = AppDataSource.getRepository("Producto");
    
    const operaciones = await operacionRepository.find();
    const productos = await productoRepository.find();
    
    if (operaciones.length === 0 || productos.length === 0) {
      console.log("* => No hay operaciones o productos disponibles, omitiendo creación");
      return;
    }

    const productosOperacionData = [
      {
        operacion: operaciones[0],
        producto: productos.find(p => p.nombre_producto === "Mesa de Comedor 6 personas"),
        cantidad: 1,
        precio_unitario: 180000,
        precio_total: 180000,
        especificaciones: "Acabado en roble, vidrio temperado de 6mm"
      },
      {
        operacion: operaciones[1],
        producto: productos.find(p => p.nombre_producto === "Silla Tapizada Clásica"),
        cantidad: 4,
        precio_unitario: 85000,
        precio_total: 340000,
        especificaciones: "Tapizado en tela beige, patas de madera natural"
      },
      {
        operacion: operaciones[2],
        producto: productos.find(p => p.nombre_producto === "Restauración de Mesa Antigua"),
        cantidad: 1,
        precio_unitario: 120000,
        precio_total: 120000,
        especificaciones: "Lijado completo, barnizado y reparación de patas"
      },
      {
        operacion: operaciones[3],
        producto: productos.find(p => p.nombre_producto === "Ropero 3 Puertas con Espejo"),
        cantidad: 1,
        precio_unitario: 280000,
        precio_total: 280000,
        especificaciones: "Color nogal, espejo biselado, organizadores internos"
      },
      {
        operacion: operaciones[4],
        producto: productos.find(p => p.nombre_producto === "Mueble a Medida"),
        cantidad: 1,
        precio_unitario: 250000,
        precio_total: 250000,
        especificaciones: "Estantería esquinera 2.40m altura, 5 niveles, madera pino"
      }
    ];

    const productosValidos = productosOperacionData.filter(po => po.producto && po.operacion);

    await Promise.all(
      productosValidos.map(poData =>
        productoOperacionRepository.save(productoOperacionRepository.create(poData))
      )
    );
    
    console.log("* => Productos-operación creados exitosamente");
  } catch (error) {
    console.error("Error al crear productos-operación:", error);
    throw error;
  }
}

/**
 * Crear historial de operaciones
 */
async function createHistorial() {
  try {
    if (await existenRegistros("Historial", "Historial ya existe, omitiendo creación")) {
      return;
    }

    const historialRepository = AppDataSource.getRepository("Historial");
    const operacionRepository = AppDataSource.getRepository("Operacion");
    
    const operaciones = await operacionRepository.find();
    
    if (operaciones.length === 0) {
      console.log("* => No hay operaciones disponibles, omitiendo creación de historial");
      return;
    }

    const historialData = [];

    operaciones.forEach((operacion, index) => {
      if (operacion.estado_operacion === "completada") {
        historialData.push({
          operacion: operacion,
          cotizacion: true,
          orden_trabajo: true,
          terminada: true,
          pagada: true,
          entregada: true,
          fecha_cambio: new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000)
        });
      } else if (operacion.estado_operacion === "en_proceso") {
        historialData.push({
          operacion: operacion,
          cotizacion: true,
          orden_trabajo: true,
          terminada: false,
          pagada: false,
          entregada: false,
          fecha_cambio: new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000)
        });
      } else if (operacion.estado_operacion === "pendiente") {
        historialData.push({
          operacion: operacion,
          cotizacion: true,
          orden_trabajo: false,
          terminada: false,
          pagada: false,
          entregada: false,
          fecha_cambio: new Date(Date.now() - (3 - index) * 24 * 60 * 60 * 1000)
        });
      }
    });

    await Promise.all(
      historialData.map(histData =>
        historialRepository.save(historialRepository.create(histData))
      )
    );
    
    console.log("* => Historial creado exitosamente");
  } catch (error) {
    console.error("Error al crear historial:", error);
    throw error;
  }
}

/**
 * Crear encuestas de satisfacción
 */
async function createEncuestas() {
  try {
    if (await existenRegistros("Encuesta", "Encuestas ya existen, omitiendo creación")) {
      return;
    }

    const encuestaRepository = AppDataSource.getRepository("Encuesta");
    const operacionRepository = AppDataSource.getRepository("Operacion");
    
    const operacionesCompletadas = await operacionRepository.find({
      where: { estado_operacion: "completada" }
    });
    
    if (operacionesCompletadas.length === 0) {
      console.log("* => No hay operaciones completadas, omitiendo creación de encuestas");
      return;
    }

    const encuestasData = [
      {
        operacion: operacionesCompletadas[0],
        nota_pedido: 6,
        nota_repartidor: 7,
        comentario: "Excelente trabajo, muy satisfecho con la calidad de la mesa. El acabado es perfecto.",
        fecha_encuesta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        operacion: operacionesCompletadas[1] || operacionesCompletadas[0],
        nota_pedido: 7,
        nota_repartidor: 6,
        comentario: "Muy buen producto, entrega puntual. Solo mejoraría el embalaje para el transporte.",
        fecha_encuesta: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    await Promise.all(
      encuestasData.map(encuestaData =>
        encuestaRepository.save(encuestaRepository.create(encuestaData))
      )
    );
    
    console.log("* => Encuestas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear encuestas:", error);
    throw error;
  }
}

/**
 * Función principal que ejecuta todo el setup inicial
 */
export async function runInitialSetup() {
  console.log("🚀 Iniciando configuración inicial de la base de datos...");
  console.log("⏳ Este proceso puede tardar algunos minutos...\n");
  
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
    await createClientes();
    await createPersonasTienda();
    await createRepresentantes();
    await createProductoMateriales();
    await createOperaciones();
    await createProductosOperacion();
    await createHistorial();
    await createEncuestas();
    
    console.log("\n✅ Configuración inicial completada exitosamente");
    console.log("📊 Base de datos lista para usar\n");
  } catch (error) {
    console.error("\n❌ Error durante la configuración inicial:", error);
    throw error;
  }
}

// Exportar todas las funciones individuales
export {
  createPaises,
  createRegiones,
  createProvincias,
  createComunas,
  createProveedores,
  createMateriales,
  createCostosTerceros,
  createProductos,
  createUsers,
  createClientes,
  createPersonasTienda,
  createRepresentantes,
  createProductoMateriales,
  createOperaciones,
  createProductosOperacion,
  createHistorial,
  createEncuestas
};
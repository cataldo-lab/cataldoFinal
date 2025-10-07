"use strict";
import Cliente from "../entity/personas/cliente.entity.js";
import { User } from "../../entity/personas/user.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { Producto_Operacion } from "../entity/producto_operacion.entity.js";
import { Encuesta } from "../entity/encuesta.entity.js";
import { Operacion } from "../entity/operacion.entity.js";
import Cliente from "../entity/personas/cliente.entity.js";
import bcrypt from "bcryptjs";

//Trabajador consulta personas con Rol Cliente
export async function getClientesTienda() {
    try {
        const clienteRepository = AppDataSource.getRepository("Cliente");
        
        // Obtener todos los clientes con sus datos de usuario relacionados
        const clientes = await clienteRepository.find({
            relations: {
                user: {
                    comuna: {
                        provincia: {
                            region: {
                                pais: true
                            }
                        }
                    }
                }
            },
            where: {
                user: {
                    rol: "cliente"
                }
            },
            order: {
                user: {
                    nombreCompleto: "ASC"
                }
            }
        });

        // Si no hay clientes
        if (!clientes || clientes.length === 0) {
            return [null, "No se encontraron clientes"];
        }

        // Formatear la respuesta mostrando solo datos completos
        const clientesFormateados = clientes.map(cliente => {
            const clienteData = {
                id_cliente: cliente.id_cliente,
                // Datos del usuario (siempre presentes)
                id_user: cliente.user.id,
                rut: cliente.user.rut,
                nombreCompleto: cliente.user.nombreCompleto,
                email: cliente.user.email,
                rol: cliente.user.rol,
            };

            // Solo agregar campos opcionales si tienen datos
            if (cliente.user.telefono) {
                clienteData.telefono = cliente.user.telefono;
            }

            if (cliente.cumpleanos_cliente) {
                clienteData.cumpleanos = cliente.cumpleanos_cliente;
            }

            if (cliente.whatsapp_cliente) {
                clienteData.whatsapp = cliente.whatsapp_cliente;
            }

            if (cliente.correo_alterno_cliente) {
                clienteData.correo_alterno = cliente.correo_alterno_cliente;
            }

            if (cliente.categoria_cliente) {
                clienteData.categoria = cliente.categoria_cliente;
            }

            if (cliente.descuento_cliente && cliente.descuento_cliente > 0) {
                clienteData.descuento = cliente.descuento_cliente;
            }

            // Solo mostrar aceptación de datos si es true
            if (cliente.Acepta_uso_datos) {
                clienteData.acepta_uso_datos = cliente.Acepta_uso_datos;
            }

            // Solo agregar dirección si existe comuna
            if (cliente.user.comuna) {
                clienteData.direccion = {
                    comuna: cliente.user.comuna.nombre_comuna
                };

                if (cliente.user.comuna.provincia) {
                    clienteData.direccion.provincia = cliente.user.comuna.provincia.nombre_provincia;

                    if (cliente.user.comuna.provincia.region) {
                        clienteData.direccion.region = cliente.user.comuna.provincia.region.nombre_region;

                        if (cliente.user.comuna.provincia.region.pais) {
                            clienteData.direccion.pais = cliente.user.comuna.provincia.region.pais.nombre_pais;
                        }
                    }
                }
            }

            // Fechas (siempre presentes)
            clienteData.fecha_creacion = cliente.user.createdAt;
            clienteData.fecha_actualizacion = cliente.user.updatedAt;

            return clienteData;
        });

        return [clientesFormateados, null];

    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return [null, "Error interno del servidor al obtener clientes"];
    }
}






//Trabajador crea personas con rol cliente 
export async function createCliente(datosCliente) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepository = queryRunner.manager.getRepository("User");
        const clienteRepository = queryRunner.manager.getRepository("Cliente");

        // Validar datos obligatorios
        if (!datosCliente.rut || !datosCliente.nombreCompleto || !datosCliente.email || !datosCliente.password) {
            await queryRunner.rollbackTransaction();
            return [null, "Faltan datos obligatorios: rut, nombreCompleto, email y password"];
        }

        // Verificar si el RUT ya existe
        const rutExistente = await userRepository.findOne({
            where: { rut: datosCliente.rut }
        });

        if (rutExistente) {
            await queryRunner.rollbackTransaction();
            return [null, "El RUT ya está registrado"];
        }

        // Verificar si el email ya existe
        const emailExistente = await userRepository.findOne({
            where: { email: datosCliente.email }
        });

        if (emailExistente) {
            await queryRunner.rollbackTransaction();
            return [null, "El email ya está registrado"];
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosCliente.email)) {
            await queryRunner.rollbackTransaction();
            return [null, "Formato de email inválido"];
        }

        // Validar formato de RUT (básico)
        const rutRegex = /^[0-9]+-[0-9kK]$/;
        if (!rutRegex.test(datosCliente.rut)) {
            await queryRunner.rollbackTransaction();
            return [null, "Formato de RUT inválido. Debe ser: 12345678-9"];
        }

        // Si se proporciona id_comuna, verificar que existe
        if (datosCliente.id_comuna) {
            const comunaRepository = queryRunner.manager.getRepository("Comuna");
            const comunaExiste = await comunaRepository.findOne({
                where: { id_comuna: datosCliente.id_comuna }
            });

            if (!comunaExiste) {
                await queryRunner.rollbackTransaction();
                return [null, "La comuna especificada no existe"];
            }
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(datosCliente.password, 10);

        // Crear usuario
        const nuevoUser = userRepository.create({
            rut: datosCliente.rut,
            nombreCompleto: datosCliente.nombreCompleto,
            email: datosCliente.email,
            password: hashedPassword,
            rol: "cliente",
            telefono: datosCliente.telefono || null,
            comuna: datosCliente.id_comuna ? { id_comuna: datosCliente.id_comuna } : null
        });

        const userGuardado = await userRepository.save(nuevoUser);

        // Crear registro de cliente
        const nuevoCliente = clienteRepository.create({
            user: userGuardado,
            cumpleanos_cliente: datosCliente.cumpleanos || null,
            whatsapp_cliente: datosCliente.whatsapp || null,
            correo_alterno_cliente: datosCliente.correo_alterno || null,
            categoria_cliente: datosCliente.categoria || "regular",
            descuento_cliente: datosCliente.descuento || 0,
            Acepta_uso_datos: datosCliente.acepta_uso_datos || false
        });

        const clienteGuardado = await clienteRepository.save(nuevoCliente);

        await queryRunner.commitTransaction();

        // Obtener el cliente completo con sus relaciones
        const clienteCompleto = await clienteRepository.findOne({
            where: { id_cliente: clienteGuardado.id_cliente },
            relations: {
                user: {
                    comuna: {
                        provincia: {
                            region: {
                                pais: true
                            }
                        }
                    }
                }
            }
        });

        // Formatear respuesta (sin incluir el password)
        const respuesta = {
            id_cliente: clienteCompleto.id_cliente,
            id_user: clienteCompleto.user.id,
            rut: clienteCompleto.user.rut,
            nombreCompleto: clienteCompleto.user.nombreCompleto,
            email: clienteCompleto.user.email,
            rol: clienteCompleto.user.rol
        };

        // Agregar campos opcionales si existen
        if (clienteCompleto.user.telefono) respuesta.telefono = clienteCompleto.user.telefono;
        if (clienteCompleto.cumpleanos_cliente) respuesta.cumpleanos = clienteCompleto.cumpleanos_cliente;
        if (clienteCompleto.whatsapp_cliente) respuesta.whatsapp = clienteCompleto.whatsapp_cliente;
        if (clienteCompleto.correo_alterno_cliente) respuesta.correo_alterno = clienteCompleto.correo_alterno_cliente;
        if (clienteCompleto.categoria_cliente) respuesta.categoria = clienteCompleto.categoria_cliente;
        if (clienteCompleto.descuento_cliente > 0) respuesta.descuento = clienteCompleto.descuento_cliente;
        if (clienteCompleto.Acepta_uso_datos) respuesta.acepta_uso_datos = clienteCompleto.Acepta_uso_datos;

        if (clienteCompleto.user.comuna) {
            respuesta.direccion = {
                id_comuna: clienteCompleto.user.comuna.id_comuna,
                comuna: clienteCompleto.user.comuna.nombre_comuna
            };
            
            if (clienteCompleto.user.comuna.provincia) {
                respuesta.direccion.provincia = clienteCompleto.user.comuna.provincia.nombre_provincia;
                
                if (clienteCompleto.user.comuna.provincia.region) {
                    respuesta.direccion.region = clienteCompleto.user.comuna.provincia.region.nombre_region;
                    
                    if (clienteCompleto.user.comuna.provincia.region.pais) {
                        respuesta.direccion.pais = clienteCompleto.user.comuna.provincia.region.pais.nombre_pais;
                    }
                }
            }
        }

        respuesta.fecha_creacion = clienteCompleto.user.createdAt;
        respuesta.fecha_actualizacion = clienteCompleto.user.updatedAt;

        return [respuesta, null];

    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error al crear cliente:", error);
        return [null, "Error interno del servidor al crear cliente"];
    } finally {
        await queryRunner.release();
    }
}

//Trabajador actualiza datos con rol cliente.

export async function createCliente(datosCliente) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepository = queryRunner.manager.getRepository("User");
        const clienteRepository = queryRunner.manager.getRepository("Cliente");

        // Validar datos obligatorios
        if (!datosCliente.rut || !datosCliente.nombreCompleto || !datosCliente.email || !datosCliente.password) {
            await queryRunner.rollbackTransaction();
            return [null, "Faltan datos obligatorios: rut, nombreCompleto, email y password"];
        }

        // Verificar si el RUT ya existe
        const rutExistente = await userRepository.findOne({
            where: { rut: datosCliente.rut }
        });

        if (rutExistente) {
            await queryRunner.rollbackTransaction();
            return [null, "El RUT ya está registrado"];
        }

        // Verificar si el email ya existe
        const emailExistente = await userRepository.findOne({
            where: { email: datosCliente.email }
        });

        if (emailExistente) {
            await queryRunner.rollbackTransaction();
            return [null, "El email ya está registrado"];
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosCliente.email)) {
            await queryRunner.rollbackTransaction();
            return [null, "Formato de email inválido"];
        }

        // Validar formato de RUT (básico)
        const rutRegex = /^[0-9]+-[0-9kK]$/;
        if (!rutRegex.test(datosCliente.rut)) {
            await queryRunner.rollbackTransaction();
            return [null, "Formato de RUT inválido. Debe ser: 12345678-9"];
        }

        // Si se proporciona id_comuna, verificar que existe
        if (datosCliente.id_comuna) {
            const comunaRepository = queryRunner.manager.getRepository("Comuna");
            const comunaExiste = await comunaRepository.findOne({
                where: { id_comuna: datosCliente.id_comuna }
            });

            if (!comunaExiste) {
                await queryRunner.rollbackTransaction();
                return [null, "La comuna especificada no existe"];
            }
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(datosCliente.password, 10);

        // Crear usuario
        const nuevoUser = userRepository.create({
            rut: datosCliente.rut,
            nombreCompleto: datosCliente.nombreCompleto,
            email: datosCliente.email,
            password: hashedPassword,
            rol: "cliente",
            telefono: datosCliente.telefono || null,
            comuna: datosCliente.id_comuna ? { id_comuna: datosCliente.id_comuna } : null
        });

        const userGuardado = await userRepository.save(nuevoUser);

        // Crear registro de cliente
        const nuevoCliente = clienteRepository.create({
            user: userGuardado,
            cumpleanos_cliente: datosCliente.cumpleanos || null,
            whatsapp_cliente: datosCliente.whatsapp || null,
            correo_alterno_cliente: datosCliente.correo_alterno || null,
            categoria_cliente: datosCliente.categoria || "regular",
            descuento_cliente: datosCliente.descuento || 0,
            Acepta_uso_datos: datosCliente.acepta_uso_datos || false
        });

        const clienteGuardado = await clienteRepository.save(nuevoCliente);

        await queryRunner.commitTransaction();

        // Obtener el cliente completo con sus relaciones
        const clienteCompleto = await clienteRepository.findOne({
            where: { id_cliente: clienteGuardado.id_cliente },
            relations: {
                user: {
                    comuna: {
                        provincia: {
                            region: {
                                pais: true
                            }
                        }
                    }
                }
            }
        });

        // Formatear respuesta (sin incluir el password)
        const respuesta = {
            id_cliente: clienteCompleto.id_cliente,
            id_user: clienteCompleto.user.id,
            rut: clienteCompleto.user.rut,
            nombreCompleto: clienteCompleto.user.nombreCompleto,
            email: clienteCompleto.user.email,
            rol: clienteCompleto.user.rol
        };

        // Agregar campos opcionales si existen
        if (clienteCompleto.user.telefono) respuesta.telefono = clienteCompleto.user.telefono;
        if (clienteCompleto.cumpleanos_cliente) respuesta.cumpleanos = clienteCompleto.cumpleanos_cliente;
        if (clienteCompleto.whatsapp_cliente) respuesta.whatsapp = clienteCompleto.whatsapp_cliente;
        if (clienteCompleto.correo_alterno_cliente) respuesta.correo_alterno = clienteCompleto.correo_alterno_cliente;
        if (clienteCompleto.categoria_cliente) respuesta.categoria = clienteCompleto.categoria_cliente;
        if (clienteCompleto.descuento_cliente > 0) respuesta.descuento = clienteCompleto.descuento_cliente;
        if (clienteCompleto.Acepta_uso_datos) respuesta.acepta_uso_datos = clienteCompleto.Acepta_uso_datos;

        if (clienteCompleto.user.comuna) {
            respuesta.direccion = {
                id_comuna: clienteCompleto.user.comuna.id_comuna,
                comuna: clienteCompleto.user.comuna.nombre_comuna
            };
            
            if (clienteCompleto.user.comuna.provincia) {
                respuesta.direccion.provincia = clienteCompleto.user.comuna.provincia.nombre_provincia;
                
                if (clienteCompleto.user.comuna.provincia.region) {
                    respuesta.direccion.region = clienteCompleto.user.comuna.provincia.region.nombre_region;
                    
                    if (clienteCompleto.user.comuna.provincia.region.pais) {
                        respuesta.direccion.pais = clienteCompleto.user.comuna.provincia.region.pais.nombre_pais;
                    }
                }
            }
        }

        respuesta.fecha_creacion = clienteCompleto.user.createdAt;
        respuesta.fecha_actualizacion = clienteCompleto.user.updatedAt;

        return [respuesta, null];

    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error al crear cliente:", error);
        return [null, "Error interno del servidor al crear cliente"];
    } finally {
        await queryRunner.release();
    }
}


//Trabajador ingresa encuesta de los clientes. (No seguro)
//Quizas



//Tabalajor puede ver toda la informacion asociada a operaciones con un cliente



// Puede gestionar encuestas, como ver las respondidas por los clientes, etc.





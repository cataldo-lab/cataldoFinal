"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { encryptPassword } from "../../helpers/bcrypt.helper.js";

/**
 * Crear un nuevo cliente
 */
export async function createClienteService(clienteData) {
    try {
        const userRepository = AppDataSource.getRepository("User");
        const clienteRepository = AppDataSource.getRepository("Cliente");
        const comunaRepository = AppDataSource.getRepository("Comuna");

        // Validar datos obligatorios
        if (!clienteData.nombreCompleto || !clienteData.rut || !clienteData.email) {
            return [null, "Nombre completo, RUT y email son obligatorios"];
        }

        // Verificar que el email no exista
        const emailExistente = await userRepository.findOne({
            where: { email: clienteData.email }
        });

        if (emailExistente) {
            return [null, "Ya existe un usuario con este correo electrónico"];
        }

        // Verificar que el RUT no exista
        const rutExistente = await userRepository.findOne({
            where: { rut: clienteData.rut }
        });

        if (rutExistente) {
            return [null, "Ya existe un usuario con este RUT"];
        }

        // Validar comuna (opcional)
        let comuna = null;
        if (clienteData.id_comuna) {
            comuna = await comunaRepository.findOne({
                where: { id_comuna: clienteData.id_comuna }
            });

            if (!comuna) {
                return [null, "Comuna no encontrada"];
            }
        }

        // Crear usuario base
        const nuevoUsuario = userRepository.create({
            nombreCompleto: clienteData.nombreCompleto,
            rut: clienteData.rut,
            email: clienteData.email,
            password: await encryptPassword(clienteData.password || "cliente2024"),
            rol: "cliente",
            telefono: clienteData.telefono || null,
            comuna: comuna
        });

        const usuarioGuardado = await userRepository.save(nuevoUsuario);

        // Crear registro de cliente con datos adicionales
        const nuevoCliente = clienteRepository.create({
            user: usuarioGuardado,
            cumpleanos_cliente: clienteData.cumpleanos_cliente || null,
            whatsapp_cliente: clienteData.whatsapp_cliente || null,
            correo_alterno_cliente: clienteData.correo_alterno_cliente || null,
            categoria_cliente: clienteData.categoria_cliente || "regular",
            descuento_cliente: clienteData.descuento_cliente || 0,
            Acepta_uso_datos: clienteData.Acepta_uso_datos || false
        });

        await clienteRepository.save(nuevoCliente);

        // Retornar cliente completo
        const clienteCompleto = await userRepository.findOne({
            where: { id: usuarioGuardado.id },
            relations: ["cliente", "comuna", "comuna.provincia", "comuna.provincia.region"]
        });

        // Remover password antes de retornar
        const { password, ...clienteSinPassword } = clienteCompleto;

        return [clienteSinPassword, null];

    } catch (error) {
        console.error("Error al crear cliente:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todos los clientes
 */
export async function getClientesService(filtros = {}) {
    try {
        const userRepository = AppDataSource.getRepository("User");

        const queryBuilder = userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.cliente", "cliente")
            .leftJoinAndSelect("user.comuna", "comuna")
            .leftJoinAndSelect("comuna.provincia", "provincia")
            .leftJoinAndSelect("provincia.region", "region")
            .where("user.rol = :rol", { rol: "cliente" })
            .orderBy("user.nombreCompleto", "ASC");

        // Aplicar filtros
        if (filtros.categoria_cliente) {
            queryBuilder.andWhere("cliente.categoria_cliente = :categoria", {
                categoria: filtros.categoria_cliente
            });
        }

        if (filtros.comuna) {
            queryBuilder.andWhere("comuna.nombre_comuna = :comuna", {
                comuna: filtros.comuna
            });
        }

        if (filtros.search) {
            queryBuilder.andWhere(
                "(user.nombreCompleto ILIKE :search OR user.email ILIKE :search OR user.rut ILIKE :search)",
                { search: `%${filtros.search}%` }
            );
        }

        const clientes = await queryBuilder.getMany();

        // Remover passwords
        const clientesSinPassword = clientes.map(({ password, ...cliente }) => cliente);

        return [clientesSinPassword, null];

    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener un cliente por ID
 */
export async function getClienteByIdService(id) {
    try {
        const userRepository = AppDataSource.getRepository("User");

        const cliente = await userRepository.findOne({
            where: { id: id, rol: "cliente" },
            relations: [
                "cliente",
                "comuna",
                "comuna.provincia",
                "comuna.provincia.region",
                "operaciones",
                "operaciones.productosOperacion",
                "operaciones.productosOperacion.producto"
            ]
        });

        if (!cliente) {
            return [null, "Cliente no encontrado"];
        }

        // Remover password
        const { password, ...clienteSinPassword } = cliente;

        return [clienteSinPassword, null];

    } catch (error) {
        console.error("Error al obtener cliente:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar información del cliente
 */
export async function updateClienteService(id, datosActualizados) {
    try {
        const userRepository = AppDataSource.getRepository("User");
        const clienteRepository = AppDataSource.getRepository("Cliente");

        const user = await userRepository.findOne({
            where: { id: id, rol: "cliente" },
            relations: ["cliente"]
        });

        if (!user) {
            return [null, "Cliente no encontrado"];
        }

        // Actualizar datos de User
        const camposUser = ['nombreCompleto', 'telefono', 'email'];
        camposUser.forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                user[campo] = datosActualizados[campo];
            }
        });

        // Si hay cambio de email, verificar que no exista
        if (datosActualizados.email && datosActualizados.email !== user.email) {
            const emailExistente = await userRepository.findOne({
                where: { email: datosActualizados.email }
            });

            if (emailExistente && emailExistente.id !== id) {
                return [null, "El email ya está en uso"];
            }
        }

        await userRepository.save(user);

        // Actualizar datos de Cliente
        if (user.cliente) {
            const camposCliente = [
                'cumpleanos_cliente',
                'whatsapp_cliente',
                'correo_alterno_cliente',
                'categoria_cliente',
                'descuento_cliente',
                'Acepta_uso_datos'
            ];

            camposCliente.forEach(campo => {
                if (datosActualizados[campo] !== undefined) {
                    user.cliente[campo] = datosActualizados[campo];
                }
            });

            await clienteRepository.save(user.cliente);
        }

        // Retornar cliente actualizado
        const clienteActualizado = await userRepository.findOne({
            where: { id: id },
            relations: ["cliente", "comuna", "comuna.provincia", "comuna.provincia.region"]
        });

        const { password, ...clienteSinPassword } = clienteActualizado;

        return [clienteSinPassword, null];

    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener historial de operaciones de un cliente
 */
export async function getHistorialOperacionesService(id) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");

        const operaciones = await operacionRepository.find({
            where: { cliente: { id: id } },
            relations: [
                "productosOperacion",
                "productosOperacion.producto",
                "historial"
            ],
            order: { fecha_creacion: "DESC" }
        });

        return [operaciones, null];

    } catch (error) {
        console.error("Error al obtener historial:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener estadísticas de un cliente
 */
export async function getEstadisticasClienteService(id) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");
        const userRepository = AppDataSource.getRepository("User");

        // Verificar que el cliente existe
        const cliente = await userRepository.findOne({
            where: { id: id, rol: "cliente" }
        });

        if (!cliente) {
            return [null, "Cliente no encontrado"];
        }

        // Obtener todas las operaciones del cliente
        const operaciones = await operacionRepository.find({
            where: { cliente: { id: id } }
        });

        // Calcular estadísticas
        const totalOperaciones = operaciones.length;

        const operacionesPorEstado = {
            pendiente: 0,
            en_proceso: 0,
            terminada: 0,
            completada: 0,
            pagada: 0,
            entregada: 0,
            anulada: 0
        };

        let totalGastado = 0;
        let totalAbonado = 0;
        let totalPendientePago = 0;

        operaciones.forEach(op => {
            operacionesPorEstado[op.estado_operacion]++;
            
            const costo = parseFloat(op.costo_operacion || 0);
            const abono = parseFloat(op.cantidad_abono || 0);
            
            totalGastado += costo;
            totalAbonado += abono;
            
            if (op.estado_operacion !== 'pagada' && op.estado_operacion !== 'anulada') {
                totalPendientePago += (costo - abono);
            }
        });

        const promedioGastoPorOperacion = totalOperaciones > 0 
            ? totalGastado / totalOperaciones 
            : 0;

        // Fecha de primera y última operación
        const primeraOperacion = operaciones.length > 0 
            ? operaciones.reduce((prev, curr) => 
                new Date(prev.fecha_creacion) < new Date(curr.fecha_creacion) ? prev : curr
              ).fecha_creacion
            : null;

        const ultimaOperacion = operaciones.length > 0
            ? operaciones.reduce((prev, curr) => 
                new Date(prev.fecha_creacion) > new Date(curr.fecha_creacion) ? prev : curr
              ).fecha_creacion
            : null;

        const estadisticas = {
            totalOperaciones,
            operacionesPorEstado,
            totalGastado: parseFloat(totalGastado.toFixed(2)),
            totalAbonado: parseFloat(totalAbonado.toFixed(2)),
            totalPendientePago: parseFloat(totalPendientePago.toFixed(2)),
            promedioGastoPorOperacion: parseFloat(promedioGastoPorOperacion.toFixed(2)),
            primeraOperacion,
            ultimaOperacion
        };

        return [estadisticas, null];

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener categorías de clientes disponibles
 */
export async function getCategoriasClienteService() {
    try {
        const categorias = ["regular", "vip", "premium"];
        return [categorias, null];
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [null, "Error interno del servidor"];
    }
}
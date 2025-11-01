// backend/src/services/staff/proveedor.service.js
"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { proveedoresSchema } from "../../entity/proveedores.entity.js";
import { representanteSchema } from "../../entity/representante.entity.js";
import { MaterialesSchema } from "../../entity/materiales.entity.js";

/**
 * ========================================
 * VALIDACIONES
 * ========================================
 */
/*function validarTelefono(telefono) {
    if (!telefono || typeof telefono !== 'string') return false;
    // Validar formato chileno: +56912345678 o 912345678
    const telefonoLimpio = telefono.replace(/\s/g, '').replace(/\+/g, '');
    const regex = /^(56)?[2-9]\d{8}$/;
    return regex.test(telefonoLimpio);
}*/

function validarRUT(rut) {
    if (!rut || typeof rut !== 'string') return false;
    
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    if (!/^[0-9]+[0-9kK]$/.test(rutLimpio)) return false;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dv === dvCalculado;
}


function validarEmail(email) {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


function validarDatosProveedor(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        // Validaciones para creación (campos obligatorios)
        if (!data.rol_proveedor || data.rol_proveedor.trim() === '') {
            errors.push('El rol del proveedor es obligatorio');
        }


        if (!data.rut_proveedor || data.rut_proveedor.trim() === '') {
            errors.push('El RUT del proveedor es obligatorio');
        } else if (!validarRUT(data.rut_proveedor)) {
            errors.push('El RUT del proveedor no es válido');
        }

        if (!data.fono_proveedor || data.fono_proveedor.trim() === '') {
            errors.push('El teléfono es obligatorio');
        } else if (!validarTelefono(data.fono_proveedor)) {
            errors.push('El teléfono no es válido');
        }


        if (!data.correo_proveedor || data.correo_proveedor.trim() === '') {
            errors.push('El correo es obligatorio');
        } else if (!validarEmail(data.correo_proveedor)) {
            errors.push('El correo no es válido');
        }
    } else {
        // Validaciones para actualización (solo si los campos están presentes)
        if (data.rut_proveedor !== undefined && !validarRUT(data.rut_proveedor)) {
            errors.push('El RUT del proveedor no es válido');
        }

        if (data.correo_proveedor !== undefined && !validarEmail(data.correo_proveedor)) {
            errors.push('El correo no es válido');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}


function validarDatosRepresentante(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        // Validaciones para creación (campos obligatorios)
        if (!data.nombre_representante || data.nombre_representante.trim() === '') {
            errors.push('El nombre del representante es obligatorio');
        }

        if (!data.apellido_representante || data.apellido_representante.trim() === '') {
            errors.push('El apellido del representante es obligatorio');
        }

        if (!data.rut_representante || data.rut_representante.trim() === '') {
            errors.push('El RUT del representante es obligatorio');
        } else if (!validarRUT(data.rut_representante)) {
            errors.push('El RUT del representante no es válido');
        }

        if (!data.cargo_representante || data.cargo_representante.trim() === '') {
            errors.push('El cargo del representante es obligatorio');
        }

        if (!data.fono_representante || data.fono_representante.trim() === '') {
            errors.push('El teléfono del representante es obligatorio');
        }

        if (!data.correo_representante || data.correo_representante.trim() === '') {
            errors.push('El correo del representante es obligatorio');
        } else if (!validarEmail(data.correo_representante)) {
            errors.push('El correo del representante no es válido');
        }
    } else {
        // Validaciones para actualización (solo si los campos están presentes)
        if (data.rut_representante !== undefined && !validarRUT(data.rut_representante)) {
            errors.push('El RUT del representante no es válido');
        }

        if (data.correo_representante !== undefined && !validarEmail(data.correo_representante)) {
            errors.push('El correo del representante no es válido');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * ========================================
 * SERVICIOS DE PROVEEDORES
 * ========================================
 */


export async function createProveedorService(proveedorData) {
    try {
        // Validar datos
        const validation = validarDatosProveedor(proveedorData, false);
        if (!validation.isValid) {
            return [null, validation.errors.join(', ')];
        }

        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);

        // Verificar si el RUT ya existe
        const existeRUT = await proveedorRepository.findOne({
            where: { rut_proveedor: proveedorData.rut_proveedor.trim() }
        });

        if (existeRUT) {
            return [null, 'Ya existe un proveedor con ese RUT'];
        }

        // Verificar si el correo ya existe
        const existeCorreo = await proveedorRepository.findOne({
            where: { correo_proveedor: proveedorData.correo_proveedor.trim().toLowerCase() }
        });

        if (existeCorreo) {
            return [null, 'Ya existe un proveedor con ese correo'];
        }

        // Crear proveedor
        const nuevoProveedor = proveedorRepository.create({
            rol_proveedor: proveedorData.rol_proveedor.trim(),
            rut_proveedor: proveedorData.rut_proveedor.trim(),
            fono_proveedor: proveedorData.fono_proveedor.trim(),
            correo_proveedor: proveedorData.correo_proveedor.trim().toLowerCase()
        });

        const proveedorGuardado = await proveedorRepository.save(nuevoProveedor);

        return [proveedorGuardado, null];

    } catch (error) {
        console.error('Error al crear proveedor:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function getProveedoresService(filtros = {}) {
    try {
        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);
        
        const queryBuilder = proveedorRepository.createQueryBuilder('proveedor')
            .leftJoinAndSelect('proveedor.materiales', 'materiales')
            .orderBy('proveedor.id_proveedor', 'DESC');

        // Aplicar filtros
        if (filtros.rol_proveedor) {
            queryBuilder.andWhere('proveedor.rol_proveedor = :rol', { 
                rol: filtros.rol_proveedor 
            });
        }

        if (filtros.search) {
            queryBuilder.andWhere(
                '(proveedor.rol_proveedor ILIKE :search OR ' +
                'proveedor.rut_proveedor ILIKE :search OR ' +
                'proveedor.correo_proveedor ILIKE :search)',
                { search: `%${filtros.search}%` }
            );
        }

        const proveedores = await queryBuilder.getMany();

        // Agregar estadísticas básicas
        const proveedoresConStats = proveedores.map(proveedor => ({
            ...proveedor,
            total_materiales: proveedor.materiales ? proveedor.materiales.length : 0
        }));

        return [proveedoresConStats, null];

    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function getProveedorByIdService(id_proveedor) {
    try {
        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);
        const representanteRepository = AppDataSource.getRepository(representanteSchema);

        // Obtener proveedor con sus materiales
        const proveedor = await proveedorRepository
            .createQueryBuilder('proveedor')
            .leftJoinAndSelect('proveedor.materiales', 'materiales')
            .where('proveedor.id_proveedor = :id', { id: id_proveedor })
            .getOne();

        if (!proveedor) {
            return [null, 'Proveedor no encontrado'];
        }

        // Obtener representantes
        const representantes = await representanteRepository.find({
            where: { proveedor: { id_proveedor } },
            order: { id_representante: 'DESC' }
        });

        // Calcular estadísticas
        const estadisticas = {
            total_materiales: proveedor.materiales ? proveedor.materiales.length : 0,
            total_representantes: representantes.length,
            materiales_activos: proveedor.materiales 
                ? proveedor.materiales.filter(m => m.activo).length 
                : 0
        };

        // Construir respuesta completa
        const proveedorCompleto = {
            ...proveedor,
            representantes,
            estadisticas
        };

        return [proveedorCompleto, null];

    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function updateProveedorService(id_proveedor, datosActualizados) {
    try {
        // Validar datos
        const validation = validarDatosProveedor(datosActualizados, true);
        if (!validation.isValid) {
            return [null, validation.errors.join(', ')];
        }

        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);

        // Verificar que el proveedor existe
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor }
        });

        if (!proveedor) {
            return [null, 'Proveedor no encontrado'];
        }

        // Verificar RUT único (si se está actualizando)
        if (datosActualizados.rut_proveedor && 
            datosActualizados.rut_proveedor !== proveedor.rut_proveedor) {
            
            const existeRUT = await proveedorRepository.findOne({
                where: { rut_proveedor: datosActualizados.rut_proveedor.trim() }
            });

            if (existeRUT) {
                return [null, 'Ya existe otro proveedor con ese RUT'];
            }
        }

        // Verificar correo único (si se está actualizando)
        if (datosActualizados.correo_proveedor && 
            datosActualizados.correo_proveedor.toLowerCase() !== proveedor.correo_proveedor) {
            
            const existeCorreo = await proveedorRepository.findOne({
                where: { correo_proveedor: datosActualizados.correo_proveedor.trim().toLowerCase() }
            });

            if (existeCorreo) {
                return [null, 'Ya existe otro proveedor con ese correo'];
            }
        }

        // Actualizar campos proporcionados
        if (datosActualizados.rol_proveedor !== undefined) {
            proveedor.rol_proveedor = datosActualizados.rol_proveedor.trim();
        }
        if (datosActualizados.rut_proveedor !== undefined) {
            proveedor.rut_proveedor = datosActualizados.rut_proveedor.trim();
        }
        if (datosActualizados.fono_proveedor !== undefined) {
            proveedor.fono_proveedor = datosActualizados.fono_proveedor.trim();
        }
        if (datosActualizados.correo_proveedor !== undefined) {
            proveedor.correo_proveedor = datosActualizados.correo_proveedor.trim().toLowerCase();
        }

        const proveedorActualizado = await proveedorRepository.save(proveedor);

        return [proveedorActualizado, null];

    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function deleteProveedorService(id_proveedor) {
    try {
        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);
        const materialRepository = AppDataSource.getRepository(MaterialesSchema);

        // Verificar que el proveedor existe
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor },
            relations: ['materiales']
        });

        if (!proveedor) {
            return [null, 'Proveedor no encontrado'];
        }

        // Verificar que no tenga materiales asociados
        const materialesAsociados = await materialRepository.count({
            where: { proveedor: { id_proveedor } }
        });

        if (materialesAsociados > 0) {
            return [null, `No se puede eliminar el proveedor porque tiene ${materialesAsociados} material(es) asociado(s)`];
        }

        // Eliminar proveedor
        await proveedorRepository.remove(proveedor);

        return [{ 
            mensaje: 'Proveedor eliminado exitosamente',
            id_proveedor 
        }, null];

    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        return [null, 'Error interno del servidor'];
    }
}

/**
 * ========================================
 * SERVICIOS DE REPRESENTANTES
 * ========================================
 */


export async function createRepresentanteService(id_proveedor, representanteData) {
    try {
        // Validar datos
        const validation = validarDatosRepresentante(representanteData, false);
        if (!validation.isValid) {
            return [null, validation.errors.join(', ')];
        }

        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);
        const representanteRepository = AppDataSource.getRepository(representanteSchema);

        // Verificar que el proveedor existe
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor }
        });

        if (!proveedor) {
            return [null, 'Proveedor no encontrado'];
        }

        // Verificar si el RUT ya existe para este proveedor
        const existeRUT = await representanteRepository.findOne({
            where: { 
                rut_representante: representanteData.rut_representante.trim(),
                proveedor: { id_proveedor }
            }
        });

        if (existeRUT) {
            return [null, 'Ya existe un representante con ese RUT para este proveedor'];
        }

        // Crear representante
        const nuevoRepresentante = representanteRepository.create({
            nombre_representante: representanteData.nombre_representante.trim(),
            apellido_representante: representanteData.apellido_representante.trim(),
            rut_representante: representanteData.rut_representante.trim(),
            cargo_representante: representanteData.cargo_representante.trim(),
            fono_representante: representanteData.fono_representante.trim(),
            correo_representante: representanteData.correo_representante.trim().toLowerCase(),
            proveedor: proveedor
        });

        const representanteGuardado = await representanteRepository.save(nuevoRepresentante);

        return [representanteGuardado, null];

    } catch (error) {
        console.error('Error al crear representante:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function getRepresentantesByProveedorService(id_proveedor) {
    try {
        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);
        const representanteRepository = AppDataSource.getRepository(representanteSchema);

        // Verificar que el proveedor existe
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor }
        });

        if (!proveedor) {
            return [null, 'Proveedor no encontrado'];
        }

        // Obtener representantes
        const representantes = await representanteRepository.find({
            where: { proveedor: { id_proveedor } },
            order: { id_representante: 'DESC' }
        });

        return [representantes, null];

    } catch (error) {
        console.error('Error al obtener representantes:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function updateRepresentanteService(id_representante, datosActualizados) {
    try {
        // Validar datos
        const validation = validarDatosRepresentante(datosActualizados, true);
        if (!validation.isValid) {
            return [null, validation.errors.join(', ')];
        }

        const representanteRepository = AppDataSource.getRepository(representanteSchema);

        // Verificar que el representante existe
        const representante = await representanteRepository.findOne({
            where: { id_representante },
            relations: ['proveedor']
        });

        if (!representante) {
            return [null, 'Representante no encontrado'];
        }

        // Verificar RUT único (si se está actualizando)
        if (datosActualizados.rut_representante && 
            datosActualizados.rut_representante !== representante.rut_representante) {
            
            const existeRUT = await representanteRepository.findOne({
                where: { 
                    rut_representante: datosActualizados.rut_representante.trim(),
                    proveedor: { id_proveedor: representante.proveedor.id_proveedor }
                }
            });

            if (existeRUT) {
                return [null, 'Ya existe otro representante con ese RUT para este proveedor'];
            }
        }

        // Actualizar campos proporcionados
        if (datosActualizados.nombre_representante !== undefined) {
            representante.nombre_representante = datosActualizados.nombre_representante.trim();
        }
        if (datosActualizados.apellido_representante !== undefined) {
            representante.apellido_representante = datosActualizados.apellido_representante.trim();
        }
        if (datosActualizados.rut_representante !== undefined) {
            representante.rut_representante = datosActualizados.rut_representante.trim();
        }
        if (datosActualizados.cargo_representante !== undefined) {
            representante.cargo_representante = datosActualizados.cargo_representante.trim();
        }
        if (datosActualizados.fono_representante !== undefined) {
            representante.fono_representante = datosActualizados.fono_representante.trim();
        }
        if (datosActualizados.correo_representante !== undefined) {
            representante.correo_representante = datosActualizados.correo_representante.trim().toLowerCase();
        }

        const representanteActualizado = await representanteRepository.save(representante);

        return [representanteActualizado, null];

    } catch (error) {
        console.error('Error al actualizar representante:', error);
        return [null, 'Error interno del servidor'];
    }
}


export async function deleteRepresentanteService(id_representante) {
    try {
        const representanteRepository = AppDataSource.getRepository(representanteSchema);

        // Verificar que el representante existe
        const representante = await representanteRepository.findOne({
            where: { id_representante }
        });

        if (!representante) {
            return [null, 'Representante no encontrado'];
        }

        // Eliminar representante
        await representanteRepository.remove(representante);

        return [{ 
            mensaje: 'Representante eliminado exitosamente',
            id_representante 
        }, null];

    } catch (error) {
        console.error('Error al eliminar representante:', error);
        return [null, 'Error interno del servidor'];
    }
}



export async function getProveedoresConRepresentantesService() {
    try {
        console.log('🔍 Iniciando getProveedoresConRepresentantesService...');
        
        const proveedorRepository = AppDataSource.getRepository(proveedoresSchema);

        console.log('📦 Repositorio obtenido correctamente');

        const proveedores = await proveedorRepository.find({
            relations: ['representantes'],
            order: { 
                id_proveedor: 'DESC' 
            }
        });

        console.log(`📊 Total proveedores encontrados: ${proveedores.length}`);

        if (proveedores.length === 0) {
            console.log('⚠️ No hay proveedores en la base de datos');
            return [[], null];
        }

        // Formatear la respuesta
        const proveedoresConRepresentantes = proveedores.map(proveedor => {
            // Tomar el primer representante si existe
            const representante = proveedor.representantes && proveedor.representantes.length > 0 
                ? proveedor.representantes[0] 
                : null;

            console.log(`${representante ? '✅' : '⚠️'} Proveedor ${proveedor.id_proveedor} (${proveedor.rol_proveedor}): ${representante ? 'CON' : 'SIN'} representante`);

            return {
                id_proveedor: proveedor.id_proveedor,
                rol_proveedor: proveedor.rol_proveedor,
                rut_proveedor: proveedor.rut_proveedor,
                fono_proveedor: proveedor.fono_proveedor,
                correo_proveedor: proveedor.correo_proveedor,
                representante: representante ? {
                    id_representante: representante.id_representante,
                    nombre_representante: representante.nombre_representante,
                    apellido_representante: representante.apellido_representante,
                    nombre_completo: `${representante.nombre_representante} ${representante.apellido_representante}`,
                    rut_representante: representante.rut_representante,
                    cargo_representante: representante.cargo_representante,
                    fono_representante: representante.fono_representante,
                    correo_representante: representante.correo_representante
                } : null
            };
        });

        console.log(`✅ Proveedores con representantes procesados: ${proveedoresConRepresentantes.length}`);
        console.log(`📊 Proveedores CON representante: ${proveedoresConRepresentantes.filter(p => p.representante).length}`);
        console.log(`📊 Proveedores SIN representante: ${proveedoresConRepresentantes.filter(p => !p.representante).length}`);

        return [proveedoresConRepresentantes, null];

    } catch (error) {
        console.error('❌ Error CRÍTICO en getProveedoresConRepresentantesService:');
        console.error('❌ Mensaje:', error.message);
        console.error('❌ Stack:', error.stack);
        console.error('❌ Error completo:', JSON.stringify(error, null, 2));
        return [null, `Error al obtener proveedores: ${error.message}`];
    }
}


export async function createProveedorConRepresentanteService(data) {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        console.log('🔍 Datos recibidos en service:', data);

        // 1. Validar datos del proveedor
        const validationProveedor = validarDatosProveedor(data.proveedor, false);
        if (!validationProveedor.isValid) {
            await queryRunner.rollbackTransaction();
            return [null, validationProveedor.errors.join(', ')];
        }

        // 2. Si hay representante, validar sus datos
        if (data.representante && Object.keys(data.representante).length > 0) {
            const validationRepresentante = validarDatosRepresentante(data.representante, false);
            if (!validationRepresentante.isValid) {
                await queryRunner.rollbackTransaction();
                return [null, validationRepresentante.errors.join(', ')];
            }
        }

        const proveedorRepository = queryRunner.manager.getRepository(proveedoresSchema);
        const representanteRepository = queryRunner.manager.getRepository(representanteSchema);

        // 3. Verificar si el RUT del proveedor ya existe
        const existeRUTProveedor = await proveedorRepository.findOne({
            where: { rut_proveedor: data.proveedor.rut_proveedor.trim() }
        });

        if (existeRUTProveedor) {
            await queryRunner.rollbackTransaction();
            return [null, 'Ya existe un proveedor con ese RUT'];
        }

        // 4. Verificar si el correo del proveedor ya existe
        const existeCorreoProveedor = await proveedorRepository.findOne({
            where: { correo_proveedor: data.proveedor.correo_proveedor.trim().toLowerCase() }
        });

        if (existeCorreoProveedor) {
            await queryRunner.rollbackTransaction();
            return [null, 'Ya existe un proveedor con ese correo'];
        }

        // 5. Crear el proveedor
        const nuevoProveedor = proveedorRepository.create({
            rol_proveedor: data.proveedor.rol_proveedor.trim(),
            rut_proveedor: data.proveedor.rut_proveedor.trim(),
            fono_proveedor: data.proveedor.fono_proveedor.trim(),
            correo_proveedor: data.proveedor.correo_proveedor.trim().toLowerCase()
        });

        const proveedorGuardado = await queryRunner.manager.save(proveedoresSchema, nuevoProveedor);
        console.log('✅ Proveedor creado:', proveedorGuardado.id_proveedor);

        let representanteGuardado = null;

        // 6. Si hay datos de representante, crearlo
        if (data.representante && Object.keys(data.representante).length > 0) {
            const nuevoRepresentante = representanteRepository.create({
                nombre_representante: data.representante.nombre_representante.trim(),
                apellido_representante: data.representante.apellido_representante.trim(),
                rut_representante: data.representante.rut_representante.trim(),
                cargo_representante: data.representante.cargo_representante.trim(),
                fono_representante: data.representante.fono_representante.trim(),
                correo_representante: data.representante.correo_representante.trim().toLowerCase()
            });

            // ✅ IMPORTANTE: Establecer la relación correctamente
            nuevoRepresentante.proveedor = proveedorGuardado;

            representanteGuardado = await queryRunner.manager.save(representanteSchema, nuevoRepresentante);
            console.log('✅ Representante creado:', representanteGuardado.id_representante);
        }

        // 7. Commit de la transacción
        await queryRunner.commitTransaction();

        // 8. Construir respuesta
        const resultado = {
            proveedor: proveedorGuardado,
            representante: representanteGuardado,
            mensaje: representanteGuardado 
                ? 'Proveedor y representante creados exitosamente'
                : 'Proveedor creado exitosamente (sin representante)'
        };

        return [resultado, null];

    } catch (error) {
        // Rollback en caso de error
        await queryRunner.rollbackTransaction();
        console.error('❌ Error al crear proveedor con representante:', error);
        return [null, 'Error interno del servidor'];
    } finally {
        // Liberar el queryRunner
        await queryRunner.release();
    }
}

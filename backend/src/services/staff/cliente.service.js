"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { encryptPassword } from "../../helpers/bcrypt.helper.js";
import { ClienteSchema } from "../../entity/personas/cliente.entity.js";
import { UserSchema } from "../../entity/personas/user.entity.js";


const userRepository = AppDataSource.getRepository(UserSchema);
const clienteRepository = AppDataSource.getRepository(ClienteSchema);


export async function getAllClientes() {
  return userRepository.find({
    where: { rol: Role.CLIENTE },
    order: {
      nombreCompleto: "ASC"
    }
  });
}

export async function getClienteById(userId) {
  const cliente = await userRepository.findOne({
    where: { 
      id: userId,
      rol: Role.CLIENTE 
    },
    relations: ["cliente"]
  });
  
  return cliente;
}

//Perfil general del cliente parte 1
export async function getUserById(userId) {
  return userRepository.findOne({
    where: { 
      id: userId,
      rol: Role.CLIENTE 
    }
  });
}

//Perfil cliente parte 2.
export async function getClienteDetalleById(userId) {
  try {
    // Busca en la tabla clientes por el id_user
    const clienteDetalle = await clienteRepository.findOne({
      where: { 
        user: { id: userId } 
      }
    });
    
    if (!clienteDetalle) {
      return {
        success: false,
        message: `No se encontraron datos de cliente para el usuario con ID ${userId}`,
        data: null
      };
    }
    
    return {
      success: true,
      message: "Datos de cliente encontrados",
      data: clienteDetalle
    };
    
  } catch (error) {
    console.error("Error al buscar detalles de cliente:", error);
    return {
      success: false,
      message: `Error al consultar la base de datos: ${error.message}`,
      data: null,
      error: error.toString()
    };
  }
}


//Crear un usuario con cliente perfil completo

export async function createPerfilFull(userData, clienteData) {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. Crear usuario con rol cliente
      const userRepo = queryRunner.manager.getRepository(UserSchema);
      
      // Asegurar rol cliente
      userData.rol = Role.CLIENTE;
      
      // Encriptar contraseña
      if (userData.password) {
        userData.password = await encryptPassword(userData.password);
      }
      
      const user = userRepo.create(userData);
      const savedUser = await userRepo.save(user);
      
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      
      clienteData.user = savedUser;
      
      const cliente = clienteRepo.create(clienteData);
      const savedCliente = await clienteRepo.save(cliente);
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
      
      return { 
        success: true, 
        message: "Perfil de cliente creado exitosamente",
        data: {
          userId: savedUser.id,
          clienteId: savedCliente.id_cliente
        }
      };
      
    } catch (error) {
      // Revertir cambios si hay error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar recursos
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error("Error al crear perfil de cliente:", error);
    
    
    if (error.code === '23505') { 
      if (error.detail.includes('rut')) {
        return { 
          success: false, 
          message: "El RUT ingresado ya existe en el sistema" 
        };
      } else if (error.detail.includes('email')) {
        return { 
          success: false, 
          message: "El correo electrónico ingresado ya está registrado" 
        };
      }
    }

    return { 
      success: false, 
      message: `Error al crear perfil: ${error.message}`
    };
  }
}


//Crear medio perfil solo cliente
export async function createMedioPerfil(userId, clienteData) {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const userRepo = queryRunner.manager.getRepository(UserSchema);
      const usuario = await userRepo.findOne({
        where: { 
          id: userId
        },
        relations: ["cliente"]
      });
      
      if (!usuario) {
        throw new Error(`No existe un usuario con ID ${userId}`);
      }
      
      if (usuario.rol !== Role.CLIENTE) {
        usuario.rol = Role.CLIENTE;
        await userRepo.save(usuario);
      }
      
      if (usuario.cliente) {
        throw new Error(`El usuario ya tiene un perfil de cliente asociado`);
      }
      
      // Crear perfil cliente
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      
      // Asociar al usuario
      clienteData.user = usuario;
      
      // Crear cliente
      const cliente = clienteRepo.create(clienteData);
      const savedCliente = await clienteRepo.save(cliente);
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
      
      return { 
        success: true, 
        message: "Perfil de cliente añadido exitosamente",
        data: {
          userId: usuario.id,
          clienteId: savedCliente.id_cliente
        }
      };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error("Error al crear medio perfil:", error);
    return { 
      success: false, 
      message: error.message
    };
  }
}



export async function updateMedioPerfil(userId, clienteData) {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Verificar que el usuario exista y tenga perfil cliente
      const userRepo = queryRunner.manager.getRepository(UserSchema);
      const usuario = await userRepo.findOne({
        where: { 
          id: userId
        },
        relations: ["cliente"]
      });
      
      // Validar que el usuario exista
      if (!usuario) {
        throw new Error(`No existe un usuario con ID ${userId}`);
      }
      
      // Validar que el usuario tenga rol cliente
      if (usuario.rol !== Role.CLIENTE) {
        throw new Error(`El usuario no tiene rol de cliente`);
      }
      
      // Validar que tenga un perfil cliente
      if (!usuario.cliente) {
        throw new Error(`El usuario no tiene un perfil de cliente para actualizar`);
      }
      
      // Actualizar el perfil de cliente
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      
      // Obtener ID del cliente
      const clienteId = usuario.cliente.id_cliente;
      
      // Actualizar solo los campos proporcionados
      await clienteRepo.update(
        { id_cliente: clienteId },
        // Filtrar propiedades undefined para no sobrescribir con nulls
        Object.fromEntries(
          Object.entries(clienteData).filter(([_, v]) => v !== undefined)
        )
      );
      
      
      const clienteActualizado = await clienteRepo.findOne({
        where: { id_cliente: clienteId }
      });
      
      
      await queryRunner.commitTransaction();
      
      return { 
        success: true, 
        message: "Perfil de cliente actualizado exitosamente",
        data: {
          userId: usuario.id,
          cliente: clienteActualizado
        }
      };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error("Error al actualizar perfil de cliente:", error);
    return { 
      success: false, 
      message: error.message
    };
  }
}

export async function updatePerfilFull(userId, userData, clienteData) {
  try {
    // Iniciar transacción
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const userRepo = queryRunner.manager.getRepository(UserSchema);
      const usuario = await userRepo.findOne({
        where: { id: userId },
        relations: ["cliente"]
      });
      
      // Validaciones
      if (!usuario) {
        throw new Error(`No existe un usuario con ID ${userId}`);
      }
      
      if (usuario.rol !== Role.CLIENTE) {
        throw new Error(`Esta función solo actualiza perfiles de usuarios con rol cliente`);
      }
      
      if (!usuario.cliente) {
        throw new Error(`El usuario no tiene un perfil de cliente asociado`);
      }
      
      // Eliminar el rol si viene en los datos para asegurar que no cambie
      if (userData.rol) {
        delete userData.rol;
      }
      
      // Encriptar la contraseña si viene en los datos
      if (userData.password) {
        userData.password = await encryptPassword(userData.password);
      }
      
      //  Actualizar usuario
      await userRepo.update(
        { id: userId },
        // Solo actualizar campos proporcionados
        Object.fromEntries(
          Object.entries(userData).filter(([_, v]) => v !== undefined)
        )
      );
      
      // 4. Actualizar cliente
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      const clienteId = usuario.cliente.id_cliente;
      
      await clienteRepo.update(
        { id_cliente: clienteId },
        // Solo actualizar campos proporcionados
        Object.fromEntries(
          Object.entries(clienteData).filter(([_, v]) => v !== undefined)
        )
      );
      
      // 5. Obtener datos actualizados
      const perfilActualizado = await userRepo.findOne({
        where: { id: userId },
        relations: ["cliente"]
      });
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
      
      return { 
        success: true, 
        message: "Perfil actualizado exitosamente",
        data: perfilActualizado
      };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error("Error al actualizar perfil completo:", error);
    return { 
      success: false, 
      message: error.message
    };
  }
}


export async function blockUserCliente(userId, motivo = "") {
  try {
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      
      const userRepo = queryRunner.manager.getRepository(UserSchema);
      const usuario = await userRepo.findOne({
        where: { id: userId }
      });
      
     
      if (!usuario) {
        throw new Error(`No existe un usuario con ID ${userId}`);
      }
      
      if (usuario.rol !== Role.CLIENTE) {
        throw new Error(`El usuario no tiene rol cliente`);
      }
      
    
      if (usuario.rol === Role.BLOQUEADO) {
        throw new Error(`El usuario ya se encuentra bloqueado`);
      }
      
      // 2. Cambiar rol a BLOQUEADO
      await userRepo.update(
        { id: userId },
        { 
          rol: Role.BLOQUEADO,
          
        }
      );
      
      // Confirmar transacción
      await queryRunner.commitTransaction();
      
      return { 
        success: true, 
        message: "Usuario bloqueado exitosamente" + (motivo ? `: ${motivo}` : ""),
        userId: userId
      };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error(`Error al bloquear usuario cliente ${userId}:`, error);
    return { 
      success: false, 
      message: error.message
    };
  }
}


export async function deleteUserCliente(userId, softDelete = true) {
  try {
    // Iniciar transacción
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const userRepo = queryRunner.manager.getRepository(UserSchema);
      const usuario = await userRepo.findOne({
        where: { id: userId },
        relations: ["cliente"]
      });
      
      if (!usuario) {
        throw new Error(`No existe un usuario con ID ${userId}`);
      }
      
      if (usuario.rol !== Role.CLIENTE) {
        throw new Error(`El usuario no tiene rol cliente`);
      }
      
      if (usuario.cliente) {
        const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
        await clienteRepo.delete(usuario.cliente.id_cliente);
      }
      
      if (softDelete) {
        // Soft delete: cambiar a rol bloqueado
        await userRepo.update(
          { id: userId },
          { rol: Role.BLOQUEADO }
        );
        
        await queryRunner.commitTransaction();
        
        return { 
          success: true, 
          message: "Usuario bloqueado y perfil de cliente eliminado exitosamente",
          softDelete: true
        };
      } else {
        await userRepo.delete(userId);
        
        await queryRunner.commitTransaction();
        
        return { 
          success: true, 
          message: "Usuario y perfil de cliente eliminados completamente",
          softDelete: false
        };
      }
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error(`Error al eliminar usuario cliente ${userId}:`, error);
    return { 
      success: false, 
      message: error.message
    };
  }
}
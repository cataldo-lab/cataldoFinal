"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { encryptPassword } from "../../helpers/bcrypt.helper.js";
import { ClienteSchema } from "../../entity/personas/cliente.entity.js";
import UserSchema, { Role } from "../../entity/personas/user.entity.js";


const userRepository = AppDataSource.getRepository(UserSchema);
const clienteRepository = AppDataSource.getRepository(ClienteSchema);



export async function searchClientes(filtros = {}) {
  const queryBuilder = userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.cliente", "cliente")
    .where("user.rol = :rol", { rol: Role.CLIENTE });
    
  if (filtros.nombre) {
    queryBuilder.andWhere("user.nombreCompleto ILIKE :nombre", 
      { nombre: `%${filtros.nombre}%` });
  }

  if (filtros.email) {
    queryBuilder.andWhere("user.email ILIKE :email", 
      { email: `%${filtros.email}%` });
  }
  
  if (filtros.categoria) {
    queryBuilder.andWhere("cliente.categoria_cliente = :categoria", 
      { categoria: filtros.categoria });
  }
  
  return await queryBuilder.getMany();
}


export async function getAllClientes(page = 1, limit = 10) {
  const [clientes, total] = await userRepository.findAndCount({
    where: { rol: Role.CLIENTE },
    order: { nombreCompleto: "ASC" },
    skip: (page - 1) * limit,
    take: limit
  });
  
  return {
    clientes,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
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

export async function getUserById(userId) {
  return userRepository.findOne({
    where: { 
      id: userId,
      rol: Role.CLIENTE 
    }
  });
}

export async function getClienteDetalleById(userId) {
  try {
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

export async function createPerfilFull(userData, clienteData) {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const userRepo = queryRunner.manager.getRepository(UserSchema);
      
      userData.rol = Role.CLIENTE;
      
      if (userData.password) {
        userData.password = await encryptPassword(userData.password);
      }
      
      const user = userRepo.create(userData);
      const savedUser = await userRepo.save(user);
      
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      clienteData.user = savedUser;
      
      const cliente = clienteRepo.create(clienteData);
      const savedCliente = await clienteRepo.save(cliente);
      
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
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
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
      
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      clienteData.user = usuario;
      
      const cliente = clienteRepo.create(clienteData);
      const savedCliente = await clienteRepo.save(cliente);
      
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
        throw new Error(`El usuario no tiene rol de cliente`);
      }
      
      if (!usuario.cliente) {
        throw new Error(`El usuario no tiene un perfil de cliente para actualizar`);
      }
      
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      const clienteId = usuario.cliente.id_cliente;
      
      await clienteRepo.update(
        { id_cliente: clienteId },
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
        throw new Error(`Esta función solo actualiza perfiles de usuarios con rol cliente`);
      }
      
      if (!usuario.cliente) {
        throw new Error(`El usuario no tiene un perfil de cliente asociado`);
      }
      
      if (userData.rol) {
        delete userData.rol;
      }
      
      if (userData.password) {
        userData.password = await encryptPassword(userData.password);
      }
      
      await userRepo.update(
        { id: userId },
        Object.fromEntries(
          Object.entries(userData).filter(([_, v]) => v !== undefined)
        )
      );
      
      const clienteRepo = queryRunner.manager.getRepository(ClienteSchema);
      const clienteId = usuario.cliente.id_cliente;
      
      await clienteRepo.update(
        { id_cliente: clienteId },
        Object.fromEntries(
          Object.entries(clienteData).filter(([_, v]) => v !== undefined)
        )
      );
      
      const perfilActualizado = await userRepo.findOne({
        where: { id: userId },
        relations: ["cliente"]
      });
      
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
      
      await userRepo.update(
        { id: userId },
        { rol: Role.BLOQUEADO }
      );
      
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
"use strict";
import { AppDataSource } from "../../config/configDb.js";
import Cliente from "../../entity/personas/cliente.entity.js";
import { User } from "../../entity/personas/user.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { Producto_Operacion } from "../entity/producto_operacion.entity.js";
import { Encuesta } from "../entity/encuesta.entity.js";
import { Operacion } from "../entity/operacion.entity.js";

//Se trabaja con el rol cliente

//Cliente mira su perfil
export async function getDataClienteService(){

}



//Cliente mira historial de operaciones
export async function getDataOperacionService(){

}


//Cliente rellena encuesta asociada a un pedido
export async function createEncuestaPorOperacionService(body){

}

//Cliente mira el estado de su operacion actual
export async function getStateOperacionService(){

}



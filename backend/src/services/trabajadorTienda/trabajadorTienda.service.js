"use strict";
import { AppDataSource } from "../../config/configDb.js";
import TrabajadorTienda from "../entity/personas/trabajador_tienda.entity.js";
import { User } from "../../entity/personas/user.entity.js";
import { Cliente } from "../../entity/personas/cliente.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { Producto_Operacion } from "../entity/producto_operacion.entity.js";
import { Encuesta } from "../entity/encuesta.entity.js";
import { Pais } from "../../entity/direccion/pais.entity.js";
import { Region } from "../../entity/direccion/region.entity.js";
import { Comuna } from "../../entity/direccion/comuna.entity.js";
import { Direccion } from "../../entity/direccion/provincia.entity.js";
import { Operacion } from "../entity/operacion.entity.js";


// Puede ver datos de los clientes, como sus compras, encuestas respondidas, etc.
// Puede gestionar productos, como ver su estado, historial de operaciones, etc.
// Puede gestionar encuestas, como ver las respondidas por los clientes, etc.
// Puede ver y actualizar su propia informacion personal y de cliente
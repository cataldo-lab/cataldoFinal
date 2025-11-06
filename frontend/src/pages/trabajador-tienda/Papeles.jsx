import { useState } from 'react';
import { useClientes } from '@hooks/clientes/useClientes';
import { useSearchClientes } from '@hooks/clientes/useSearchClientes';
import PopUpCrearCliente from '@components/popup/trabajadorTienda/cliente/popUpCrearCliente';
import PopUpDetalleCliente from '@components/popup/trabajadorTienda/cliente/popUpDetalleCliente';
import PopUpEditarCliente from '@components/popup/trabajadorTienda/cliente/popUpEditarCliente';
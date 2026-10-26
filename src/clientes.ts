import type { cliente } from './types';

const clientes: cliente[] = [];

function cadCliente(cliente: cliente): void {
    clientes.push(cliente);
}

function listarClientes(): cliente[] {
   return clientes;
}

export {cadCliente, listarClientes}